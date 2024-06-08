import { CreateEventDto } from 'shared'

export interface IEventHandler {
  handleEvent(event: CreateEventDto): Promise<void>
}
