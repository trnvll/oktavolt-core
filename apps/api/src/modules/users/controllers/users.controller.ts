import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { CreateUsersDto } from '@/modules/users/dtos/create-user.dto'
import { LogActivity } from 'utils'
import { QueryUsersDto } from '@/modules/users/dtos/query-users.dto'
import { UserSortFields } from '@/modules/users/types/user-sort-fields'
import { PaginationDto, SortDto } from 'shared'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('o')
  @LogActivity({
    level: 'debug',
  })
  async query(@Query() queryDto: QueryUsersDto) {
    return this.usersService.omni(queryDto.query)
  }

  @Get()
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
