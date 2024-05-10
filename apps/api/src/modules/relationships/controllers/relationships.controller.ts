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
import { LogActivity } from 'utils'

@Controller('users/:userId/relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}
  @Get()
  @LogActivity({
    level: 'debug',
  })
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.relationshipsService.findAll(user)
  }

  @Get(':relationshipId')
  @LogActivity({
    level: 'debug',
  })
  findOne(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('relationshipId', ParseIntPipe) relationshipId: number,
  ) {
    return this.relationshipsService.findOne(user, relationshipId)
  }

  @Post()
  @LogActivity({
    level: 'debug',
  })
  create(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body()
    createRelationshipsDto: CreateRelationshipsDto,
  ) {
    return this.relationshipsService.create(user, createRelationshipsDto)
  }

  @Delete(':relationshipId')
  @LogActivity({
    level: 'debug',
  })
  delete(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('relationshipId', ParseIntPipe) relationshipId: number,
  ) {
    return this.relationshipsService.delete(user, relationshipId)
  }
}
