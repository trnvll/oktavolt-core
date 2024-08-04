import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { Users } from 'database'
import { eq } from 'drizzle-orm'
import { FindOneUserDto } from '@/modules/users/dtos/find-one-user.dto'
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto'
import { LogActivity } from 'utils'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventsEnum } from '@/core/events/types/events.enum'
import { EntityTypeEnum, EventActionEnum, PaginationDto, SortDto } from 'shared'
import { CreateEventUserCreatedDto } from '@/core/events/dtos/create-event-user-created.dto'
import { CreateEventUserDeletedDto } from '@/core/events/dtos/create-event-user-deleted.dto'
import { UserSortFields } from '@/modules/users/types/user-sort-fields'
import { FindAllUsersMapper } from '@/modules/users/mappers/find-users.mapper'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    private readonly usersQueryService: UsersQueryService,
  ) {}

  @LogActivity()
  async findAll(
    paginationDto: PaginationDto,
    sortDto: SortDto<UserSortFields>,
  ) {
    const queryResult = await this.usersQueryService.findAllUsers(
      paginationDto,
      sortDto,
    )
    return FindAllUsersMapper.fromEntity(queryResult)
  }

  @LogActivity()
  async findOne(userId: number) {
    const plainUser = await this.database.db.query.users.findFirst({
      where: eq(Users.userId, userId),
    })

    if (!plainUser) {
      throw new NotFoundException('User not found.')
    }

    return FindOneUserDto.fromEntity(plainUser)
  }

  async create(userDto: CreateUserDto) {
    const entity = CreateUserDto.toEntity(userDto)

    const result = await this.database.db
      .insert(Users)
      .values(entity)
      .returning()

    this.eventEmitter.emit(
      EventsEnum.UserCreated,
      new CreateEventUserCreatedDto({
        userId: result[0].userId,
        data: {
          entityType: EntityTypeEnum.User,
          entityIds: result.map((entity) => entity.userId),
          dataChange: {
            newValue: result[0],
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    return result
  }

  @LogActivity()
  async delete(userId: number) {
    const users = await this.database.db
      .select()
      .from(Users)
      .where(eq(Users.userId, userId))

    if (!users.length) {
      throw new NotFoundException('User not found.')
    }

    const result = await this.database.db
      .delete(Users)
      .where(eq(Users.userId, userId))
      .returning()

    this.eventEmitter.emit(
      EventsEnum.UserDeleted,
      new CreateEventUserDeletedDto({
        userId: result[0].userId,
        data: {
          entityType: EntityTypeEnum.User,
          entityIds: result.map((entity) => entity.userId),
          dataChange: {
            oldValue: result[0],
          },
          action: EventActionEnum.Delete,
        },
      }),
    )

    return result
  }
}
