ALTER TABLE "summary" ADD COLUMN "chat_id" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "summary" ADD COLUMN "color1" varchar(256) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "summary_chat_id_idx" ON "summary" ("chat_id");