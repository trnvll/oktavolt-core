import { Injectable, NotFoundException } from '@nestjs/common'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { Users } from 'database'
import { eq } from 'drizzle-orm'
import { FindOneUserDto } from '@/modules/users/dtos/find-one-user.dto'
import { FindAllUsersDto } from '@/modules/users/dtos/find-all-users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll() {
    const plainUsers = await this.drizzle.db.select().from(Users).execute()
    return FindAllUsersDto.fromEntity(plainUsers)
  }

  async findOne(userId: number) {
    const plainUser = await this.drizzle.db.query.Users.findFirst({
      where: eq(Users.userId, userId),
    })

    if (!plainUser) {
      throw new NotFoundException('User not found.')
    }

    return FindOneUserDto.fromEntity(plainUser)
  }
}
