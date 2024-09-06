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
export class ResourcesLlmApiToolsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

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
