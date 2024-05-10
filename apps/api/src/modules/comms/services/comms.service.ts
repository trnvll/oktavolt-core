import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Communications, SelectUser, Users } from 'database'
import { CreateCommsDto } from '@/modules/comms/dtos/create-comms.dto'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { and, eq } from 'drizzle-orm'
import { FindAllCommsDto } from '@/modules/comms/dtos/find-all-comms.dto'
import { FindOneCommDto } from '@/modules/comms/dtos/find-one-comm.dto'
import { LogActivity } from 'utils'

@Injectable()
export class CommsService {
  constructor(private readonly drizzle: DrizzleService) {}

  @LogActivity()
  async findAll(user: SelectUser) {
    const comms = await this.drizzle.db.query.comms.findMany({
      where: eq(Communications.userId, user.userId),
    })

    return FindAllCommsDto.fromEntity(comms)
  }

  @LogActivity()
  async findOne(user: SelectUser, commId: number) {
    const comm = await this.drizzle.db.query.comms.findFirst({
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

    return this.drizzle.db
      .insert(Communications)
      .values(entities)
      .returning({ commId: Communications.commId })
  }

  @LogActivity()
  async delete(user: SelectUser, commId: number) {
    const comm = await this.drizzle.db.query.comms.findFirst({
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

    return this.drizzle.db
      .delete(Communications)
      .where(eq(Communications.commId, commId))
      .returning({ commId: Communications.commId })
  }
}
