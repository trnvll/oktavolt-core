import { Injectable } from '@nestjs/common'
import { BaseMessageChunk } from '@langchain/core/messages'
import { LogActivity } from 'utils'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import {
  Chats,
  ChatsToToolExecs,
  InsertChatsToToolExecs,
  InsertToolExec,
  ToolExecs,
} from 'database'
import { ChatTypeEnum, ToolExecStatus } from '@/patch/enums/external'
import { eq } from 'drizzle-orm'
import { DatabaseService } from '@/core/database/database.service'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'

@Injectable()
export class ToolExecsHandlingService {
  constructor(
    private readonly database: DatabaseService,
    private readonly toolExecsFnsService: ToolExecsFnsService,
  ) {}

  @LogActivity()
  async handleToolExec(data: {
    chatResponse: BaseMessageChunk
    toolDefs: GetLlmTool[]
    convId: number
    chatId: number
  }) {
    const { chatResponse, toolDefs, convId, chatId } = data
    const { toolCall, toolDef } = await this.getToolCallAndToolDef(
      chatResponse,
      toolDefs,
    )

    const { tool } = toolDef

    // - Create a tool execution record in the tool execs table and link it to the AI chat record
    const createToolExecResult = await this.createToolExec({
      toolName: tool.name,
      executionData: toolCall,
    })

    await this.createChatsToToolExecs({
      chatId,
      toolExecId: createToolExecResult[0].toolExecId,
    })

    // - Execute the tool call and store the response in the tool execs table, of the previously created record
    const toolResponse = await tool.func(toolCall.args)
    await this.updateToolExec(
      createToolExecResult[0].toolExecId,
      ToolExecStatus.Executed,
      toolResponse,
    )

    // - Create a new tool chat record which links to the same tool execution record
    const createToolChatResult = await this.createToolChat(toolResponse, convId)

    await this.createChatsToToolExecs({
      chatId: createToolChatResult[0].chatId,
      toolExecId: createToolExecResult[0].toolExecId,
    })

    return toolResponse
  }

  private async getToolCallAndToolDef(
    chatResponse: BaseMessageChunk,
    toolDefs: GetLlmTool[],
  ) {
    const toolCall = this.toolExecsFnsService.getCalledTool(chatResponse)

    if (!toolCall) {
      throw new Error('No tool call found.')
    }

    const toolDef = toolDefs.find((def) => def.tool.name === toolCall.name)

    if (!toolDef) {
      throw new Error('Tool not found.')
    }

    return { toolCall, toolDef }
  }

  private async createToolExec(
    data: Pick<InsertToolExec, 'toolName' | 'executionData'>,
  ) {
    return this.database.db
      .insert(ToolExecs)
      .values({
        toolName: data.toolName,
        executionData: data.executionData,
        status: ToolExecStatus.Approved,
      })
      .returning()
  }

  private async createChatsToToolExecs(data: InsertChatsToToolExecs) {
    return this.database.db.insert(ChatsToToolExecs).values({
      chatId: data.chatId,
      toolExecId: data.toolExecId,
    })
  }

  private async createToolChat(
    toolResponse: Record<string, any>,
    convId: number,
  ) {
    return this.database.db
      .insert(Chats)
      .values({
        content: JSON.stringify(toolResponse),
        type: ChatTypeEnum.Tool,
        convId,
      })
      .returning()
  }

  private async updateToolExec(
    toolExecId: number,
    status: ToolExecStatus,
    response: any,
  ) {
    await this.database.db
      .update(ToolExecs)
      .set({
        status,
        response,
      })
      .where(eq(ToolExecs.toolExecId, toolExecId))
  }
}
