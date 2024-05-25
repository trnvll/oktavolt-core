import { INestApplication } from '@nestjs/common'
import { CreateUsersDto } from '@/modules/users/dtos/create-user.dto'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { DatabaseService } from '@/core/database/database.service'
import { eq } from 'drizzle-orm'
import { Users } from 'database'
import { NotificationsService } from '@/core/notifications/services/notifications.service'
import { SqsService } from '@/core/sqs/sqs.service'
import { UserEmbeddingsService } from '@/modules/users/services/user-embeddings.service'
import { EventTypeEnum } from 'shared'
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { getQueueToken } from '@nestjs/bull'
import { setupTestApp } from '../../_utils/app.utils'
import { pruneFlakyVariables } from '../../_utils/test.utils'

faker.seed(42)

describe('UsersController (e2e)', () => {
  let app: INestApplication
  let context: {
    database: DatabaseService
    notificationService: NotificationsService
    sqsService: SqsService
    userEmbeddingsService: UserEmbeddingsService
    userEventsQueue: Queue
  }
  let teardown: () => Promise<void>

  beforeAll(async () => {
    const setup = await setupTestApp({
      mockProviders: [
        [NotificationsService, { createOrUpdateSubscriber: vi.fn() }],
        [SqsService, { sendMessage: vi.fn() }],
        [UserEmbeddingsService, { generateAndSaveEmbeddings: vi.fn() }],
        /*
        [
          LlmEmbeddingsService,
          {
            generateEmbeddings: vi.fn(() => [
              [0.3939302, 0.391039, 0.393029392],
            ]),
          },
        ],
         */
      ],
    })
    app = setup.app
    teardown = setup.teardown

    context = {
      database: setup.resolve(DatabaseService, true),
      notificationService: setup.resolve(NotificationsService),
      sqsService: setup.resolve(SqsService),
      userEmbeddingsService: setup.resolve(UserEmbeddingsService),
      userEventsQueue: app.get(getQueueToken(QueueEnum.UserEvents)),
    }
  })

  afterAll(async () => {
    await teardown()
  })

  it('should create multiple users and trigger the appropriate events', async () => {
    const createUsersDto: CreateUsersDto = {
      data: [
        {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phone: faker.phone.number().split(' ')[0] as any,
          dateOfBirth: faker.date.past().toISOString() as any,
        },
      ],
    }

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto)
      .expect(201)

    // Business rules:
    // 1. User data should be saved in the database.
    const savedUser = await context.database.db.query.users.findFirst({
      where: eq(Users.email, createUsersDto.data[0].email),
    })
    expect(savedUser).toBeDefined()
    if (!savedUser) throw new Error('User not found.')
    expect(savedUser.email).toBe(createUsersDto.data[0].email)

    // 2. Background job should have been triggered to send a welcome email to the user.
    // 3. Background job should have been triggered to generate and store user embeddings.
    // 4. Background job should have been triggered to store the user created event.
    // To verify these background jobs, we need to mock the respective services and check if the methods were called.

    expect(
      context.notificationService.createOrUpdateSubscriber,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ userId: savedUser.userId }),
    )
    expect(
      context.userEmbeddingsService.generateAndSaveEmbeddings,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ userId: savedUser.userId }),
    )
    expect(context.sqsService.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: savedUser.userId,
        type: EventTypeEnum.UserCreated,
      }),
    )

    pruneFlakyVariables(response.body, ['userId', 'dob'])

    // 5. User data dto should have been returned in the response (use snapshot to validate).
    expect(response.body).toMatchSnapshot()
  })
})
