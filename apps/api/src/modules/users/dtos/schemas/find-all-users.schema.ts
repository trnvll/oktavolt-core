import { z } from 'zod'

const ZPaginationDtoSchema = z.object({
  page: z.number().describe('The page number').optional(),
  limit: z.number().describe('The number of items per page').optional(),
})

const ZSortOrderEnum = z.enum(['ASC', 'DESC'])

const ZSortDtoSchema = z.object({
  sortBy: z.string().describe('The field to sort by').optional(),
  sortOrder: ZSortOrderEnum.default('DESC').describe('The sort order'),
})

export const ZPaginationAndSortDtoSchema = z.object({
  paginationDto: ZPaginationDtoSchema,
  sortDto: ZSortDtoSchema,
})
