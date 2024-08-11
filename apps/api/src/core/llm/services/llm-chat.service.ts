import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChatOpenAI } from '@langchain/openai'
import { ExternalConfig } from '@/config/external.config'
import { BaseMessage, SystemMessage } from '@langchain/core/messages'
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { json } from 'shared'

@Injectable()
export class LlmChatService {
  private llm: BaseChatModel

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
        this.llm = new ChatOpenAI({
          openAIApiKey: externalConfig.openaiApiKey,
          modelName: model,
          temperature: 0.5,
        })
        break
      default:
        throw new Error(`Unsupported LLM type: ${llmType}`)
    }
  }

  async chat(
    message: BaseMessage,
    context?: {
      systemPrompt?: string
      history?: BaseMessage[]
      tools?: DynamicStructuredTool[]
    },
  ) {
    // add history
    const messages: BaseMessage[] = []

    if (context?.systemPrompt) {
      messages.push(new SystemMessage(context.systemPrompt))
    }

    if (context?.history) {
      messages.push(...context.history)
    }

    messages.push(message)

    if (context?.tools) {
      console.log(
        'Executing LLM with tools:',
        json(context.tools.map((tool) => tool.name)),
      )
      const llmWithTools = this.llm.bindTools?.(context.tools)
      return llmWithTools?.invoke(messages)
    }

    return this.llm.invoke(messages)
  }
}
