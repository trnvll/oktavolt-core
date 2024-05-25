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
import { setupTestApp } from '../../app.helper'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('UsersController (e2e)', () => {
  let app: INestApplication
  let context: {
    database: DatabaseService
    notificationService: NotificationsService
    sqsService: SqsService
    userEmbeddingsService: UserEmbeddingsService
    // userEventsQueue: Queue
  }
  let teardown: () => Promise<void>

  beforeAll(async () => {
    const testApp = await setupTestApp()
    app = testApp.app
    teardown = testApp.teardown

    context = {
      database: testApp.resolve(DatabaseService, true),
      notificationService: testApp.resolve(NotificationsService),
      sqsService: testApp.resolve(SqsService),
      userEmbeddingsService: testApp.resolve(UserEmbeddingsService),
      // userEventsQueue: app.get(QueueEnum.UserEvents),
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
          phone: faker.phone.number(),
          dateOfBirth: faker.date.past(),
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

    const sendWelcomeEmailSpy = jest.spyOn(
      context.notificationService,
      'sendEmailNotification',
    )
    const generateEmbeddingsSpy = jest.spyOn(
      context.userEmbeddingsService,
      'generateAndSaveEmbeddings',
    )
    const sendMessageSpy = jest.spyOn(context.sqsService, 'sendMessage')

    // Triggering event handling manually for the sake of the test
    // await context.userEventsQueue.processJobs()

    expect(sendWelcomeEmailSpy).toHaveBeenCalledWith(
      savedUser.userId,
      savedUser.email,
    )
    expect(generateEmbeddingsSpy).toHaveBeenCalledWith(savedUser)
    expect(sendMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: savedUser.userId,
        type: EventTypeEnum.UserCreated,
      }),
    )

    // 5. User data dto should have been returned in the response (use snapshot to validate).
    expect(response.body).toMatchSnapshot()
  })
})
