import type { Config } from 'drizzle-kit'

export default {
  schema: './models/index.ts',
  out: './drizzle',
} satisfies Config
