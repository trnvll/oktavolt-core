import { Module } from '@nestjs/common'
import { InvitationsService } from '@/modules/invitations/invitations.service'
import { InvitationsController } from '@/modules/invitations/invitations.controller'

@Module({
  imports: [],
  providers: [InvitationsService],
  exports: [InvitationsService],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
