import { Injectable } from '@nestjs/common'
import { BaseMessageChunk } from '@langchain/core/messages'
import { GetLlmTool } from '@/types/tools/get-llm-tools'

@Injectable()
export class ToolExecsFnsService {
  constructor() {}

  hasToolCalls(response: BaseMessageChunk) {
    return response?.lc_kwargs?.tool_calls?.length
  }

  getCalledTool(response: BaseMessageChunk) {
    return response.lc_kwargs.tool_calls[0]
  }

  getCalledToolDef(response: BaseMessageChunk, toolDefs: GetLlmTool[]) {
    const calledTool = this.getCalledTool(response)
    return toolDefs.find((def) => def.tool.name === calledTool.name)
  }

  isGenericToolCall(response: BaseMessageChunk) {
    return (
      this.hasToolCalls(response) &&
      this.getCalledTool(response).name !== 'ConfirmToolExecution'
    )
  }
}
