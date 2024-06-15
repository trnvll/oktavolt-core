import { Module } from '@nestjs/common'
import { EventsModule } from '@/modules/events/events.module'
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { MixpanelModule } from '@/modules/mixpanel/mixpanel.module'
import { TimeSeriesDatabaseModule } from '@/modules/time-series-database/time-series-database.module'
import { ConfigModule } from '@nestjs/config'
import { baseConfig } from '@/config/base.config'
import { databaseConfig } from '@/config/database.config'
import { externalConfig } from '@/config/external.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [baseConfig, databaseConfig, externalConfig],
      isGlobal: true,
      cache: true,
    }),
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
    MixpanelModule,
    TimeSeriesDatabaseModule,
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
