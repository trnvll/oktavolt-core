import { TrackingEventDetailsDto } from '@/events/dtos/user-event/tracking-event-details.dto'
import { BusinessEventDetailsDto } from '@/events/dtos/user-event/business-event-details.dto'

export type EventDetails = TrackingEventDetailsDto | BusinessEventDetailsDto
