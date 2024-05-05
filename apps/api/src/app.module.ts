import { Module } from '@nestjs/common'
import { AuthzModule } from '@/authz/authz.module'
import { RelationshipsModule } from '@/modules/relationships/relationships.module'
import { UsersModule } from '@/modules/users/users.module'
import { CommsModule } from '@/modules/comms/comms.module'
import { PrefsModule } from '@/modules/prefs/prefs.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    AuthzModule,
    UsersModule,
    CommsModule,
    RelationshipsModule,
    PrefsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
