import { Injectable } from '@nestjs/common'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'
import { ResourcesLlmApiToolsService } from '@/modules/resources/services/resources-llm-api-tools.service'
import { ResourcesLlmWorkToolsService } from '@/modules/resources/services/resources-llm-work-tools.service'
import { ResourcesLlmPersonalToolsService } from '@/modules/resources/services/resources-llm-personal-tools.service'
import { UsersLlmApiToolsService } from '@/modules/users/services/users-llm-api-tools.service'

@Injectable()
export class ToolExecsLlmToolsService {
  constructor(
    private readonly resourcesLlmApiToolsService: ResourcesLlmApiToolsService,
    private readonly resourcesLlmPersonalToolsService: ResourcesLlmPersonalToolsService,
    private readonly resourcesLlmWorkToolsService: ResourcesLlmWorkToolsService,
    private readonly usersLlmApiToolsService: UsersLlmApiToolsService,
  ) {}

  getTools(llmConvType: LlmConversationTypeEnum): GetLlmTool['tool'][] {
    return this.getToolDefs(llmConvType).map((def) => def.tool)
  }

  getToolDefs(llmConvType: LlmConversationTypeEnum): GetLlmTool[] {
    return this.mappedToolDefs[llmConvType]
  }

  get mappedToolDefs(): Record<LlmConversationTypeEnum, GetLlmTool[]> {
    return {
      [LlmConversationTypeEnum.Personal]: [
        ...this.resourcesLlmPersonalToolsService.getToolDefs(),
      ],
      [LlmConversationTypeEnum.Work]: [
        ...this.resourcesLlmWorkToolsService.getToolDefs(),
      ],
      [LlmConversationTypeEnum.Api]: [
        ...this.resourcesLlmApiToolsService.getToolDefs(),
        ...this.usersLlmApiToolsService.getToolDefs(),
      ],
    }
  }
}
