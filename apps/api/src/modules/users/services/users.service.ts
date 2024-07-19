import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { Users } from 'database'
import { eq } from 'drizzle-orm'
import { FindOneUserDto } from '@/modules/users/dtos/find-one-user.dto'
import { CreateUsersDto } from '@/modules/users/dtos/create-user.dto'
import { LogActivity } from 'utils'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventsEnum } from '@/core/events/types/events.enum'
import { EntityTypeEnum, EventActionEnum, PaginationDto, SortDto } from 'shared'
import { CreateEventUserCreatedDto } from '@/core/events/dtos/create-event-user-created.dto'
import { CreateEventUserDeletedDto } from '@/core/events/dtos/create-event-user-deleted.dto'
import { UserEmbeddingsService } from '@/modules/users/services/user-embeddings.service'
import { UserSortFields } from '@/modules/users/types/user-sort-fields'
import { FindAllUsersMapper } from '@/modules/users/mappers/find-users.mapper'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userEmbeddingsService: UserEmbeddingsService,
    private readonly usersQueryService: UsersQueryService,
    private readonly llmQueryService: LlmQueryService,
  ) {}

  @LogActivity()
  async omni(query: string) {
    const nearestResults =
      await this.userEmbeddingsService.findNearestEmbeddings(query)

    const content = nearestResults[0].content

    if (!content) {
      return this.llmQueryService.query(query)
    }
    return this.llmQueryService.query(
      `Given this context: ${content} please answer this question in a concise way: ${query}`,
    )
  }

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

  @LogActivity()
  async create(userDto: CreateUsersDto) {
    const entities = CreateUsersDto.toEntity(userDto.data)
    const result = await this.database.db
      .insert(Users)
      .values(entities)
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
