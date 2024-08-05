import { Logger, Module } from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { UsersController } from '@/modules/users/controllers/users.controller'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { UserEmbeddingsService } from '@/modules/users/services/user-embeddings.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { UsersEventsHandler } from '@/modules/users/handlers/users-events.handler'
import { UsersEventsConsumer } from '@/modules/users/consumers/users-events.consumer'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { NotificationsService } from '@/core/notifications/services/notifications.service'
import { SqsService } from '@/core/sqs/sqs.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.UserEvents }),
  ],
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
    UsersEventsConsumer,
    UsersQueryService,
    UsersLlmToolsService,
  ],
  exports: [
    UsersService,
    UserEmbeddingsService,
    UsersLlmToolsService,
    UsersQueryService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
