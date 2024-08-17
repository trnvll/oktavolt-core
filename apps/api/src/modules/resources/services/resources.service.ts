import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Resources } from 'database'
import { DatabaseService } from '@/core/database/database.service'
import { CreateResourceDto } from '@/modules/resources/dtos/create-resource.dto'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'

@Injectable()
export class ResourcesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
  ) {}

  async create(userId: number, createResourceDto: CreateResourceDto) {
    const embedding = await this.generateEmbeddings(createResourceDto.content)

    const entity = CreateResourceDto.toEntity(createResourceDto, {
      embedding: embedding[0], // TODO: handle multiple embeddings with for loop
      userId,
    })

    const results = await this.database.db
      .insert(Resources)
      .values(entity)
      .returning()

    return results[0]
  }

  async generateEmbeddings(content: string) {
    try {
      return this.llmEmbeddingsService.generateEmbeddings([content])
    } catch (err) {
      throw new InternalServerErrorException('Error generating embeddings.')
    }
  }
}
