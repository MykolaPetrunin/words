-- CreateTable: book_topics (many-to-many relation between books and topics)
CREATE TABLE "public"."book_topics" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_topics_pkey" PRIMARY KEY ("id")
);

-- Indexes for performance and uniqueness
CREATE INDEX "book_topics_book_id_idx" ON "public"."book_topics"("book_id");
CREATE INDEX "book_topics_topic_id_idx" ON "public"."book_topics"("topic_id");
CREATE UNIQUE INDEX "book_topics_book_id_topic_id_key" ON "public"."book_topics"("book_id", "topic_id");

-- Foreign keys
ALTER TABLE "public"."book_topics" ADD CONSTRAINT "book_topics_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."book_topics" ADD CONSTRAINT "book_topics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
