import { Module } from '@nestjs/common'
import { envConfig } from '@/config/env/env.config'
import { schema } from 'tsdb'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export const TSDB_CONN = 'TSDB_CONN'

@Module({
  providers: [
    {
      provide: TSDB_CONN,
      useFactory: async () => {
        const connection = postgres(envConfig.get('TS_DATABASE_URL'))
        return drizzle(connection, { schema })
      },
    },
  ],
  exports: [TSDB_CONN],
})
export class TsdbModule {}
