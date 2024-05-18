import { IsObject } from 'class-validator'

export class DataChangeDto {
  @IsObject()
  oldValue: any

  @IsObject()
  newValue: any
}
