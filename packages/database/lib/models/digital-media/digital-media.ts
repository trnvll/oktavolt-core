import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export enum DigitalMediaTypeEnum {
  VIDEO = 'VIDEO',
  MUSIC = 'MUSIC',
  BOOK = 'BOOK',
  WEBSITE = 'WEBSITE',
}

export const DigitalMedia = pgTable('digital_media', {
  mediaId: serial('media_id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId),
  mediaType: text('media_type').notNull().$type<DigitalMediaTypeEnum>(),
  title: text('title').notNull(),
  link: text('link'),
  artistAuthor: text('artist_author'),
  duration: text('duration'),
  timestamp: timestamp('timestamp'),
})

export type SelectDigitalMedia = InferSelectModel<typeof DigitalMedia>
export type InsertDigitalMedia = InferInsertModel<typeof DigitalMedia>
