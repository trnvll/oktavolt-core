import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { DigitalMedia } from '@/models'

export type SelectDigitalMedia = InferSelectModel<typeof DigitalMedia>
export type InsertDigitalMedia = InferInsertModel<typeof DigitalMedia>
