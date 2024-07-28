import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FindAllRelationshipsDto } from '@/modules/relationships/dtos/find-all-relationships.dto'
import { FindOneRelationshipDto } from '@/modules/relationships/dtos/find-one-relationship.dto'
import { DatabaseService } from '@/core/database/database.service'
import { and, eq } from 'drizzle-orm'
import { Relationships, SelectUser, Users } from 'database'
import { CreateRelationshipsDto } from '@/modules/relationships/dtos/create-relationships.dto'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { RelationshipsEventsConsumerEnum } from '@/modules/relationships/consumers/relationships-events.consumer'

@Injectable()
export class RelationshipsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(QueueEnum.RelationshipsEvents)
    private readonly relationshipsEventsQueue: Queue,
  ) {}

  async findAll(user: SelectUser) {
    const relationships = await this.database.db.query.relations.findMany({
      where: eq(Relationships.userId, user.userId),
    })

    return FindAllRelationshipsDto.fromEntity(relationships)
  }

  async findOne(user: SelectUser, relationshipId: number) {
    const relationship = await this.database.db.query.relations.findFirst({
      where: and(
        eq(Relationships.userId, user.userId),
        eq(Relationships.relationshipId, relationshipId),
      ),
    })

    if (!relationship) {
      throw new NotFoundException('Relationship not found.')
    }

    return FindOneRelationshipDto.fromEntity(relationship)
  }

  async create(
    user: SelectUser,
    createRelationshipsDto: CreateRelationshipsDto,
  ) {
    const entities = CreateRelationshipsDto.toEntity(
      user.userId,
      createRelationshipsDto.data,
    )

    const result = await this.database.db
      .insert(Relationships)
      .values(entities)
      .returning()

    await this.relationshipsEventsQueue.add(
      RelationshipsEventsConsumerEnum.CreateRelationshipsEmbedding,
      result[0],
    )

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Relationship,
          entityIds: result.map((entity) => entity.relationshipId),
          dataChange: {
            newValue: result,
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    return result
  }

  async delete(user: SelectUser, relationshipId: number) {
    const relationship = await this.database.db.query.relations.findFirst({
      where: and(
        eq(Users.userId, user.userId),
        eq(Relationships.relationshipId, relationshipId),
      ),
    })

    if (!relationship) {
      throw new NotFoundException('Relationship not found.')
    }

    if (relationship.userId !== user.userId) {
      throw new ConflictException('Relationship does not belong to user.')
    }

    const result = await this.database.db
      .delete(Relationships)
      .where(eq(Relationships.relationshipId, relationshipId))
      .returning()

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Relationship,
          entityIds: result.map((entity) => entity.relationshipId),
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
