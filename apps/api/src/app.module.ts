import { Module } from '@nestjs/common'
import { AuthzModule } from '@/authz/authz.module'
import { RelationshipsModule } from '@/modules/relationships/relationships.module'
import { UsersModule } from '@/modules/users/users.module'
import { CommsModule } from '@/modules/comms/comms.module'
import { PrefsModule } from '@/modules/prefs/prefs.module'

@Module({
  imports: [
    AuthzModule,
    UsersModule,
    CommsModule,
    RelationshipsModule,
    PrefsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
