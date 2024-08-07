import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { json } from 'shared'

export const validateToolDto = async <T extends ClassConstructor<any>>(
  dtoClass: T,
  data: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const dto = plainToInstance(dtoClass, data)
  const errors = await validate(dto)
  if (errors.length > 0) {
    throw new Error(`[validateToolDto] failed: ${json(errors)}`)
  }
  return dto as InstanceType<T>
}
