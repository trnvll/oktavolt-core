import { Injectable } from '@nestjs/common'
import { LlmOpenapiActionsService } from '@/core/llm/services/llm-openapi-actions.service'
import * as fs from 'fs'
import path from 'path'
import { JsonObject } from 'langchain/tools'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'
import { RelationshipsLlmToolsService } from '@/modules/relationships/services/relationships-llm-tools.service'

@Injectable()
export class OmniService {
  constructor(
    private readonly llmOpenapiActionsService: LlmOpenapiActionsService,
    private readonly usersLlmToolsService: UsersLlmToolsService,
    private readonly relationshipsLlmToolsService: RelationshipsLlmToolsService,
    private readonly llmChatService: LlmChatService,
  ) {}

  async omni(query: string) {
    const userTools = this.usersLlmToolsService.getTools()
    const relationshipTools = this.relationshipsLlmToolsService.getTools()

    const tools = [...userTools, ...relationshipTools]

    const response = await this.llmChatService.chat(query, {
      tools: tools as any,
    })

    console.log(
      'Tool calls',
      JSON.stringify(response?.lc_kwargs?.tool_calls, null, 2),
    )

    // should be taken care of by tools service
    if (response?.lc_kwargs?.tool_calls) {
      const tool = tools.find(
        (tool) => tool.name === response.lc_kwargs.tool_calls[0].name,
      )
      const toolResponse = await tool?.func(
        response.lc_kwargs.tool_calls[0].args,
      )

      return toolResponse
      /*
      If we want LLM response with the data:
      return this.llmChatService.chat(
        'Given the context and history of the conversation, return the appropriate response',
        {
          history: [
            new HumanMessage(JSON.stringify(toolResponse)),
            new HumanMessage(query),
          ],
        },
      )
       */
    }

    return response
  }

  async openapi(query: string) {
    const openapiJsonSpecPath = path.join(__dirname, '../../../../openapi.json')
    const openapiJsonSpec = fs.readFileSync(openapiJsonSpecPath, 'utf8')

    if (!openapiJsonSpec) {
      throw new Error('Could not read openapi.json')
    }

    let openapiJsonSpecParsed
    try {
      openapiJsonSpecParsed = JSON.parse(openapiJsonSpec) as JsonObject
    } catch (err) {
      throw new Error('Could not parse openapi.json')
    }

    await this.llmOpenapiActionsService.init(openapiJsonSpecParsed)
    return this.llmOpenapiActionsService.executeAction(query)
  }
}
