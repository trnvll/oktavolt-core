import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { CreateUsersDto } from '@/modules/users/dtos/create-user.dto'
import { LogActivity } from 'utils'
import { UserSortFields } from '@/modules/users/types/user-sort-fields'
import { PaginationDto, SortDto } from 'shared'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation } from '@nestjs/swagger'

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users.',
    description: 'Endpoint that returns a list of all users.',
  })
  @LogActivity({
    level: 'debug',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto<UserSortFields>,
  ) {
    return this.usersService.findAll(paginationDto, sortDto)
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get a user.',
    description: 'Endpoint that returns a single user by their user id.',
  })
  @LogActivity({
    level: 'debug',
  })
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findOne(userId)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a user.',
    description: 'Endpoint that creates a new user.',
  })
  @LogActivity({
    level: 'debug',
  })
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto)
  }

  @Delete(':userId')
  @ApiOperation({
    summary: 'Delete a user.',
    description: 'Endpoint that deletes a user by their user id.',
  })
  @LogActivity({
    level: 'debug',
  })
  delete(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.delete(userId)
  }
}
