import { DynamicStructuredTool } from '@langchain/core/tools'

export type GetLlmTool = {
  tool: DynamicStructuredTool<any>
  confirm?: boolean
}
