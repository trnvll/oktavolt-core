import { Module } from '@nestjs/common'
import { AuthzModule } from '@/authz/authz.module'
import { UsersModule } from './modules/users/users.module'
import { UsersController } from '@/modules/users/users.controller'
import { InvitationsModule } from '@/modules/invitations/invitations.module'
import { InvitationsController } from '@/modules/invitations/invitations.controller'

@Module({
  imports: [AuthzModule, UsersModule, InvitationsModule],
  controllers: [UsersController, InvitationsController],
  providers: [],
})
export class AppModule {}
