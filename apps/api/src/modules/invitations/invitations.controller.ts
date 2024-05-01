import { Controller, Get, Param, Res } from '@nestjs/common'
import { InvitationsService } from '@/modules/invitations/invitations.service'
import { GetInvitationDto } from '@/modules/invitations/dtos/get-invitation.dto'
import { Response } from 'express'

@Controller('invitations')
export class InvitationsController {
  constructor(private invitationsService: InvitationsService) {}

  @Get(':userId')
  async getInvitation(
    @Param() invitationDto: GetInvitationDto,
    @Res() res: Response,
  ) {
    const invitationUrl = await this.invitationsService.getInvitation(
      invitationDto,
    )
    console.debug(invitationUrl)
    return res.status(302).header('Location', invitationUrl).send()
  }
}
