import { Injectable } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { LogActivity } from 'utils'
import { Job } from 'bull'
import { ResourcesService } from '@/modules/resources/services/resources.service'
import { HandleCreateResourceJobDto } from '@/modules/resources/dtos/handle-create-resource-job.dto'

export enum ResourcesEventsConsumerEnum {
  CreateResource = 'create-resource',
}

@Injectable()
@Processor(QueueEnum.ResourcesEvents)
export class ResourcesEventsConsumer {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Process(ResourcesEventsConsumerEnum.CreateResource)
  @LogActivity()
  async handleCreateResource(job: Job<HandleCreateResourceJobDto>) {
    await this.resourcesService.create(job.data.userId, job.data.data)
  }
}
