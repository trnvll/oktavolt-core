import { Module } from '@nestjs/common'
import { schema } from 'tsdb'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { ConfigService } from '@nestjs/config'
import { DatabaseConfig } from '@/config/database.config'

export const TSDB_CONN = 'TSDB_CONN'

@Module({
  providers: [
    {
      provide: TSDB_CONN,
      useFactory: async (configService: ConfigService) => {
        const databaseConfig = configService.get<DatabaseConfig>('database')

        if (!databaseConfig?.uri) {
          throw new Error('Time series database url is missing.')
        }

        const connection = postgres(databaseConfig.uri)
        return drizzle(connection, { schema })
      },
      inject: [ConfigService],
    },
  ],
  exports: [TSDB_CONN],
})
export class TsdbModule {}
