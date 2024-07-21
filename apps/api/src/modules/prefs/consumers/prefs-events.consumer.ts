import { Injectable } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { LogActivity } from 'utils'
import { Job } from 'bull'
import { SelectPreferences } from 'database'
import { PrefsEmbeddingsService } from '@/modules/prefs/services/prefs-embeddings.service'

export enum PrefsEventsConsumerEnum {
  CreatePrefsEmbedding = 'create-prefs-embedding',
}

@Injectable()
@Processor(QueueEnum.PrefsEvents)
export class PrefsEventsConsumer {
  constructor(
    private readonly prefsEmbeddingsService: PrefsEmbeddingsService,
  ) {}

  @Process(PrefsEventsConsumerEnum.CreatePrefsEmbedding)
  @LogActivity()
  async handleCreatePrefsEmbedding(job: Job<SelectPreferences>) {
    await this.prefsEmbeddingsService.generateAndSaveEmbeddings(job.data)
  }
}
