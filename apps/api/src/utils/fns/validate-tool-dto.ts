import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

export const validateToolDto = async (dtoClass: any, data: any) => {
  const dto = plainToInstance(dtoClass, data)
  const errors = await validate(dto)
  if (errors.length > 0) {
    throw new Error(`Class validation failed: ${JSON.stringify(errors)}`)
  }
  return dto as any
}
