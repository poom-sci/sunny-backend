CREATE TABLE IF NOT EXISTS "futureMe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"duration" integer NOT NULL,
	"count" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "futureMe_uid_idx" ON "futureMe" ("uid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "goal_uid_idx" ON "goal" ("uid");