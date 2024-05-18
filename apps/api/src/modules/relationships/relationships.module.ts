import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { RelationshipsService } from '@/modules/relationships/services/relationships.service'
import { RelationshipsController } from '@/modules/relationships/controllers/relationships.controller'
import { DatabaseService } from '@/core/database/database.service'

@Module({
  imports: [DatabaseModule],
  providers: [RelationshipsService, DatabaseService],
  exports: [RelationshipsService],
  controllers: [RelationshipsController],
})
export class RelationshipsModule {}
