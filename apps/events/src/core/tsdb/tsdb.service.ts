import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { Inject, Injectable } from '@nestjs/common'
import { TSDB_CONN } from '@/core/tsdb/tsdb.module'
import { schema } from 'tsdb'

@Injectable()
export class TsdbService {
  constructor(
    @Inject(TSDB_CONN) readonly db: PostgresJsDatabase<typeof schema>,
  ) {}
}
