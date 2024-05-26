import { defineConfig } from 'drizzle-kit'
import { config } from '@/utils/config'

export default defineConfig({
  schema: './lib/models/index.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: config().DATABASE_URL,
  },
  out: './drizzle',
  verbose: true,
  strict: true,
})
