import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { DatabaseService } from '@/core/database/database.service'
import { eq } from 'drizzle-orm'
import { Users } from 'database'
import { NotificationsService } from '@/core/notifications/services/notifications.service'
import { SqsService } from '@/core/sqs/sqs.service'
import { UserEmbeddingsService } from '@/modules/users/services/user-embeddings.service'
import { EventTypeEnum } from 'shared'
import {
  vi,
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from 'vitest'
import { pruneFlakyVariables } from '../../_utils/test.utils'
import { setupTestApp } from '../../_setup/app.setup'
import { plainToInstance } from 'class-transformer'
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto'

describe('UsersController (e2e)', () => {
  let app: INestApplication
  let context: {
    database: DatabaseService
    notificationService: NotificationsService
    sqsService: SqsService
    userEmbeddingsService: UserEmbeddingsService
  }
  let teardown: () => Promise<void>
  let cleanDatabase: () => Promise<void>

  beforeAll(async () => {
    const setup = await setupTestApp({
      mockProviders: [
        [
          NotificationsService,
          { createOrUpdateSubscriber: vi.fn(), sendEmailNotification: vi.fn() },
        ],
        [SqsService, { sendMessage: vi.fn() }],
        [UserEmbeddingsService, { generateAndSaveEmbeddings: vi.fn() }],
      ],
    })
    app = setup.app
    teardown = setup.teardown
    cleanDatabase = setup.cleanDatabase

    context = {
      database: setup.resolve(DatabaseService, true),
      notificationService: setup.resolve(NotificationsService),
      sqsService: setup.resolve(SqsService),
      userEmbeddingsService: setup.resolve(UserEmbeddingsService),
    }
  })

  afterEach(async () => {
    await cleanDatabase()
  })

  afterAll(async () => {
    await teardown()
  })

  it('[POST /users] - Should create user.', async () => {
    // Business rules:
    // 1. User data should be saved in the database.
    // 2. Should send welcome email to user.
    // 3. Should create user embeddings.
    // 4. Should store the user created event.
    // 5. User data dto should have been returned in the response.

    const createUserDto: CreateUserDto = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      dateOfBirth: faker.date.past().toISOString() as any,
    }

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)

    // Business rule 1.
    const savedUser = await context.database.db.query.users.findFirst({
      where: eq(Users.email, createUserDto.email),
    })
    expect(savedUser).toBeDefined()
    if (!savedUser) throw new Error('User not found.')
    expect(savedUser.email).toBe(createUserDto.email)

    // Business rule 2.
    expect(
      context.notificationService.sendEmailNotification,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ userId: savedUser.userId }),
    )
    // Business rule 3.
    expect(
      context.userEmbeddingsService.generateAndSaveEmbeddings,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ userId: savedUser.userId }),
    )
    // Business rule 4.
    expect(context.sqsService.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: savedUser.userId,
        type: EventTypeEnum.UserCreated,
      }),
    )

    // Business rule 5.
    pruneFlakyVariables(response.body, ['userId', 'dob'])
    expect(response.body).toMatchSnapshot()
  })

  it('[GET /users] - Should get all users.', async () => {
    // Business rules:
    // 1. Should return all users from the database in an appropriate, paginated response.

    // Arrange
    let dtos: CreateUserDto[] = [
      {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.past().toISOString() as any,
      },
      {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.past().toISOString() as any,
      },
      {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.past().toISOString() as any,
      },
    ]

    dtos = dtos.map((dto) => plainToInstance(CreateUserDto, dto))
    await context.database.db
      .insert(Users)
      .values(dtos.map((dto) => CreateUserDto.toEntity(dto)))

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200)

    // Business rule 1.
    const users = await context.database.db.query.users.findMany()
    expect(response.body.results).toHaveLength(users.length)

    response.body.results.forEach((user: any) => {
      pruneFlakyVariables(user, ['dob', 'dateOfBirth'])
    })
    expect(response.body).toMatchSnapshot()
  })
})
