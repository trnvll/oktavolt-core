import { IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : value))
  page = 1

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100_000)
  @Transform(({ value }) => (value ? Number(value) : value))
  limit = 10

  get offset(): number {
    return (this.page - 1) * this.limit
  }
}
