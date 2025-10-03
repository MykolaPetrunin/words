/*
  Warnings:

  - Added the required column `topic_id` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."questions" ADD COLUMN     "topic_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."topics" (
    "id" TEXT NOT NULL,
    "title_uk" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questions_topic_id_idx" ON "public"."questions"("topic_id");

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
