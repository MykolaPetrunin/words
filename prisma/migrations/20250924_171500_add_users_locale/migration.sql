-- Create enum type for user locale if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_locale') THEN
        CREATE TYPE "user_locale" AS ENUM ('uk', 'en');
    END IF;
END$$;

-- Add locale column to users table with NOT NULL and default 'en'
ALTER TABLE "public"."users"
ADD COLUMN IF NOT EXISTS "locale" "user_locale" NOT NULL DEFAULT 'en';


