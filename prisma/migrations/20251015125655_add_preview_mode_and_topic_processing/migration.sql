-- AlterTable
ALTER TABLE "public"."questions" ADD COLUMN     "preview_mode" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."topics" ADD COLUMN     "is_processing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "processing_started_at" TIMESTAMP(3);
