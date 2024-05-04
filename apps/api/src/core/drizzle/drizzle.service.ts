import { Inject, Injectable } from '@nestjs/common'
import { DATABASE_CONN } from '@/core/drizzle/drizzle.module'
import { schema } from 'database'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(DATABASE_CONN) readonly db: PostgresJsDatabase<typeof schema>,
  ) {}
}
