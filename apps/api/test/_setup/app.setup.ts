import { Test } from '@nestjs/testing'
import { Type, ValidationPipe } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { DatabaseExceptionFilter } from '@/filters/database-exception.filter'
import { cleanTestDatabase, setupTestDatabase } from './db.setup'
import { vi } from 'vitest'
import { DatabaseService } from '@/core/database/database.service'

interface SetupTestAppProps {
  mockProviders?: Array<[any, any]>
}

export const setupTestApp = async ({
  mockProviders,
}: SetupTestAppProps = {}) => {
  const container = await setupTestDatabase()

  // Override DATABASE_URL with the connection URI of the PostgreSQL container
  vi.stubEnv('DATABASE_URL', container.getConnectionUri())

  console.log('Initializing NestJS application...')
  const moduleFixtureBuilder = Test.createTestingModule({
    imports: [AppModule],
  })

  // Override providers with mock services
  if (mockProviders) {
    for (const [providerClass, mockImplementation] of mockProviders) {
      moduleFixtureBuilder
        .overrideProvider(providerClass)
        .useValue(mockImplementation)
    }
  }

  const moduleFixture = await moduleFixtureBuilder.compile()

  const app = moduleFixture.createNestApplication()

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useGlobalFilters(new DatabaseExceptionFilter())

  await app.init()

  console.log('✓ Setup completed for test fixture')

  return {
    app,
    resolve: <T>(ctx: Type<T>, useModuleFixture = false) =>
      useModuleFixture ? moduleFixture.get<T>(ctx) : app.get<T>(ctx),
    cleanDatabase: async () => {
      console.log('Cleaning test database...')
      await cleanTestDatabase(moduleFixture.get(DatabaseService))
      console.log('Database cleaned')
    },
    teardown: async () => {
      console.log('Tearing down PostgreSQL container and NestJS application...')
      await app.close()
      await container.stop()
      console.log('Teardown completed')
    },
  }
}
