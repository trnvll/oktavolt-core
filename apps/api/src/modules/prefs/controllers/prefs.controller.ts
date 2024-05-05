import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { PrefsService } from '@/modules/prefs/services/prefs.service'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { CreatePrefsDto } from '@/modules/prefs/dtos/create-prefs.dto'

@Controller('users/:userId/prefs')
export class PrefsController {
  constructor(private readonly prefsService: PrefsService) {}
  @Get()
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.prefsService.findAll(user)
  }

  @Get(':prefId')
  findOne(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('prefId', ParseIntPipe) prefId: number,
  ) {
    return this.prefsService.findOne(user, prefId)
  }

  @Post()
  create(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body()
    createPrefDto: CreatePrefsDto,
  ) {
    return this.prefsService.create(user, createPrefDto)
  }

  @Delete(':prefId')
  delete(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('prefId', ParseIntPipe) prefId: number,
  ) {
    return this.prefsService.delete(user, prefId)
  }
}
