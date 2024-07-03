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

@UseGuards(AuthGuard('jwt'))
@Controller('users/:userId/prefs')
export class PrefsController {
  constructor(private readonly prefsService: PrefsService) {}
  @Get()
  @LogActivity({
    level: 'debug',
  })
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.prefsService.findAll(user)
  }

  @Get(':prefId')
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
