import { IsInt, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class GetInvitationDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number
}
