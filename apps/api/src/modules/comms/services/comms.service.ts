import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Communications, SelectUser, Users } from 'database'
import { CreateCommsDto } from '@/modules/comms/dtos/create-comms.dto'
import { DatabaseService } from '@/core/database/database.service'
import { and, eq } from 'drizzle-orm'
import { FindAllCommsDto } from '@/modules/comms/dtos/find-all-comms.dto'
import { FindOneCommDto } from '@/modules/comms/dtos/find-one-comm.dto'
import { LogActivity } from 'utils'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { CommsEventsConsumerEnum } from '@/modules/comms/consumers/comms-events.consumer'

@Injectable()
export class CommsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(QueueEnum.CommsEvents)
    private readonly commsEventsQueue: Queue,
  ) {}

  @LogActivity()
  async findAll(user: SelectUser) {
    const comms = await this.database.db.query.comms.findMany({
      where: eq(Communications.userId, user.userId),
    })

    return FindAllCommsDto.fromEntity(comms)
  }

  @LogActivity()
  async findOne(user: SelectUser, commId: number) {
    const comm = await this.database.db.query.comms.findFirst({
      where: and(
        eq(Communications.userId, user.userId),
        eq(Communications.commId, commId),
      ),
    })

    if (!comm) {
      throw new NotFoundException('Communication not found.')
    }

    return FindOneCommDto.fromEntity(comm)
  }

  @LogActivity()
  async create(user: SelectUser, createCommsDto: CreateCommsDto) {
    const entities = CreateCommsDto.toEntity(user.userId, createCommsDto.data)

    const result = await this.database.db
      .insert(Communications)
      .values(entities)
      .returning()

    await this.commsEventsQueue.add(
      CommsEventsConsumerEnum.CreateCommsEmbedding,
      result[0],
    )

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Communication,
          entityIds: result.map((entity) => entity.commId),
          dataChange: {
            newValue: result,
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    return result
  }

  @LogActivity()
  async delete(user: SelectUser, commId: number) {
    const comm = await this.database.db.query.comms.findFirst({
      where: and(
        eq(Users.userId, user.userId),
        eq(Communications.commId, commId),
      ),
    })

    if (!comm) {
      throw new NotFoundException('Communication not found.')
    }

    if (comm.userId !== user.userId) {
      throw new ForbiddenException('Communication does not belong to user.')
    }

    const result = await this.database.db
      .delete(Communications)
      .where(eq(Communications.commId, commId))
      .returning()

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Communication,
          entityIds: result.map((entity) => entity.commId),
          dataChange: {
            oldValue: result,
          },
          action: EventActionEnum.Delete,
        },
      }),
    )

    return result
  }
}
