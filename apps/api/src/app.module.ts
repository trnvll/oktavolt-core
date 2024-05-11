import { Module } from '@nestjs/common'
import { RelationshipsModule } from '@/modules/relationships/relationships.module'
import { UsersModule } from '@/modules/users/users.module'
import { CommsModule } from '@/modules/comms/comms.module'
import { PrefsModule } from '@/modules/prefs/prefs.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { AuthzModule } from '@/core/authz/authz.module'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [
    CacheModule.register(),
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
  ],
})
export class AppModule {}
