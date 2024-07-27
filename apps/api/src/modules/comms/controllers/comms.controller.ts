import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CommsService } from '@/modules/comms/services/comms.service'
import { CreateCommsDto } from '@/modules/comms/dtos/create-comms.dto'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { LogActivity } from 'utils'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation } from '@nestjs/swagger'

@UseGuards(AuthGuard('jwt'))
@Controller('users/:userId/comms')
export class CommsController {
  constructor(private readonly commsService: CommsService) {}
  @Get()
  @ApiOperation({
    summary: 'Get all communications.',
    description:
      'Endpoint that returns a list of all communications or conversations for a user.',
  })
  @LogActivity({
    level: 'debug',
  })
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.commsService.findAll(user)
  }

  @Get(':commId')
  @ApiOperation({
    summary: 'Get a communication.',
    description:
      'Endpoint that returns a single communication or conversation for a user, by their user and communication id.',
  })
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
  @ApiOperation({
    summary: 'Create a communication.',
    description:
      'Endpoint that creates a new communication or conversation for a user.',
  })
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
  @ApiOperation({
    summary: 'Delete a communication.',
    description:
      'Endpoint that deletes a single communication or conversation for a user, by their user and communication id.',
  })
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
