import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate as drizzleMigrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as path from 'path'

export const migratedb = async (connectionString: string | undefined) => {
  const migrationsFolder = path.resolve(__dirname, '../../drizzle')
  if (!connectionString) {
    throw new Error(`Connection string is not defined, got ${connectionString}`)
  }

  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql)

  await drizzleMigrate(db, { migrationsFolder })
  await sql.end()
  console.log('Migration completed and connection closed.')
}
