import { AuthService } from '@/modules/auth/services/auth.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { CreateAuthsDto } from '@/modules/auth/dtos/create-auths.dto'

@Controller('users/:userId/auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.authService.findAll(user)
  }

  @Get(':authId')
  findOne(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('authId', ParseIntPipe) authId: number,
  ) {
    return this.authService.findOne(user, authId)
  }

  @Post()
  create(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body()
    createAuthDto: CreateAuthsDto,
  ) {
    return this.authService.create(user, createAuthDto)
  }

  @Delete(':authId')
  delete(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('authId', ParseIntPipe) authId: number,
  ) {
    return this.authService.delete(user, authId)
  }
}
