import { Injectable } from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { PaginationDto, SortDto } from 'shared'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { z } from 'zod'
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto'

@Injectable()
export class LlmToolsService {
  constructor(private readonly usersService: UsersService) {}

  getUserTools() {
    return [
      new DynamicStructuredTool({
        name: 'FindAllUsers',
        description: 'Find all users with pagination and sorting',
        schema: z.object({
          page: z.number().int().min(1).positive(),
          limit: z.number().int().positive(),
          sortBy: z.enum(['createdAt']),
          sortOrder: z.enum(['ASC', 'DESC']),
        }),
        func: async (input) => {
          const sortDto = await this.validateDto(SortDto, {
            sortBy: input.sortBy,
            sortOrder: input.sortOrder,
          })
          const paginationDto = await this.validateDto(PaginationDto, {
            page: input.page,
            limit: input.limit,
          })
          return await this.usersService.findAll(paginationDto, sortDto)
        },
      }),
      new DynamicStructuredTool({
        name: 'FindOneUser',
        description: 'Find a user by ID',
        schema: z.object({
          userId: z.number().int().positive(),
        }),
        func: async (input) => {
          return await this.usersService.findOne(input.userId)
        },
      }),
      new DynamicStructuredTool({
        name: 'CreateUser',
        description: 'Create a user',
        schema: z.object({
          firstName: z.string().describe("The user's first name"),
          lastName: z.string().describe("The user's last name"),
          email: z.string().email().describe("The user's email address"),
          phone: z.string().describe("The user's phone number"),
          dateOfBirth: z
            .string()
            .transform((value) => new Date(value))
            .describe("The user's date of birth"),
          context: z
            .string()
            .optional()
            .describe('Optional context for the user'),
        }),
        func: async (input) => {
          const createUserDto = await this.validateDto(CreateUserDto, {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            dateOfBirth: input.dateOfBirth,
            context: input.context,
          })
          return await this.usersService.create(createUserDto)
        },
      }),
      new DynamicStructuredTool({
        name: 'DeleteUser',
        description: 'Delete a user by ID',
        schema: z.object({
          userId: z.number().int().positive().describe("The user's ID"),
        }),
        func: async (input) => {
          if (!input.userId) throw new Error('User ID is required')
          return await this.usersService.delete(input.userId)
        },
      }),
    ]
  }

  private async validateDto(dtoClass: any, data: any) {
    const dto = plainToInstance(dtoClass, data)
    const errors = await validate(dto)
    if (errors.length > 0) {
      throw new Error(`Class validation failed: ${JSON.stringify(errors)}`)
    }
    return dto as any
  }
}
