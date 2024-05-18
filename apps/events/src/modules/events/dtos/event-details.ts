import { BusinessEventDetailsDto } from '@/modules/events/dtos/business-event-details.dto'
import { TrackingEventDetailsDto } from '@/modules/events/dtos/tracking-event-details.dto'

export type EventDetails = TrackingEventDetailsDto | BusinessEventDetailsDto
