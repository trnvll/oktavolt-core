import { Module } from '@nestjs/common'
import { UsersModule } from '@/modules/users/users.module'
import { AuthzModule } from '@/core/authz/authz.module'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { EventsModule } from '@/core/events/events.module'
import { SqsModule } from '@/core/sqs/sqs.module'
import { LlmModule } from '@/core/llm/llm.module'
import { NotificationsModule } from '@/core/notifications/notifications.module'
import { ConfigModule } from '@nestjs/config'
import { baseConfig } from '@/config/base.config'
import { awsConfig } from '@/config/aws.config'
import { databaseConfig } from '@/config/database.config'
import { externalConfig } from '@/config/external.config'
import { EmbeddingsModule } from '@/modules/embeddings/embeddings.module'
import { ChatsModule } from '@/modules/chats/chats.module'
import { ToolExecsModule } from '@/modules/tool-execs/tool-execs.module'
import { SlackModule } from '@/modules/slack/slack.module'
import { ResourcesModule } from '@/modules/resources/resources.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [baseConfig, awsConfig, externalConfig, databaseConfig],
      isGlobal: true,
      cache: true,
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot([
      {
        name: 'medium',
        ttl: 10_000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 60_000,
        limit: 200,
      },
    ]),
    EventEmitterModule.forRoot(),
    AuthzModule,
    UsersModule,
    EventsModule,
    SqsModule,
    LlmModule,
    NotificationsModule,
    EmbeddingsModule,
    ChatsModule,
    ToolExecsModule,
    ResourcesModule,
    SlackModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
