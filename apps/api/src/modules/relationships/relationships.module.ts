import { Module } from '@nestjs/common'
import { DrizzleModule } from '@/core/drizzle/drizzle.module'
import { RelationshipsService } from '@/modules/relationships/services/relationships.service'
import { RelationshipsController } from '@/modules/relationships/controllers/relationships.controller'
import { DrizzleService } from '@/core/drizzle/drizzle.service'

@Module({
  imports: [DrizzleModule],
  providers: [RelationshipsService, DrizzleService],
  exports: [RelationshipsService],
  controllers: [RelationshipsController],
})
export class RelationshipsModule {}
