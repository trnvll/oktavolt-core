import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { LogActivity } from 'utils'
import { Type } from 'class-transformer'
import { ChatTypeEnum, InsertChat } from 'database'

export class CreateChatsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChatDto)
  data: CreateChatDto[]

  @LogActivity({ level: 'debug' })
  static toEntity(userId: number, dto: CreateChatDto[]) {
    return dto.map((chat) => CreateChatDto.toEntity(userId, chat))
  }
}

export class CreateChatDto {
  @IsString()
  message: string

  @IsOptional()
  @IsString()
  type = ChatTypeEnum.Human

  static toEntity(userId: number, dto: CreateChatDto): InsertChat {
    return {
      userId,
      content: dto.message,
      type: dto.type,
    }
  }
}
