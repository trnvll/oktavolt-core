import { Injectable } from '@nestjs/common'
import { CreateEventDto } from '@/modules/events/dtos/create-event.dto'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { UserEvents } from 'tsdb'
import { LogActivity } from 'utils'

@Injectable()
export class EventsService {
  constructor(private readonly tsdbService: TsdbService) {}

  @LogActivity()
  async createUserEvent(userEventDto: CreateEventDto) {
    const entity = userEventDto.toEntity()
    const result = await this.tsdbService.db
      .insert(UserEvents)
      .values(entity)
      .returning()
    return CreateEventDto.fromEntity(result[0])
  }
}
