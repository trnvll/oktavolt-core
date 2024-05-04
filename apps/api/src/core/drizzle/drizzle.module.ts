import { Module } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from 'database'
import { ConfigService } from '@nestjs/config'

export const DATABASE_CONN = 'DATABASE_CONN'

@Module({
  providers: [
    {
      provide: DATABASE_CONN,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const connection = postgres(config.get('DATABASE_URL'))
        return drizzle(connection, { schema })
      },
    },
    ConfigService,
  ],
  exports: [DATABASE_CONN],
})
export class DrizzleModule {}
