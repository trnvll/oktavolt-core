import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { RelationshipsService } from '@/modules/relationships/services/relationships.service'
import { CreateRelationshipsDto } from '@/modules/relationships/dtos/create-relationships.dto'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation } from '@nestjs/swagger'

@UseGuards(AuthGuard('jwt'))
@Controller('users/:userId/relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}
  @Get()
  @ApiOperation({
    summary: 'Get all relationships.',
    description:
      'Endpoint that returns a list of all relationships for a user.',
  })
  findAll(@Param('userId', FindUserByIdPipe) user: SelectUser) {
    return this.relationshipsService.findAll(user)
  }

  @Get(':relationshipId')
  @ApiOperation({
    summary: 'Get a relationship.',
    description:
      'Endpoint that returns a single relationship for a user, by their user and relationship id.',
  })
  findOne(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('relationshipId', ParseIntPipe) relationshipId: number,
  ) {
    return this.relationshipsService.findOne(user, relationshipId)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a relationship.',
    description: 'Endpoint that creates a new relationship for a user.',
  })
  create(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body()
    createRelationshipsDto: CreateRelationshipsDto,
  ) {
    return this.relationshipsService.create(user, createRelationshipsDto)
  }

  @Delete(':relationshipId')
  @ApiOperation({
    summary: 'Delete a relationship.',
    description:
      'Endpoint that deletes a single relationship for a user, by their user and relationship id.',
  })
  delete(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Param('relationshipId', ParseIntPipe) relationshipId: number,
  ) {
    return this.relationshipsService.delete(user, relationshipId)
  }
}
