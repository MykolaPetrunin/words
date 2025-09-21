-- Add questions_per_session column to users table
ALTER TABLE "users" ADD COLUMN "questions_per_session" INTEGER NOT NULL DEFAULT 10;
