import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/model'
import { DigitalMediaTypeEnum } from '@/models/digital-media/enums'
import { timestamps } from '@/utils/timestamps'
import { varchar } from 'drizzle-orm/pg-core'

export const DigitalMedia = pgTable('digital_media', {
  ...timestamps,
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
  context: varchar('context'),
})
