import {
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const UserEvents = pgTable(
  'user_events',
  {
    userId: integer('user_id').notNull(),
    eventOrigin: text('event_origin').notNull(),
    eventType: text('event_type').notNull(),
    eventDetails: jsonb('event_details').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({
      name: 'user_events_pkey',
      columns: [table.userId, table.timestamp],
    }),
  }),
)
