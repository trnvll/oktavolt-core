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
export class ResourcesLlmApiToolsService {
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
          name: 'CreateResource',
          description:
            'Stores information provided by the user to be used as a knowledge base for the user for either personal or work related stuff.',
          schema: z.object({
            content: z
              .string()
              .describe('The content of the information or the resource.'),
            type: z
              .nativeEnum(LlmConversationTypeEnum)
              .describe('The type of information.'),
            userId: z.number().describe('The user id.'),
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
                  type: input.type,
                },
                userId: input.userId,
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
