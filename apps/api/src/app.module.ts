import { Module } from '@nestjs/common'
import { AuthzModule } from '@/authz/authz.module'
import { UsersModule } from './modules/users/users.module'
import { CommsModule } from './modules/comms/comms.module'

@Module({
  imports: [AuthzModule, UsersModule, CommsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
