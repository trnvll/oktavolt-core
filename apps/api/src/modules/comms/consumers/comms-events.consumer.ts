import { Injectable } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { LogActivity } from 'utils'
import { Job } from 'bull'
import { SelectCommunications } from 'database'
import { CommsEmbeddingsService } from '@/modules/comms/services/comms-embeddings.service'

export enum CommsEventsConsumerEnum {
  CreateCommsEmbedding = 'create-comms-embedding',
}

@Injectable()
@Processor(QueueEnum.CommsEvents)
export class CommsEventsConsumer {
  constructor(
    private readonly commsEmbeddingsService: CommsEmbeddingsService,
  ) {}

  @Process(CommsEventsConsumerEnum.CreateCommsEmbedding)
  @LogActivity()
  async handleCreateCommsEmbedding(job: Job<SelectCommunications>) {
    await this.commsEmbeddingsService.generateAndSaveEmbeddings(job.data)
  }
}
