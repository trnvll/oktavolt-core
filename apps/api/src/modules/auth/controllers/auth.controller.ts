import { AuthService } from '@/modules/auth/services/auth.service'
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
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { CreateAuthsDto } from '@/modules/auth/dtos/create-auths.dto'
import { LogActivity } from 'utils'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('users/:userId/auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @LogActivity({
    level: 'debug',
  })
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.authService.findAll(user)
  }

  @Get(':authId')
  @LogActivity({
    level: 'debug',
  })
  findOne(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('authId', ParseIntPipe) authId: number,
  ) {
    return this.authService.findOne(user, authId)
  }

  @Post()
  @LogActivity({
    level: 'debug',
  })
  create(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body()
    createAuthDto: CreateAuthsDto,
  ) {
    return this.authService.create(user, createAuthDto)
  }

  @Delete(':authId')
  @LogActivity({
    level: 'debug',
  })
  delete(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('authId', ParseIntPipe) authId: number,
  ) {
    return this.authService.delete(user, authId)
  }
}
