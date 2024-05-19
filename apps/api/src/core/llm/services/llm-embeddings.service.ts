import { Injectable } from '@nestjs/common'
import { OpenAIEmbeddings } from '@langchain/openai'
import { envConfig } from '@/config/env/env.config'

@Injectable()
export class LlmEmbeddingsService {
  private embeddings: OpenAIEmbeddings

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-small',
      openAIApiKey: envConfig.get('OPENAI_API_KEY'),
    })
  }

  async generateEmbeddings(content: string[]) {
    try {
      return this.embeddings.embedDocuments(content)
    } catch (err) {
      console.error('Error generating embeddings', err)
      return []
    }
  }
}
