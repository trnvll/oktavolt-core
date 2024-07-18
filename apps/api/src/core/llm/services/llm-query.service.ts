import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseLLM } from '@langchain/core/dist/language_models/llms'
import { OpenAI } from '@langchain/openai'
import { ExternalConfig } from '@/config/external.config'

@Injectable()
export class LlmQueryService {
  private llm: BaseLLM

  constructor(private configService: ConfigService) {
    this.init()
  }

  private init() {
    const externalConfig =
      this.configService.getOrThrow<ExternalConfig>('external')

    const llmType = 'openai' // could do this based off of config and what is in request
    const model = 'gpt-4o' // could do this based off of config and what is in request

    switch (llmType) {
      case 'openai':
        this.llm = new OpenAI({
          openAIApiKey: externalConfig.openaiApiKey,
          modelName: model,
          temperature: 0.7,
        })
        break
      default:
        throw new Error(`Unsupported LLM type: ${llmType}`)
    }
  }

  async query(prompt: string): Promise<string> {
    try {
      return this.llm.invoke(prompt)
    } catch (error) {
      console.error('Error querying LLM:', error)
      throw new Error('Failed to query LLM')
    }
  }
}
