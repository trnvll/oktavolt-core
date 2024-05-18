import { IsObject } from 'class-validator'

export class DataChangeDto {
  @IsObject()
  newValue: any

  @IsObject()
  oldValue?: any
}
