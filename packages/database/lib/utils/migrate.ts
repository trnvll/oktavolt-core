import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { config } from '@/utils/config'

const connectionString = config().DATABASE_URL
if (!connectionString) {
  throw new Error(`Connection string is not defined, got ${connectionString}`)
}

const sql = postgres(connectionString, { max: 1 })
const db = drizzle(sql)

migrate(db, { migrationsFolder: 'drizzle' })
  .then(() => sql.end())
  .then(() => console.log('Migration completed and connection closed.'))
  .catch((error) => {
    console.error('Error during migration:', error)
    void sql.end()
  })
