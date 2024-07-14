import { defineConfig } from 'drizzle-kit'
import { config } from '@/utils/config'

export default defineConfig({
  schema: './lib/models/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config().DATABASE_URL,
  },
  out: './drizzle',
  verbose: true,
  strict: true,
})
