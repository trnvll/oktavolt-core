CREATE TABLE IF NOT EXISTS "user_events" (
	"user_id" numeric NOT NULL,
	"event_origin" text NOT NULL,
	"event_type" text NOT NULL,
	"event_details" jsonb NOT NULL,
	"timestamp" timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "user_events_pkey" PRIMARY KEY("user_id","timestamp")
);
SELECT create_hypertable('user_events', 'timestamp');
