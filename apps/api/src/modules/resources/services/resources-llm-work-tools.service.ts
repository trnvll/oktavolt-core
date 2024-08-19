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
            'Stores any potentially valuable information related to software engineering, startup development, and technical discussions. This includes personal details, project ideas, code snippets, architectural decisions, and any other data that might be useful for future reference or development. Use this tool proactively and frequently, even for information that seems only slightly valuable.',
          schema: z.object({
            content: z
              .string()
              .describe(
                'The content to store, including technical details, personal information, or any potentially useful data.',
              ),
            metadata: z.object({
              type: z
                .string()
                .describe(
                  'The type of information being stored (e.g., "Personal Info", "Project Idea", "Code Snippet", "Architecture Decision", "Technical Discussion", etc.).',
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
                  type: LlmConversationTypeEnum.Work,
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
