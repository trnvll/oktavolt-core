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
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'

@Injectable()
export class ResourcesLlmWorkToolsService {
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
          name: 'StoreRelevantWorkInformation',
          description:
            'Stores relevant information about the company and its operations for future reference and strategic decision-making, as well as technological tools and resources used in the company.',
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
                  type: LlmConversationTypeEnum.Personal,
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
