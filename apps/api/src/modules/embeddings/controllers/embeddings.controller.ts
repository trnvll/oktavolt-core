import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { EmbeddingsService } from '@/modules/embeddings/services/embeddings.service'
import { AuthGuard } from '@nestjs/passport'
import { GenerateEmbeddingsDto } from '@/modules/embeddings/dtos/generate-embeddings.dto'

@Controller('embeddings')
@UseGuards(AuthGuard('jwt'))
export class EmbeddingsController {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Post()
  async generateEmbeddings(@Body() genEmbedDto: GenerateEmbeddingsDto) {
    return this.embeddingsService.generateEmbeddings(genEmbedDto.content)
  }
}
