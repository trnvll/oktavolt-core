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
import { PrefsService } from '@/modules/prefs/services/prefs.service'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { CreatePrefsDto } from '@/modules/prefs/dtos/create-prefs.dto'
import { LogActivity } from 'utils'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation } from '@nestjs/swagger'

@UseGuards(AuthGuard('jwt'))
@Controller('users/:userId/prefs')
export class PrefsController {
  constructor(private readonly prefsService: PrefsService) {}
  @Get()
  @ApiOperation({
    summary: 'Get all preferences.',
    description: 'Endpoint that returns a list of all preferences for a user.',
  })
  @LogActivity({
    level: 'debug',
  })
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.prefsService.findAll(user)
  }

  @Get(':prefId')
  @ApiOperation({
    summary: 'Get a preference.',
    description:
      'Endpoint that returns a single preference for a user, by their user and preference id.',
  })
  @LogActivity({
    level: 'debug',
  })
  findOne(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('prefId', ParseIntPipe) prefId: number,
  ) {
    return this.prefsService.findOne(user, prefId)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a preference.',
    description: 'Endpoint that creates a new preference for a user.',
  })
  @LogActivity({
    level: 'debug',
  })
  create(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body()
    createPrefDto: CreatePrefsDto,
  ) {
    return this.prefsService.create(user, createPrefDto)
  }

  @Delete(':prefId')
  @ApiOperation({
    summary: 'Delete a preference.',
    description:
      'Endpoint that deletes a single preference for a user, by their user and preference id.',
  })
  @LogActivity({
    level: 'debug',
  })
  delete(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('prefId', ParseIntPipe) prefId: number,
  ) {
    return this.prefsService.delete(user, prefId)
  }
}
