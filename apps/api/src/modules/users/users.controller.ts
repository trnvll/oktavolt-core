import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from '@/modules/users/users.service'
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto'
import { AuthGuard } from '@nestjs/passport'
import { UserSub } from '@/utils/decorators/user.decorator'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  async getUser(
    @Param('userId', ParseIntPipe) id: number,
    @UserSub() auth0Id: string,
  ) {
    return await this.usersService.findUser({ id, auth0Id })
  }
}
