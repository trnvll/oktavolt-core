import { Injectable } from '@nestjs/common'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { validateToolDto } from '@/utils/fns/validate-tool-dto'
import { HandleCreateResourceJobDto } from '@/modules/resources/dtos/handle-create-resource-job.dto'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { ResourcesEventsConsumerEnum } from '@/modules/resources/consumers/resources-events.consumer'

@Injectable()
export class ResourcesLlmToolsService {
  constructor(
    @InjectQueue(QueueEnum.ResourcesEvents)
    private readonly resourceEventsQueue: Queue,
  ) {}

  getTools(): GetLlmTool['tool'][] {
    return this.getToolDefs().map((def) => def.tool)
  }

  getToolDefs(): GetLlmTool[] {
    return [
      {
        tool: new DynamicStructuredTool({
          name: 'StoreRelevantPersonalInformation',
          description:
            'Stores relevant information about the user to be used in the future for highly personalized experiences. Typical examples include storing relationships, preferences, personal information, activities, insights etc.',
          schema: z.object({
            content: z
              .string()
              .describe('The content of the information or the resource.'),
            metadata: z.object({
              type: z.string().describe('The type of information.'),
            }),
          }),
          func: async (input) => {
            const createResourceDto = await validateToolDto(
              HandleCreateResourceJobDto,
              {
                data: {
                  content: input.content,
                  metadata: input.metadata,
                },
                userId: 79,
              },
            )
            return await this.resourceEventsQueue.add(
              ResourcesEventsConsumerEnum.CreateResource,
              createResourceDto,
            )
          },
        }),
      },
    ]
  }
}
