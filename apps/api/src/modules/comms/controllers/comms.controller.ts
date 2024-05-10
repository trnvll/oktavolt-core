import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { CommsService } from '@/modules/comms/services/comms.service'
import { CreateCommsDto } from '@/modules/comms/dtos/create-comms.dto'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { LogActivity } from 'utils'

@Controller('users/:userId/comms')
export class CommsController {
  constructor(private readonly commsService: CommsService) {}
  @Get()
  @LogActivity({
    level: 'debug',
  })
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.commsService.findAll(user)
  }

  @Get(':commId')
  @LogActivity({
    level: 'debug',
  })
  findOne(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('commId', ParseIntPipe) commId: number,
  ) {
    return this.commsService.findOne(user, commId)
  }

  @Post()
  @LogActivity({
    level: 'debug',
  })
  create(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body()
    createCommunicationDto: CreateCommsDto,
  ) {
    return this.commsService.create(user, createCommunicationDto)
  }

  @Delete(':commId')
  @LogActivity({
    level: 'debug',
  })
  delete(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('commId', ParseIntPipe) commId: number,
  ) {
    return this.commsService.delete(user, commId)
  }
}
