import { Test } from '@nestjs/testing'
import { Type, ValidationPipe } from '@nestjs/common'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { AppModule } from '@/app.module'
import { migratedb } from 'database'
import { DatabaseExceptionFilter } from '@/filters/database-exception.filter'

interface SetupTestAppProps {
  mockProviders?: Array<[any, any]>
}

export const setupTestApp = async ({
  mockProviders,
}: SetupTestAppProps = {}) => {
  console.log('Setting up PostgreSQL container...')
  const container = await new PostgreSqlContainer('pgvector/pgvector:pg16')
    .withUsername('testuser')
    .withPassword('testpass')
    .withDatabase('testdb')
    .withExposedPorts(5432)
    .start()

  const port = container.getMappedPort(5432)
  const host = container.getHost()

  const connectionString = `postgres://testuser:testpass@${host}:${port}/testdb`
  process.env.DATABASE_URL = connectionString

  // Run the migrations
  console.log('Running database migrations...')
  try {
    await migratedb(connectionString)
    console.log('Database migrations completed successfully.')
  } catch (error) {
    console.error('Error running migrations:', error)
    throw error
  }

  console.log('Initializing NestJS application...')
  const moduleFixtureBuilder = Test.createTestingModule({
    imports: [AppModule],
  })

  // Override providers with mock services
  if (mockProviders) {
    for (const [serviceClass, mockImplementation] of mockProviders) {
      moduleFixtureBuilder
        .overrideProvider(serviceClass)
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
    teardown: async () => {
      console.log('Tearing down PostgreSQL container and NestJS application...')
      await app.close()
      await container.stop()
      console.log('Teardown completed')
    },
  }
}
