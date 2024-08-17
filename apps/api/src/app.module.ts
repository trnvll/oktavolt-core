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
import { BullModule, BullModuleOptions } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { baseConfig } from '@/config/base.config'
import { awsConfig } from '@/config/aws.config'
import { databaseConfig } from '@/config/database.config'
import { RedisConfig, redisConfig } from '@/config/redis.config'
import { externalConfig } from '@/config/external.config'
import { EmbeddingsModule } from '@/modules/embeddings/embeddings.module'
import { ChatsModule } from '@/modules/chats/chats.module'
import { ToolExecsModule } from '@/modules/tool-execs/tool-execs.module'
import { json } from 'shared'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        baseConfig,
        awsConfig,
        redisConfig,
        externalConfig,
        databaseConfig,
      ],
      isGlobal: true,
      cache: true,
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot([
      {
        name: 'medium',
        ttl: 10_000,
        limit: 200,
      },
      {
        name: 'long',
        ttl: 60_000,
        limit: 500,
      },
    ]),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<BullModuleOptions> => {
        const redisConfig = configService.get<RedisConfig>('redis')
        const { username, port, host, password } = redisConfig ?? {}

        if (!host || !port) {
          throw new Error(
            `Redis configuration is missing. Got ${json(redisConfig)}`,
          )
        }

        return {
          redis: {
            username,
            host,
            port,
            password,
          },
        }
      },
    }),
    BullModule.registerQueue({
      name: QueueEnum.UserEvents,
    }),
    BullModule.registerQueue({
      name: QueueEnum.CommsEvents,
    }),
    BullModule.registerQueue({
      name: QueueEnum.RelationshipsEvents,
    }),
    BullModule.registerQueue({
      name: QueueEnum.ChatsEvents,
    }),
    BullModule.registerQueue({ name: QueueEnum.ResourcesEvents }),
    AuthzModule,
    UsersModule,
    EventsModule,
    SqsModule,
    LlmModule,
    NotificationsModule,
    EmbeddingsModule,
    ChatsModule,
    ToolExecsModule,
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
