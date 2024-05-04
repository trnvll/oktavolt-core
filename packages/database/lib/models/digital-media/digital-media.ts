import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'

export enum DigitalMediaTypeEnum {
  VIDEO = 'VIDEO',
  MUSIC = 'MUSIC',
  BOOK = 'BOOK',
  WEBSITE = 'WEBSITE',
}

export const DigitalMedia = pgTable('digital_media', {
  mediaId: serial('media_id').primaryKey(),
  userId: integer('user_id').references(() => Users.userId),
  mediaType: text('media_type').$type<DigitalMediaTypeEnum>(),
  title: text('title'),
  link: text('link'),
  artistAuthor: text('artist_author'),
  duration: text('duration'),
  timestamp: timestamp('timestamp'),
})
