import { Injectable } from '@nestjs/common'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { validateToolDto } from '@/utils/fns/validate-tool-dto'
import { HandleCreateResourceJobDto } from '@/modules/resources/dtos/handle-create-resource-job.dto'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventResourceCreatedDto } from '@/modules/resources/dtos/events/create-event-resource-created.dto'

@Injectable()
export class ResourcesLlmWorkToolsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

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
