import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import { SelectUser, Users } from 'database'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { Authentication } from 'database'
import { CreateAuthsDto } from '@/modules/auth/dtos/create-auths.dto'
import { FindOneAuthDto } from '@/modules/auth/dtos/find-one-auth.dto'
import { FindAllAuthsDto } from '@/modules/auth/dtos/find-all-auth.dto'

@Injectable()
export class AuthService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(user: SelectUser) {
    const auths = await this.drizzle.db.query.Authentication.findMany({
      where: eq(Authentication.userId, user.userId),
    })

    return FindAllAuthsDto.fromEntity(auths)
  }

  async findOne(user: SelectUser, authId: number) {
    const auth = await this.drizzle.db.query.Authentication.findFirst({
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

  async create(user: SelectUser, createAuthsDto: CreateAuthsDto) {
    const entities = CreateAuthsDto.toEntity(user.userId, createAuthsDto.data)
    return this.drizzle.db
      .insert(Authentication)
      .values(entities)
      .returning({ id: Authentication.authId })
  }

  /*
  async update(user: SelectUser, authId: number, updateAuthDto: any) {
    const authRecord = await this.drizzle.db.query.Authentication.findFirst({
      where: and(eq(Authentication.userId, user.userId)),
    })

    return this.drizzle.db
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

  async delete(user: SelectUser, authId: number) {
    const auth = await this.drizzle.db.query.Authentication.findFirst({
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

    return this.drizzle.db
      .delete(Authentication)
      .where(eq(Authentication.authId, authId))
      .returning({ authId: Authentication.authId })
  }
}
