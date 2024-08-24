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

interface ResourcesLlmPersonalToolsServiceToolDefsParams {
  userId?: number
}

@Injectable()
export class ResourcesLlmPersonalToolsService {
  constructor(
    @InjectQueue(QueueEnum.ResourcesEvents)
    private readonly resourceEventsQueue: Queue,
  ) {}

  getTools(
    params: ResourcesLlmPersonalToolsServiceToolDefsParams,
  ): GetLlmTool['tool'][] {
    return this.getToolDefs(params).map((def) => def.tool)
  }

  getToolDefs(
    params?: ResourcesLlmPersonalToolsServiceToolDefsParams,
  ): GetLlmTool[] {
    return [
      {
        tool: new DynamicStructuredTool({
          name: 'StoreRelevantPersonalInformation',
          description:
            'Stores any potentially relevant information about the user for future personalized experiences. This includes, but is not limited to, relationships, preferences, personal history, activities, goals, insights, and any other personal details shared during conversations. Use this tool proactively and frequently, even for information that seems only slightly relevant.',
          schema: z.object({
            content: z
              .string()
              .describe(
                'The personal information or insight to store for future reference and personalization.',
              ),
            metadata: z.object({
              type: z
                .string()
                .describe(
                  'The type of personal information being stored (e.g., "Relationship", "Preference", "Personal History", "Goal", "Insight", "Activity", etc.).',
                ),
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
                userId: params?.userId ?? 79,
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
