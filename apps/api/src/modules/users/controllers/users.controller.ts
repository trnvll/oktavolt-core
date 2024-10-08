import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto'
import { UserSortFields } from '@/modules/users/types/user-sort-fields'
import { PaginationDto, SearchDto, SortDto } from 'shared'
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
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto<UserSortFields>,
    @Query() searchDto: SearchDto,
  ) {
    return this.usersService.findAll(paginationDto, sortDto, searchDto)
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get a user.',
    description: 'Endpoint that returns a single user by their user id.',
  })
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findOne(userId)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a user.',
    description: 'Endpoint that creates a new user.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a user.',
    description: 'Endpoint that deletes a user by their user id.',
  })
  delete(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.delete(userId)
  }
}
