import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { config } from './config'

const connectionString = config().DATABASE_URL
if (!connectionString) {
  throw new Error(`Connection string is not defined, got ${connectionString}`)
}

const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql)

await migrate(db, { migrationsFolder: 'drizzle' })

await sql.end()
