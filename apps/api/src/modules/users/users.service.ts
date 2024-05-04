import { Injectable } from '@nestjs/common'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { Users } from 'database'

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}

  findAll() {
    return this.drizzle.db.select().from(Users).execute()
  }
}
