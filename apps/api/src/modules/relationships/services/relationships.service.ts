import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FindAllRelationshipsDto } from '@/modules/relationships/dtos/find-all-relationships.dto'
import { FindOneRelationshipDto } from '@/modules/relationships/dtos/find-one-relationship.dto'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { and, eq } from 'drizzle-orm'
import { Relationships, SelectUser, Users } from 'database'
import { CreateRelationshipsDto } from '@/modules/relationships/dtos/create-relationships.dto'

@Injectable()
export class RelationshipsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(user: SelectUser) {
    const relationships = await this.drizzle.db.query.relations.findMany({
      where: eq(Relationships.userId, user.userId),
    })

    return FindAllRelationshipsDto.fromEntity(relationships)
  }

  async findOne(user: SelectUser, relationshipId: number) {
    const relationship = await this.drizzle.db.query.relations.findFirst({
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

    return this.drizzle.db
      .insert(Relationships)
      .values(entities)
      .returning({ relationshipId: Relationships.relationshipId })
  }

  async delete(user: SelectUser, relationshipId: number) {
    const relationship = await this.drizzle.db.query.relations.findFirst({
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

    return this.drizzle.db
      .delete(Relationships)
      .where(eq(Relationships.relationshipId, relationshipId))
      .returning({ relationshipId: Relationships.relationshipId })
  }
}
