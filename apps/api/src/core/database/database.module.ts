import { Module } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from 'database'
import { envConfig } from '@/config/env/env.config'

export const DATABASE_CONN = 'DATABASE_CONN'

@Module({
  providers: [
    {
      provide: DATABASE_CONN,
      useFactory: async () => {
        const connection = postgres(
          process.env.DATABASE_URL ?? envConfig.get('DATABASE_URL'),
        )
        return drizzle(connection, { schema })
      },
    },
  ],
  exports: [DATABASE_CONN],
})
export class DatabaseModule {}
