import { Module } from '@nestjs/common'
import { EventsModule } from '@/modules/events/events.module'
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [
    EventsModule,
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
