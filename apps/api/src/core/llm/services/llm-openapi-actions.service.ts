import { Injectable } from '@nestjs/common'
import {
  AgentExecutor,
  createOpenAIFunctionsAgent,
  OpenApiToolkit,
} from 'langchain/agents'
import { JsonObject, JsonSpec } from 'langchain/tools'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { pull } from 'langchain/hub'
import { ChatOpenAI } from '@langchain/openai'
import { ConfigService } from '@nestjs/config'
import { ExternalConfig } from '@/config/external.config'

@Injectable()
export class LlmOpenapiActionsService {
  private agent: AgentExecutor | null = null
  private externalConfig: ExternalConfig

  constructor(private readonly configService: ConfigService) {
    const externalConfig = configService.get<ExternalConfig>('external')
    if (!externalConfig) {
      throw new Error('External config not found')
    }
    this.externalConfig = externalConfig
  }

  async init(openapiJsonSpecParsed: JsonObject) {
    try {
      const jsonSpec = new JsonSpec(openapiJsonSpecParsed)
      // console.log('JSON Spec created:', jsonSpec)

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.externalConfig.openaiApiKey}`,
      }

      const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
      const toolkit = new OpenApiToolkit(jsonSpec, model, headers)
      // console.log('Toolkit created:', JSON.stringify(toolkit, null, 2))

      const tools = toolkit.tools
      console.log('Tools:', JSON.stringify(tools, null, 2))

      const prompt = await pull<ChatPromptTemplate>(
        'hwchase17/openai-functions-agent',
      )

      const agent = await createOpenAIFunctionsAgent({
        llm: model,
        tools,
        prompt,
      })

      this.agent = new AgentExecutor({
        agent,
        tools,
        verbose: true,
      })

      console.log('Agent executor created successfully')
    } catch (error) {
      console.error('Error initializing LlmOpenapiActionsService:', error)
      throw error
    }
  }

  async executeAction(input: string): Promise<string> {
    if (!this.agent) {
      throw new Error(
        'OpenAPI executor not initialized. Call initializeFromJson first.',
      )
    }

    try {
      const result = await this.agent.invoke({ input })
      return result.output
    } catch (error) {
      console.error('Error executing OpenAPI action:', error)
      throw new Error('Failed to execute OpenAPI action')
    }
  }
}
