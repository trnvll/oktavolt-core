import { IsEnum, IsOptional, IsString } from 'class-validator'

export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortDto<T = string> {
  @IsOptional()
  @IsString()
  sortBy?: T

  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortOrder: SortOrderEnum = SortOrderEnum.DESC
}
