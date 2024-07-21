import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { Embeddings, SelectPreferences } from 'database'

@Injectable()
export class PrefsEmbeddingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly llmDataTransformationService: LlmDataTransformationService,
  ) {}

  async generateAndSaveEmbeddings(pref: SelectPreferences) {
    const content = await this.createEmbedding(pref)
    try {
      const embeddings = await this.llmEmbeddingsService.generateEmbeddings([
        content,
      ])
      await this.database.db.insert(Embeddings).values({
        prefId: pref.prefId,
        embedding: embeddings[0],
        content: content,
      })
    } catch (err) {
      console.error('Error generating and saving embeddings', err)
    }
  }

  private createEmbedding(pref: SelectPreferences) {
    const prefData = {
      prefId: pref.prefId,
      type: pref.preferenceType,
      context: pref.context,
      createdAt: pref.createdAt,
      updatedAt: pref.updatedAt,
    }
    return this.llmDataTransformationService.transform('prefs', prefData)
  }
}
