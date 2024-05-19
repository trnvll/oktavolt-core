import { Module } from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { UsersController } from '@/modules/users/controllers/users.controller'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { UserEmbeddingsService } from '@/modules/users/services/user-embeddings.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    UsersService,
    UserEmbeddingsService,
    LlmEmbeddingsService,
    DatabaseService,
  ],
  exports: [UsersService, UserEmbeddingsService],
  controllers: [UsersController],
})
export class UsersModule {}
