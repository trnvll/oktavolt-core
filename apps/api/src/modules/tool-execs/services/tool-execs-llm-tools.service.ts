import { Injectable } from '@nestjs/common'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { ToolExecsService } from '@/modules/tool-execs/services/tool-execs.service'

@Injectable()
export class ToolExecsLlmToolsService {
  constructor(private readonly toolExecsService: ToolExecsService) {}

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
            return await this.toolExecsService.executePreviousToolCall()
          },
        }),
      },
    ]
  }
}
