DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "user_role" AS ENUM ('ADMIN', 'USER');
    END IF;
END$$;

ALTER TABLE "public"."users"
ADD COLUMN IF NOT EXISTS "role" "user_role" NOT NULL DEFAULT 'USER';

