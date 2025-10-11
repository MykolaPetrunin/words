ALTER TABLE "public"."book_questions" DROP CONSTRAINT "book_questions_book_id_fkey";

ALTER TABLE "public"."book_questions" DROP CONSTRAINT "book_questions_question_id_fkey";

ALTER TABLE "public"."book_topics" DROP CONSTRAINT "book_topics_book_id_fkey";

ALTER TABLE "public"."book_topics" DROP CONSTRAINT "book_topics_topic_id_fkey";

ALTER TABLE "public"."topics" ALTER COLUMN "book_id" SET NOT NULL;

ALTER TABLE "public"."questions" ALTER COLUMN "book_id" SET NOT NULL;

DROP TABLE "public"."book_questions";

DROP TABLE "public"."book_topics";

CREATE INDEX "topics_book_id_idx" ON "public"."topics"("book_id");

ALTER TABLE "public"."topics" ADD CONSTRAINT "topics_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
