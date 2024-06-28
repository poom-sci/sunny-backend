DO $$ BEGIN
 CREATE TYPE "chatCreatedByType" AS ENUM('user', 'system');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "messageCreatedByType" AS ENUM('user', 'system');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "messageStatus" AS ENUM('pending', 'processing', 'failed', 'success');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "registerType" AS ENUM('email', 'google', 'github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(256) NOT NULL,
	"date" date NOT NULL,
	"created_by" "chatCreatedByType" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(256) NOT NULL,
	"chat_id" varchar(256) NOT NULL,
	"date" date NOT NULL,
	"text" text NOT NULL,
	"status" "messageStatus" NOT NULL,
	"created_by" "messageCreatedByType" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personal" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firebase_uid" varchar(256) NOT NULL,
	"user_name" varchar(256) NOT NULL,
	"first_name" varchar(256),
	"last_name" varchar(256),
	"email" varchar(256) NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"display_image" text,
	"phone_number" varchar(256),
	"register_type" "registerType" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(256) NOT NULL,
	"date" date NOT NULL,
	"color" varchar(256) NOT NULL,
	"summary" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_uid_idx" ON "chat" ("uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_uid_idx" ON "message" ("uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chat_id_idx" ON "message" ("chat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "personal_email_idx" ON "personal" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "personal_firebase_uid_idx" ON "personal" ("firebase_uid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "summary_uid_idx" ON "summary" ("uid");