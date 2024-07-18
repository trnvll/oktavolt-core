import { OpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExternalConfig } from '@/config/external.config'
import { LlmDataTransformationEntityType } from '@/core/llm/types/llm-data-transformation-service'

@Injectable()
export class LlmDataTransformationService {
  private model: OpenAI

  constructor(private readonly configService: ConfigService) {
    const externalConfig = configService.getOrThrow<ExternalConfig>('external')

    this.model = new OpenAI({
      modelName: 'gpt-4o', // shouldn't be any problem to change this to gpt-3.5 if costly
      temperature: 0.7,
      openAIApiKey: externalConfig.openaiApiKey,
    })
  }

  async transform(
    entityType: LlmDataTransformationEntityType,
    data: Record<string, any>,
  ): Promise<string> {
    const prompt = this.getPromptForEntityType(entityType)
    const formattedData = this.formatData(data)

    const result = await prompt.format({ data: formattedData })
    const response = await this.model.invoke(result)

    return response.trim()
  }

  private getPromptForEntityType(
    entityType: LlmDataTransformationEntityType,
  ): PromptTemplate {
    const prompts: Record<LlmDataTransformationEntityType, PromptTemplate> = {
      users: PromptTemplate.fromTemplate(
        'Convert the following user data into a natural language description. Only include available information, and format it in a coherent paragraph:\n{data}\nNatural language description:',
      ),
      relations: PromptTemplate.fromTemplate(
        'Describe the following relationship data in natural language. Focus on the connection between entities and any relevant details:\n{data}\nRelationship description:',
      ),
      comms: PromptTemplate.fromTemplate(
        'Summarize the following communication data in natural language. Include key points about the type of communication, participants, and any important details:\n{data}\nCommunication summary:',
      ),
      prefs: PromptTemplate.fromTemplate(
        'Explain the following user preference data in natural language. Describe the preferences clearly and concisely:\n{data}\nPreference explanation:',
      ),
    }

    return prompts[entityType] || prompts.users
  }

  private formatData(data: Record<string, any>): string {
    return Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  }
}
