import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { EmbeddingsService } from '@/modules/embeddings/services/embeddings.service'
import { AuthGuard } from '@nestjs/passport'
import {
  GenerateEmbeddingsDto,
  GenerateEmbeddingsResponseDto,
} from '@/modules/embeddings/dtos/generate-embeddings.dto'
import { QueryEmbeddingsDto } from '@/modules/embeddings/dtos/query-embeddings.dto'

@Controller('embeddings')
@UseGuards(AuthGuard('jwt'))
export class EmbeddingsController {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Get('o')
  async query(@Query() queryDto: QueryEmbeddingsDto) {
    return this.embeddingsService.omni(queryDto.query)
  }

  @Post()
  async generateEmbeddings(@Body() genEmbedDto: GenerateEmbeddingsDto) {
    const embeddings = await this.embeddingsService.generateEmbeddings(
      genEmbedDto.content,
    )
    return GenerateEmbeddingsResponseDto.fromEntity(embeddings)
  }
}
