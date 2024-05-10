import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { CreateUsersDto } from '@/modules/users/dtos/create-user.dto'
import { LogActivity } from 'utils'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @LogActivity({
    level: 'debug',
  })
  async findAll() {
    return this.usersService.findAll()
  }

  @Get(':userId')
  @LogActivity({
    level: 'debug',
  })
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findOne(userId)
  }

  @Post()
  @LogActivity({
    level: 'debug',
  })
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto)
  }

  @Delete(':userId')
  @LogActivity({
    level: 'debug',
  })
  delete(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.delete(userId)
  }
}
