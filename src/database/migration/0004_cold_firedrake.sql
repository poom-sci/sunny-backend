CREATE TABLE IF NOT EXISTS "mood" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(256) NOT NULL,
	"date" date NOT NULL,
	"week" integer NOT NULL,
	"play" integer NOT NULL,
	"work" integer NOT NULL,
	"study" integer NOT NULL,
	"relationship" integer NOT NULL,
	"health" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "mood_uid_idx" ON "mood" ("uid");