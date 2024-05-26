import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { migratedb } from 'database'
import { DatabaseService } from '@/core/database/database.service'
import { sql } from 'drizzle-orm'

export const setupTestDatabase = async () => {
  console.log('Setting up PostgreSQL container...')

  const container = await new PostgreSqlContainer('pgvector/pgvector:pg16')
    .withUsername('testuser')
    .withPassword('testpass')
    .withDatabase('testdb')
    .withExposedPorts(5432)
    .start()

  const connectionString = container.getConnectionUri()

  // Run the migrations
  console.log('Running database migrations...')
  try {
    await migratedb(connectionString)
    console.log('Database migrations completed successfully.')
  } catch (error) {
    console.error('Error running migrations:', error)
    throw error
  }

  return container
}

export const cleanTestDatabase = async ({ db }: DatabaseService) => {
  const tables = (await db.execute(
    sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`,
  )) as { tablename: string }[]
  for (const table of tables) {
    await db.execute(
      sql`TRUNCATE TABLE ${sql.raw(table.tablename)} RESTART IDENTITY CASCADE`,
    )
  }
}
