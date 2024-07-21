import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { RelationshipsService } from '@/modules/relationships/services/relationships.service'
import { RelationshipsController } from '@/modules/relationships/controllers/relationships.controller'
import { DatabaseService } from '@/core/database/database.service'
import { RelationshipsEmbeddingsService } from '@/modules/relationships/services/relationships-embeddings.service'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { RelationshipsEventsConsumer } from '@/modules/relationships/consumers/relationships-events.consumer'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.RelationshipsEvents }),
  ],
  providers: [
    RelationshipsService,
    DatabaseService,
    RelationshipsEmbeddingsService,
    RelationshipsEventsConsumer,
    LlmDataTransformationService,
    LlmEmbeddingsService,
  ],
  exports: [RelationshipsService, RelationshipsEmbeddingsService],
  controllers: [RelationshipsController],
})
export class RelationshipsModule {}
