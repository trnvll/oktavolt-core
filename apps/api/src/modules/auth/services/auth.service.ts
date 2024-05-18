import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import { SelectUser, Users } from 'database'
import { DatabaseService } from '@/core/database/database.service'
import { Authentication } from 'database'
import { CreateAuthsDto } from '@/modules/auth/dtos/create-auths.dto'
import { FindOneAuthDto } from '@/modules/auth/dtos/find-one-auth.dto'
import { FindAllAuthsDto } from '@/modules/auth/dtos/find-all-auth.dto'
import { LogActivity } from 'utils'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @LogActivity()
  async findAll(user: SelectUser) {
    const auths = await this.database.db.query.auth.findMany({
      where: eq(Authentication.userId, user.userId),
    })

    return FindAllAuthsDto.fromEntity(auths)
  }

  @LogActivity()
  async findOne(user: SelectUser, authId: number) {
    const auth = await this.database.db.query.auth.findFirst({
      where: and(
        eq(Authentication.userId, user.userId),
        eq(Authentication.authId, authId),
      ),
    })

    if (!auth) {
      throw new NotFoundException('Authentication not found.')
    }

    return FindOneAuthDto.fromEntity(auth)
  }

  @LogActivity()
  async create(user: SelectUser, createAuthsDto: CreateAuthsDto) {
    const entities = CreateAuthsDto.toEntity(user.userId, createAuthsDto.data)
    const result = await this.database.db
      .insert(Authentication)
      .values(entities)
      .returning({ id: Authentication.authId })

    this.eventEmitter.emit(
      EventsEnum.EventUserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Authentication,
          entityIds: result.map((entity) => entity.id),
          dataChange: {
            newValue: entities, // TODO: we should not send the password in the event
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    return result
  }

  /*
  async update(user: SelectUser, authId: number, updateAuthDto: any) {
    const authRecord = await this.database.db.query.Authentication.findFirst({
      where: and(eq(Authentication.userId, user.userId)),
    })

    return this.database.db
      .update(Authentication)
      .set({
        email: updateAuthDto.email,
        hashed_password: updateAuthDto.hashed_password,
        serviceName: updateAuthDto.serviceName,
        serviceDomain: updateAuthDto.serviceDomain,
      })
      .where(eq(Authentication.authId, authId))
      .returning()
  }
   */

  @LogActivity()
  async delete(user: SelectUser, authId: number) {
    const auth = await this.database.db.query.auth.findFirst({
      where: and(
        eq(Users.userId, user.userId),
        eq(Authentication.authId, authId),
      ),
    })

    if (!auth) {
      throw new NotFoundException('Authentication not found.')
    }

    if (auth.userId !== user.userId) {
      throw new ForbiddenException('Authentication does not belong to user.')
    }

    return this.database.db
      .delete(Authentication)
      .where(eq(Authentication.authId, authId))
      .returning({ authId: Authentication.authId })
  }
}
