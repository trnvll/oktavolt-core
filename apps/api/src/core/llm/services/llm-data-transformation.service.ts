import { OpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExternalConfig } from '@/config/external.config'
import { LlmDataTransformationEntityType } from '@/core/llm/types/llm-data-transformation-service'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class LlmDataTransformationService {
  private model: OpenAI
  private prompts: Record<LlmDataTransformationEntityType, PromptTemplate>

  constructor(configService: ConfigService) {
    const externalConfig = configService.getOrThrow<ExternalConfig>('external')

    this.model = new OpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.0,
      openAIApiKey: externalConfig.openaiApiKey,
    })

    this.loadPrompts()
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

  private loadPrompts() {
    const getFilePath = (fileName: string) => {
      const basePath = path.join(__dirname, '../prompts/models')
      return path.join(basePath, fileName)
    }

    const usersPrompt = fs.readFileSync(getFilePath('users.txt'), 'utf8')
    const relationsPrompt = fs.readFileSync(
      getFilePath('relations.txt'),
      'utf8',
    )
    const commsPrompt = fs.readFileSync(getFilePath('comms.txt'), 'utf8')
    const prefsPrompt = fs.readFileSync(getFilePath('prefs.txt'), 'utf8')
    const chatsPrompt = fs.readFileSync(getFilePath('chats.txt'), 'utf8')

    this.prompts = {
      users: PromptTemplate.fromTemplate(usersPrompt),
      relations: PromptTemplate.fromTemplate(relationsPrompt),
      comms: PromptTemplate.fromTemplate(commsPrompt),
      prefs: PromptTemplate.fromTemplate(prefsPrompt),
      chats: PromptTemplate.fromTemplate(chatsPrompt),
    }
  }

  private getPromptForEntityType(
    entityType: LlmDataTransformationEntityType,
  ): PromptTemplate {
    return this.prompts[entityType]
  }

  private formatData(data: Record<string, any>): string {
    return Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  }
}
