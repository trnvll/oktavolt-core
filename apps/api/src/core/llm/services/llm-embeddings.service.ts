import { Injectable } from '@nestjs/common'
import { OpenAIEmbeddings } from '@langchain/openai'
import { ConfigService } from '@nestjs/config'
import { ExternalConfig } from '@/config/external.config'

@Injectable()
export class LlmEmbeddingsService {
  private embeddings: OpenAIEmbeddings

  constructor(private readonly configService: ConfigService) {
    const externalConfig = configService.get<ExternalConfig>('external')

    if (!externalConfig?.openaiApiKey) {
      throw new Error('OpenAI API Key is missing.')
    }

    this.embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-small',
      openAIApiKey: externalConfig.openaiApiKey,
    })
  }

  async generateEmbeddings(content: string[]) {
    try {
      return this.embeddings.embedDocuments(content)
    } catch (err) {
      console.error('Error generating embeddings', err)
      throw err
    }
  }

  async generateEmbeddingForQuery(query: string) {
    try {
      return this.embeddings.embedQuery(query)
    } catch (err) {
      console.error('Error generating embedding for query', err)
      throw err
    }
  }
}
