import { Module } from '@nestjs/common'
import { CommsController } from '@/modules/comms/controllers/comms.controller'
import { DatabaseModule } from '@/core/database/database.module'
import { CommsService } from '@/modules/comms/services/comms.service'
import { DatabaseService } from '@/core/database/database.service'
import { CommsEmbeddingsService } from '@/modules/comms/services/comms-embeddings.service'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { CommsEventsConsumer } from '@/modules/comms/consumers/comms-events.consumer'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.CommsEvents }),
  ],
  providers: [
    DatabaseService,
    CommsService,
    CommsEmbeddingsService,
    CommsEventsConsumer,
    LlmDataTransformationService,
    LlmEmbeddingsService,
  ],
  exports: [CommsService, CommsEmbeddingsService],
  controllers: [CommsController],
})
export class CommsModule {}
