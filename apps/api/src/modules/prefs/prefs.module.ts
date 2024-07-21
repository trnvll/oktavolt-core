import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { PrefsService } from '@/modules/prefs/services/prefs.service'
import { PrefsController } from '@/modules/prefs/controllers/prefs.controller'
import { PrefsEmbeddingsService } from '@/modules/prefs/services/prefs-embeddings.service'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { PrefsEventsConsumer } from '@/modules/prefs/consumers/prefs-events.consumer'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.PrefsEvents }),
  ],
  providers: [
    DatabaseService,
    PrefsService,
    PrefsEmbeddingsService,
    PrefsEventsConsumer,
    LlmDataTransformationService,
    LlmEmbeddingsService,
  ],
  exports: [PrefsService, PrefsEmbeddingsService],
  controllers: [PrefsController],
})
export class PrefsModule {}
