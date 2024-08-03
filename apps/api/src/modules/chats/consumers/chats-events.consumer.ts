import { Injectable } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { LogActivity } from 'utils'
import { Job } from 'bull'
import { SelectChat } from 'database'
import { ChatsEmbeddingsService } from '@/modules/chats/services/chats-embeddings.service'

export enum ChatsEventsConsumerEnum {
  CreateChatsEmbedding = 'create-chats-embedding',
}

@Injectable()
@Processor(QueueEnum.ChatsEvents)
export class ChatsEventsConsumer {
  constructor(
    private readonly chatsEmbeddingsService: ChatsEmbeddingsService,
  ) {}

  @Process(ChatsEventsConsumerEnum.CreateChatsEmbedding)
  @LogActivity()
  async handleCreateChatsEmbedding(job: Job<SelectChat>) {
    await this.chatsEmbeddingsService.generateAndSaveEmbeddings(job.data)
  }
}
