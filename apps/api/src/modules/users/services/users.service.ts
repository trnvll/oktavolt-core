import { Injectable, NotFoundException } from '@nestjs/common'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { Users } from 'database'
import { eq } from 'drizzle-orm'
import { FindOneUserDto } from '@/modules/users/dtos/find-one-user.dto'
import { FindAllUsersDto } from '@/modules/users/dtos/find-all-users.dto'
import { CreateUsersDto } from '@/modules/users/dtos/create-user.dto'
import { LogActivity } from 'utils'

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}

  @LogActivity()
  async findAll() {
    const plainUsers = await this.drizzle.db.select().from(Users).execute()
    return FindAllUsersDto.fromEntity(plainUsers)
  }

  @LogActivity()
  async findOne(userId: number) {
    const plainUser = await this.drizzle.db.query.users.findFirst({
      where: eq(Users.userId, userId),
    })

    if (!plainUser) {
      throw new NotFoundException('User not found.')
    }

    return FindOneUserDto.fromEntity(plainUser)
  }

  @LogActivity()
  async create(userDto: CreateUsersDto) {
    const entities = CreateUsersDto.toEntity(userDto.data)
    await this.drizzle.db.insert(Users).values(entities)
    return entities
  }

  @LogActivity()
  async delete(userId: number) {
    const users = await this.drizzle.db
      .select()
      .from(Users)
      .where(eq(Users.userId, userId))

    if (!users.length) {
      throw new NotFoundException('User not found.')
    }

    return this.drizzle.db
      .delete(Users)
      .where(eq(Users.userId, userId))
      .returning({ userId: Users.userId })
  }
}
