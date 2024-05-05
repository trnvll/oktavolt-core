import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':userId')
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findOne(userId)
  }
}
