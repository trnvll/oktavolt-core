import { Module } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { EmbeddingsService } from '@/modules/embeddings/services/embeddings.service'
import { EmbeddingsController } from '@/modules/embeddings/controllers/embeddings.controller'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { EmbeddingsQueryService } from '@/modules/embeddings/services/embeddings-query.service'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    DatabaseService,
    LlmEmbeddingsService,
    LlmQueryService,
    EmbeddingsService,
    EmbeddingsQueryService,
  ],
  controllers: [EmbeddingsController],
  exports: [EmbeddingsService, EmbeddingsQueryService],
})
export class EmbeddingsModule {}
