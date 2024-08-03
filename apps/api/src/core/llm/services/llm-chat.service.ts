import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseLLM } from '@langchain/core/dist/language_models/llms'
import { OpenAI } from '@langchain/openai'
import { ExternalConfig } from '@/config/external.config'
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages'

@Injectable()
export class LlmChatService {
  private llm: BaseLLM

  constructor(private configService: ConfigService) {
    this.init()
  }

  getLlm() {
    return this.llm
  }

  private init() {
    const externalConfig =
      this.configService.getOrThrow<ExternalConfig>('external')

    const llmType = 'openai' // could do this based off of config and what is in request
    const model = 'gpt-4o-mini' // could do this based off of config and what is in request

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

  async chat(
    message: string,
    context?: { history?: BaseMessage[]; systemPrompt?: string; tools?: any },
  ) {
    const messages: BaseMessage[] = []

    if (context?.systemPrompt) {
      messages.push(new SystemMessage(context.systemPrompt))
    }

    if (context?.history) {
      messages.push(...context.history)
    }

    messages.push(new HumanMessage(message))

    return this.llm.invoke(messages)
  }
}
