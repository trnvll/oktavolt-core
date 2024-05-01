import { Injectable } from '@nestjs/common'
import { GetInvitationDto } from '@/modules/invitations/dtos/get-invitation.dto'

@Injectable()
export class InvitationsService {
  async getInvitation(invitationDto: GetInvitationDto) {
    const { userId } = invitationDto
    return `${process.env.PLATFORM_URL}/invitations/${userId}`
  }
}
