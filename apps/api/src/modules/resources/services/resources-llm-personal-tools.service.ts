import { Injectable } from '@nestjs/common'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { validateToolDto } from '@/utils/fns/validate-tool-dto'
import { HandleCreateResourceJobDto } from '@/modules/resources/dtos/handle-create-resource-job.dto'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventResourceCreatedDto } from '@/modules/resources/dtos/events/create-event-resource-created.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'

interface ResourcesLlmPersonalToolsServiceToolDefsParams {
  userId?: number
}

@Injectable()
export class ResourcesLlmPersonalToolsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

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
            return await this.eventEmitter.emitAsync(
              EventsEnum.ResourceCreated,
              new CreateEventResourceCreatedDto({
                data: createResourceDto.data,
                userId: createResourceDto.userId,
              }),
            )
          },
        }),
      },
    ]
  }
}
