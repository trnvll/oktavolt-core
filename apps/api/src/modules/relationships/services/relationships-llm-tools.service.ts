import { Injectable } from '@nestjs/common'
import { RelationshipsService } from '@/modules/relationships/services/relationships.service'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { validateToolDto } from '@/utils/fns/validate-tool-dto'
import { UsersService } from '@/modules/users/services/users.service'
import { CreateRelationshipsDto } from '@/modules/relationships/dtos/create-relationships.dto'
import { RelationshipTypeEnum } from '@/patch/enums/external'
import { GetLlmTool } from '@/types/tools/get-llm-tools'

@Injectable()
export class RelationshipsLlmToolsService {
  constructor(
    private readonly relationshipsService: RelationshipsService,
    private readonly usersService: UsersService,
  ) {}

  getTools(): GetLlmTool['tool'][] {
    return this.getToolDefs().map((def) => def.tool)
  }

  getToolDefs(): GetLlmTool[] {
    return [
      {
        tool: new DynamicStructuredTool({
          name: 'FindAllUserRelationships',
          description: 'Find all relationships for a user',
          schema: z.object({
            userId: z.number().int().positive(),
          }),
          func: async (input) => {
            const user = await this.usersService.findUserById(input.userId)
            return await this.relationshipsService.findAll(user)
          },
        }),
      },
      {
        tool: new DynamicStructuredTool({
          name: 'FindOneUserRelationship',
          description: 'Find a user relationship by ID',
          schema: z.object({
            userId: z.number().int().positive(),
            relationshipId: z.number().int().positive(),
          }),
          func: async (input) => {
            const user = await this.usersService.findUserById(input.userId)
            return await this.relationshipsService.findOne(
              user,
              input.relationshipId,
            )
          },
        }),
      },
      {
        confirm: true,
        tool: new DynamicStructuredTool({
          name: 'CreateUserRelationship',
          description: 'Create a relationship for a user',
          schema: z.object({
            userId: z.number().int().positive().describe("The user's ID"),
            name: z.string().describe('The name of the related person'),
            relationType: z
              .nativeEnum(RelationshipTypeEnum)
              .describe('The type of relationship'),
            email: z
              .string()
              .email()
              .optional()
              .describe('The email of the related person'),
            phone: z
              .string()
              .optional()
              .describe('The phone number of the related person'),
            address: z
              .string()
              .optional()
              .describe('The address of the related person'),
            context: z
              .string()
              .optional()
              .describe('Additional context for the relationship'),
          }),
          func: async (input) => {
            const user = await this.usersService.findUserById(input.userId)
            const createRelationshipsDto = await validateToolDto(
              CreateRelationshipsDto,
              {
                data: [
                  {
                    name: input.name,
                    relationType: input.relationType,
                    email: input.email,
                    phone: input.phone,
                    address: input.address,
                    context: input.context,
                  },
                ],
              },
            )
            return await this.relationshipsService.create(
              user,
              createRelationshipsDto,
            )
          },
        }),
      },
      {
        confirm: true,
        tool: new DynamicStructuredTool({
          name: 'DeleteUserRelationship',
          description: 'Delete a user relationship by ID',
          schema: z.object({
            userId: z.number().int().positive().describe("The user's ID"),
            relationshipId: z
              .number()
              .int()
              .positive()
              .describe("The relationship's ID"),
          }),
          func: async (input) => {
            const user = await this.usersService.findUserById(input.userId)
            return await this.relationshipsService.delete(
              user,
              input.relationshipId,
            )
          },
        }),
      },
    ]
  }
}
