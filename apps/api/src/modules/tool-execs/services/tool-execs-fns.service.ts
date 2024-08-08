import { Injectable } from '@nestjs/common'
import { BaseMessageChunk } from '@langchain/core/messages'

@Injectable()
export class ToolExecsFnsService {
  constructor() {}

  hasToolCalls(response: BaseMessageChunk) {
    return response?.lc_kwargs?.tool_calls?.length
  }

  getCalledTool(response: BaseMessageChunk) {
    return response.lc_kwargs.tool_calls[0]
  }

  isGenericToolCall(response: BaseMessageChunk) {
    return (
      this.hasToolCalls(response) &&
      this.getCalledTool(response).name !== 'ConfirmToolExecution'
    )
  }
}
