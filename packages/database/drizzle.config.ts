import { defineConfig } from 'drizzle-kit'
import { config } from '@/utils/config'
import path from 'path'

const out = path.resolve(__dirname, './drizzle')
const schema = path.resolve(__dirname, './lib/models/index.ts')

export default defineConfig({
  schema,
  driver: 'pg',
  dbCredentials: {
    connectionString: config().DATABASE_URL,
  },
  out,
  verbose: true,
  strict: true,
})
