import { Module } from '@nestjs/common'
import { RelationshipsModule } from '@/modules/relationships/relationships.module'
import { UsersModule } from '@/modules/users/users.module'
import { CommsModule } from '@/modules/comms/comms.module'
import { PrefsModule } from '@/modules/prefs/prefs.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { AuthzModule } from '@/core/authz/authz.module'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { EventsModule } from '@/core/events/events.module'
import { SqsModule } from '@/core/sqs/sqs.module'
import { LlmModule } from '@/core/llm/llm.module'
import { NotificationsModule } from '@/core/notifications/notifications.module'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { envConfig } from '@/config/env/env.config'

@Module({
  imports: [
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
    BullModule.forRoot({
      redis: {
        username: envConfig.get('REDIS_USERNAME'),
        host: envConfig.get('REDIS_HOST'),
        port: envConfig.get('REDIS_PORT'),
        password: envConfig.get('REDIS_PASSWORD'),
      },
    }),
    BullModule.registerQueue({
      name: QueueEnum.UserEvents,
    }),
    AuthzModule,
    UsersModule,
    CommsModule,
    RelationshipsModule,
    PrefsModule,
    AuthModule,
    EventsModule,
    SqsModule,
    LlmModule,
    NotificationsModule,
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
