DROP INDEX IF EXISTS "futureMe_uid_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "goal_uid_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "mood_uid_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "summary_uid_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "futureMe_uid_idx" ON "futureMe" ("uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "goal_uid_idx" ON "goal" ("uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mood_uid_idx" ON "mood" ("uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "summary_uid_idx" ON "summary" ("uid");