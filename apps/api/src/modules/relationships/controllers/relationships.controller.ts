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
import { RelationshipsService } from '@/modules/relationships/services/relationships.service'
import { CreateRelationshipsDto } from '@/modules/relationships/dtos/create-relationships.dto'

@Controller('users/:userId/relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}
  @Get()
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.relationshipsService.findAll(user)
  }

  @Get(':relationshipId')
  findOne(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('relationshipId', ParseIntPipe) relationshipId: number,
  ) {
    return this.relationshipsService.findOne(user, relationshipId)
  }

  @Post()
  create(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body()
    createRelationshipsDto: CreateRelationshipsDto,
  ) {
    return this.relationshipsService.create(user, createRelationshipsDto)
  }

  @Delete(':relationshipId')
  delete(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('relationshipId', ParseIntPipe) relationshipId: number,
  ) {
    return this.relationshipsService.delete(user, relationshipId)
  }
}
