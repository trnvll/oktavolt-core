import { Logger, Module } from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { UsersController } from '@/modules/users/controllers/users.controller'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { UserEmbeddingsService } from '@/modules/users/services/user-embeddings.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { UsersEventsHandler } from '@/modules/users/handlers/users-events.handler'
import { NotificationsService } from '@/core/notifications/services/notifications.service'
import { SqsService } from '@/core/sqs/sqs.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'
import { UsersLlmApiToolsService } from '@/modules/users/services/users-llm-api-tools.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    Logger,
    NotificationsService,
    SqsService,
    UsersService,
    UserEmbeddingsService,
    LlmEmbeddingsService,
    LlmDataTransformationService,
    DatabaseService,
    UsersEventsHandler,
    UsersQueryService,
    UsersLlmApiToolsService,
  ],
  exports: [
    UsersService,
    UserEmbeddingsService,
    UsersLlmApiToolsService,
    UsersQueryService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
