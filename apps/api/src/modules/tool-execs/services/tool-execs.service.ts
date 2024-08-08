import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { ToolExecs } from 'database'
import { ToolExecStatus } from '@/patch/enums/external'
import { desc, eq } from 'drizzle-orm'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'
import { BaseMessageChunk } from '@langchain/core/messages'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'

@Injectable()
export class ToolExecsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly usersLlmToolsService: UsersLlmToolsService,
    private readonly toolExecsFnsService: ToolExecsFnsService,
  ) {}

  async executeToolCall(response: BaseMessageChunk, chatId: number) {
    const toolCall = this.toolExecsFnsService.getCalledTool(response)

    if (!toolCall) {
      throw new Error('No tool call found.')
    }

    const userToolDefs = this.usersLlmToolsService.getToolDefs()
    const toolExecToolDefs = this.getToolDefs()

    const toolDefs = [...userToolDefs, ...toolExecToolDefs]

    const toolDef = toolDefs.find((def) => def.tool.name === toolCall.name)

    if (!toolDef) {
      throw new Error('Tool not found.')
    }

    const { tool, confirm } = toolDef

    if (confirm) {
      await this.database.db.insert(ToolExecs).values({
        chatId,
        toolName: tool.name,
        executionData: toolCall,
        status: ToolExecStatus.Pending,
      })

      return {
        name: tool.name,
        description: tool.description,
        status: ToolExecStatus.Pending,
        response: 'Tool call is pending confirmation.',
      }
    }

    const entity = await this.database.db
      .insert(ToolExecs)
      .values({
        chatId,
        toolName: tool.name,
        executionData: toolCall,
        status: ToolExecStatus.Approved,
      })
      .returning()

    const toolResponse = await tool.func(toolCall.args)

    await this.database.db
      .update(ToolExecs)
      .set({
        status: ToolExecStatus.Executed,
        executedAt: new Date(),
      })
      .where(eq(ToolExecs.toolExecId, entity[0].toolExecId))

    return {
      name: tool.name,
      description: tool.description,
      status: ToolExecStatus.Executed,
      response: toolResponse,
    }
  }

  async executePreviousToolCall() {
    const previousToolCall = await this.database.db.query.toolExecs.findFirst({
      where: eq(ToolExecs.status, ToolExecStatus.Pending),
      orderBy: desc(ToolExecs.createdAt),
    })

    if (!previousToolCall) {
      throw new Error('No pending tool call found.')
    }

    const userTools = this.usersLlmToolsService.getTools()
    const toolToCall = userTools.find(
      (tool) => tool.name === previousToolCall.toolName,
    )

    if (!toolToCall) {
      throw new Error('Tool not found.')
    }

    const toolArgs = (previousToolCall.executionData as any).args

    await this.database.db
      .update(ToolExecs)
      .set({
        status: ToolExecStatus.Approved,
        executedAt: new Date(),
      })
      .where(eq(ToolExecs.toolExecId, previousToolCall.toolExecId))

    const result = await toolToCall.func(toolArgs)

    await this.database.db
      .update(ToolExecs)
      .set({
        status: ToolExecStatus.Executed,
        executedAt: new Date(),
      })
      .where(eq(ToolExecs.toolExecId, previousToolCall.toolExecId))

    return result
  }

  getToolDefs(): GetLlmTool[] {
    return [
      {
        tool: new DynamicStructuredTool({
          name: 'ConfirmToolExecution',
          description: 'User confirmation for tool execution of previous chat.',
          schema: z.object({
            confirm: z
              .boolean()
              .describe(
                'Whether the user confirms the execution of the previous tool call.',
              ),
          }),
          func: async (input) => {
            if (!input.confirm) {
              return {
                response: 'User rejected the tool execution.',
              }
            }
            return await this.executePreviousToolCall()
          },
        }),
      },
    ]
  }
}
