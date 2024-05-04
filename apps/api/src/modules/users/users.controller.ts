import { Controller, Get } from '@nestjs/common'
import { UsersService } from '@/modules/users/users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }
}
