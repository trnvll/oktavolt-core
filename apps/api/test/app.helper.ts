import { Test, TestingModule } from '@nestjs/testing'
import { Type } from '@nestjs/common'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { AppModule } from '@/app.module'
import { migratedb } from 'database'

export const setupTestApp = async () => {
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
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleFixture.createNestApplication()
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
