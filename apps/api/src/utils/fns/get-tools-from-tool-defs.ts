import { GetLlmTool } from '@/types/tools/get-llm-tools'

export const getToolsFromToolDefs = (
  toolDefs: GetLlmTool[],
): GetLlmTool['tool'][] => {
  return toolDefs.map((def) => def.tool)
}
