import { Inject, Injectable } from '@nestjs/common'
import { DATABASE_CONN } from '@/core/database/database.module'
import { schema } from 'database'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DATABASE_CONN) readonly db: PostgresJsDatabase<typeof schema>,
  ) {}
}
