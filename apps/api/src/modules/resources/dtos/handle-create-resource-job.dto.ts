import { IsNumber, IsObject } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateResourceDto } from '@/modules/resources/dtos/create-resource.dto'

export class HandleCreateResourceJobDto {
  @IsObject()
  @Type(() => CreateResourceDto)
  data: CreateResourceDto

  @IsNumber()
  userId: number
}
