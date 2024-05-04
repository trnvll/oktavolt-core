import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from './user'

export const DigitalMedia = pgTable('digital_media', {
  mediaId: serial('media_id').primaryKey(),
  userId: integer('user_id').references(() => Users.userId),
  mediaType: text('media_type'),
  title: text('title'),
  link: text('link'),
  artist_author: text('artist_author'),
  duration: text('duration'),
  timestamp: timestamp('timestamp'),
})
