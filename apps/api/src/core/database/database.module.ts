import { Module } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from 'database'
import { ConfigService } from '@nestjs/config'
import { DatabaseConfig } from '@/config/database.config'

export const DATABASE_CONN = 'DATABASE_CONN'

@Module({
  providers: [
    {
      provide: DATABASE_CONN,
      useFactory: async (configService: ConfigService) => {
        const databaseConfig = configService.get<DatabaseConfig>('database')

        if (!databaseConfig?.uri) {
          throw new Error('Database URI is missing.')
        }

        const connection = postgres(databaseConfig.uri)
        return drizzle(connection, { schema })
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONN],
})
export class DatabaseModule {}
