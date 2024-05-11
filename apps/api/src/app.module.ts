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
    AuthzModule,
    UsersModule,
    CommsModule,
    RelationshipsModule,
    PrefsModule,
    AuthModule,
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
