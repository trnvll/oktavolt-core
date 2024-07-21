import { Injectable } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { LogActivity } from 'utils'
import { Job } from 'bull'
import { SelectRelationships } from 'database'
import { RelationshipsEmbeddingsService } from '@/modules/relationships/services/relationships-embeddings.service'

export enum RelationshipsEventsConsumerEnum {
  CreateRelationshipsEmbedding = 'create-relationships-embedding',
}

@Injectable()
@Processor(QueueEnum.RelationshipsEvents)
export class RelationshipsEventsConsumer {
  constructor(
    private readonly relationshipsEmbeddingsService: RelationshipsEmbeddingsService,
  ) {}

  @Process(RelationshipsEventsConsumerEnum.CreateRelationshipsEmbedding)
  @LogActivity()
  async handleCreateRelationshipsEmbedding(job: Job<SelectRelationships>) {
    await this.relationshipsEmbeddingsService.generateAndSaveEmbeddings(
      job.data,
    )
  }
}
