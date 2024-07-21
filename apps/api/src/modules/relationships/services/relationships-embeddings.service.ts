import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { Embeddings, SelectRelationships } from 'database'

@Injectable()
export class RelationshipsEmbeddingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly llmDataTransformationService: LlmDataTransformationService,
  ) {}

  async generateAndSaveEmbeddings(relationship: SelectRelationships) {
    const content = await this.createEmbedding(relationship)
    try {
      const embeddings = await this.llmEmbeddingsService.generateEmbeddings([
        content,
      ])
      await this.database.db.insert(Embeddings).values({
        relationshipId: relationship.relationshipId,
        embedding: embeddings[0],
        content: content,
      })
    } catch (err) {
      console.error('Error generating and saving embeddings', err)
    }
  }

  private createEmbedding(relationship: SelectRelationships) {
    const relationshipData = {
      id: relationship.relationshipId,
      type: relationship.relationType,
      email: relationship.email,
      phoneNumber: relationship.phone,
      name: relationship.name,
      address: relationship.address,
      context: relationship.context,
      createdAt: relationship.createdAt,
      updatedAt: relationship.updatedAt,
    }
    return this.llmDataTransformationService.transform(
      'relations',
      relationshipData,
    )
  }
}
