import { Injectable, NotFoundException } from '@nestjs/common'
import { Preferences, SelectUser } from 'database'
import { DatabaseService } from '@/core/database/database.service'
import { and, eq } from 'drizzle-orm'
import { FindOnePrefDto } from '@/modules/prefs/dtos/find-one-pref.dto'
import { FindAllPrefsDto } from '@/modules/prefs/dtos/find-all-prefs.dto'
import { CreatePrefsDto } from '@/modules/prefs/dtos/create-prefs.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { PrefsEventsConsumerEnum } from '@/modules/prefs/consumers/prefs-events.consumer'

@Injectable()
export class PrefsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(QueueEnum.PrefsEvents)
    private readonly prefsEventsQueue: Queue,
  ) {}

  async findAll(user: SelectUser) {
    const prefs = await this.database.db.query.prefs.findMany({
      where: eq(Preferences.userId, user.userId),
    })

    return FindAllPrefsDto.fromEntity(prefs)
  }

  async findOne(user: SelectUser, prefId: number) {
    const pref = await this.database.db.query.prefs.findFirst({
      where: and(
        eq(Preferences.prefId, prefId),
        eq(Preferences.userId, user.userId),
      ),
    })

    if (!pref) {
      throw new NotFoundException('Preference not found.')
    }

    return FindOnePrefDto.fromEntity(pref)
  }

  async create(user: SelectUser, createPreferencesDto: CreatePrefsDto) {
    const entity = CreatePrefsDto.toEntity(
      user.userId,
      createPreferencesDto.data,
    )

    const result = await this.database.db
      .insert(Preferences)
      .values(entity)
      .returning()

    await Promise.all(
      result.map((res) =>
        this.prefsEventsQueue.add(
          PrefsEventsConsumerEnum.CreatePrefsEmbedding,
          res,
        ),
      ),
    )

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Preference,
          entityIds: result.map((entity) => entity.prefId),
          dataChange: {
            newValue: result,
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    return result
  }

  /*
  async update(
    user: SelectUser,
    prefId: number,
    updatePreferencesDto: UpdatePrefsDto,
  ) {
    const pref = await this.database.db.query.Preferences.findFirst({
      where: and(
        eq(Preferences.prefId, prefId),
        eq(Preferences.userId, user.userId),
      ),
    })

    if (!pref) {
      throw new NotFoundException('Preference not found.')
    }

    const updatedEntity = UpdatePrefsDto.toEntity(updatePreferencesDto.data)

    return this.database.db
      .update(Preferences)
      .set(updatedEntity)
      .where(eq(Preferences.prefId, prefId))
      .returning()
  }
   */

  async delete(user: SelectUser, prefId: number) {
    const pref = await this.database.db.query.prefs.findFirst({
      where: and(
        eq(Preferences.prefId, prefId),
        eq(Preferences.userId, user.userId),
      ),
    })

    if (!pref) {
      throw new NotFoundException('Preference not found.')
    }

    const result = await this.database.db
      .delete(Preferences)
      .where(
        and(
          eq(Preferences.prefId, prefId),
          eq(Preferences.userId, user.userId),
        ),
      )
      .returning()

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Preference,
          entityIds: result.map((entity) => entity.prefId),
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
