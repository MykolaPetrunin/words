-- DropForeignKey
ALTER TABLE "public"."questions" DROP CONSTRAINT "questions_topic_id_fkey";

-- DropIndex
DROP INDEX "public"."questions_topic_id_idx";

-- AlterTable
ALTER TABLE "public"."questions" ALTER COLUMN "topic_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
