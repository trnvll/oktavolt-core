import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { LlmOpenapiActionsService } from '@/core/llm/services/llm-openapi-actions.service'
import * as fs from 'fs'
import path from 'path'
import { JsonObject } from 'langchain/tools'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'
import { RelationshipsLlmToolsService } from '@/modules/relationships/services/relationships-llm-tools.service'
import { CreateChatDto } from '@/modules/chats/dtos/create-chat.dto'
import { SelectUser, ToolExecs } from 'database'
import { ChatsFnsService } from '@/modules/chats/services/chats-fns.service'
import { DatabaseService } from '@/core/database/database.service'
import { ToolExecStatus } from '@/patch/enums/external'
import { eq } from 'drizzle-orm'
import { json } from 'shared'

@Injectable()
export class OmniService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmOpenapiActionsService: LlmOpenapiActionsService,
    private readonly usersLlmToolsService: UsersLlmToolsService,
    private readonly relationshipsLlmToolsService: RelationshipsLlmToolsService,
    private readonly llmChatService: LlmChatService,
    private readonly chatsFnsService: ChatsFnsService,
  ) {}

  async omni(user: SelectUser, chatDto: CreateChatDto) {
    const result = await this.chatsFnsService.createChat(user, chatDto)

    const userTools = this.usersLlmToolsService.getTools()
    const relationshipTools = this.relationshipsLlmToolsService.getTools()

    const tools = [...userTools, ...relationshipTools]

    const response = await this.llmChatService.chat(chatDto.message, {
      tools: tools as any,
    })

    console.log('Tool calls', json(response?.lc_kwargs?.tool_calls))

    // should be taken care of by tools service
    if (response?.lc_kwargs?.tool_calls) {
      const calledTool = response.lc_kwargs.tool_calls[0]
      const tool = tools.find((tool) => tool.name === calledTool.name)

      if (!tool) {
        console.error(`Tools was not found, tool name: ${calledTool.name}`)
        throw new InternalServerErrorException('Tool was not found.')
      }

      const entity = await this.database.db
        .insert(ToolExecs)
        .values({
          chatId: result[0].chatId,
          toolName: tool.name,
          executionData: calledTool,
          status: ToolExecStatus.Approved,
        })
        .returning()

      const toolResponse = await tool.func(
        response.lc_kwargs.tool_calls[0].args,
      )

      await this.database.db
        .update(ToolExecs)
        .set({
          status: ToolExecStatus.Executed,
          executedAt: new Date(),
        })
        .where(eq(ToolExecs.toolExecId, entity[0].toolExecId))

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
