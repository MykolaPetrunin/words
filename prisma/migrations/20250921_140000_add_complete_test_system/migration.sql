-- CreateTable: levels
CREATE TABLE "public"."levels" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name_uk" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable: books
CREATE TABLE "public"."books" (
    "id" TEXT NOT NULL,
    "title_uk" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "description_uk" TEXT,
    "description_en" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable: questions
CREATE TABLE "public"."questions" (
    "id" TEXT NOT NULL,
    "text_uk" TEXT NOT NULL,
    "text_en" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "level_id" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: answers
CREATE TABLE "public"."answers" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "text_uk" TEXT NOT NULL,
    "text_en" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: book_questions
CREATE TABLE "public"."book_questions" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: user_question_scores
CREATE TABLE "public"."user_question_scores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_question_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable: user_book_level_scores
CREATE TABLE "public"."user_book_level_scores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "average_score" DOUBLE PRECISION NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_book_level_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "levels_key_key" ON "public"."levels"("key");

-- CreateIndex
CREATE INDEX "questions_level_id_idx" ON "public"."questions"("level_id");

-- CreateIndex
CREATE INDEX "answers_question_id_idx" ON "public"."answers"("question_id");
CREATE UNIQUE INDEX "answers_question_id_order_index_key" ON "public"."answers"("question_id", "order_index");

-- CreateIndex
CREATE INDEX "book_questions_book_id_idx" ON "public"."book_questions"("book_id");
CREATE INDEX "book_questions_question_id_idx" ON "public"."book_questions"("question_id");
CREATE UNIQUE INDEX "book_questions_book_id_question_id_key" ON "public"."book_questions"("book_id", "question_id");
CREATE UNIQUE INDEX "book_questions_book_id_order_index_key" ON "public"."book_questions"("book_id", "order_index");

-- CreateIndex
CREATE INDEX "user_question_scores_user_id_idx" ON "public"."user_question_scores"("user_id");
CREATE INDEX "user_question_scores_question_id_idx" ON "public"."user_question_scores"("question_id");
CREATE UNIQUE INDEX "user_question_scores_user_id_question_id_key" ON "public"."user_question_scores"("user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_book_level_scores_user_id_book_id_level_id_key" ON "public"."user_book_level_scores"("user_id", "book_id", "level_id");
CREATE INDEX "user_book_level_scores_user_id_idx" ON "public"."user_book_level_scores"("user_id");
CREATE INDEX "user_book_level_scores_book_id_idx" ON "public"."user_book_level_scores"("book_id");
CREATE INDEX "user_book_level_scores_level_id_idx" ON "public"."user_book_level_scores"("level_id");

-- Constraints
ALTER TABLE "public"."levels" ADD CONSTRAINT "levels_order_index_non_negative" CHECK ("order_index" >= 0);
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_order_index_non_negative" CHECK ("order_index" >= 0);
ALTER TABLE "public"."book_questions" ADD CONSTRAINT "book_questions_order_index_non_negative" CHECK ("order_index" >= 0);
ALTER TABLE "public"."user_question_scores" ADD CONSTRAINT "user_question_scores_score_non_negative" CHECK ("score" >= 0);

-- Unique constraint: one correct answer per question
CREATE UNIQUE INDEX "answers_one_correct_per_question" ON "public"."answers"("question_id") WHERE is_correct = true;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."book_questions" ADD CONSTRAINT "book_questions_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."book_questions" ADD CONSTRAINT "book_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_question_scores" ADD CONSTRAINT "user_question_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_question_scores" ADD CONSTRAINT "user_question_scores_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_book_level_scores" ADD CONSTRAINT "user_book_level_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_book_level_scores" ADD CONSTRAINT "user_book_level_scores_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_book_level_scores" ADD CONSTRAINT "user_book_level_scores_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed base levels
INSERT INTO "public"."levels" ("id", "key", "name_uk", "name_en", "is_active", "order_index", "created_at", "updated_at") VALUES
  ('junior','junior','Junior','Junior', true, 0, now(), now()),
  ('middle','middle','Middle','Middle', true, 1, now(), now()),
  ('senior','senior','Senior','Senior', true, 2, now(), now())
ON CONFLICT ("id") DO NOTHING;

-- Functions for recomputing aggregated user_book_level_scores
CREATE OR REPLACE FUNCTION recompute_user_book_level_score(p_user_id text, p_book_id text, p_level_id text)
RETURNS void AS $$
DECLARE v_avg double precision; v_total integer; v_existing_id text;
BEGIN
  SELECT AVG(uqs.score)::double precision, COUNT(DISTINCT uqs.question_id)
    INTO v_avg, v_total
  FROM "public"."user_question_scores" uqs
  JOIN "public"."book_questions" bq ON bq.question_id = uqs.question_id
  JOIN "public"."questions" q ON q.id = uqs.question_id
  WHERE uqs.user_id = p_user_id
    AND bq.book_id = p_book_id
    AND q.level_id = p_level_id;

  IF v_total IS NULL OR v_total = 0 THEN
    DELETE FROM "public"."user_book_level_scores" WHERE user_id = p_user_id AND book_id = p_book_id AND level_id = p_level_id;
    RETURN;
  END IF;

  SELECT id INTO v_existing_id FROM "public"."user_book_level_scores"
   WHERE user_id = p_user_id AND book_id = p_book_id AND level_id = p_level_id;

  IF v_existing_id IS NULL THEN
    INSERT INTO "public"."user_book_level_scores" (id, user_id, book_id, level_id, average_score, total_questions, created_at, updated_at)
    VALUES (md5(random()::text || clock_timestamp()::text), p_user_id, p_book_id, p_level_id, v_avg, v_total, now(), now());
  ELSE
    UPDATE "public"."user_book_level_scores"
       SET average_score = v_avg,
           total_questions = v_total,
           updated_at = now()
     WHERE id = v_existing_id;
  END IF;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recompute_user_book_level_scores_for_user_question(p_user_id text, p_question_id text)
RETURNS void AS $$
DECLARE r record; v_level_id text;
BEGIN
  SELECT level_id INTO v_level_id FROM "public"."questions" WHERE id = p_question_id;
  FOR r IN SELECT DISTINCT book_id FROM "public"."book_questions" WHERE question_id = p_question_id LOOP
    PERFORM recompute_user_book_level_score(p_user_id, r.book_id, v_level_id);
  END LOOP;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recompute_user_book_level_scores_for_book_question(p_book_id text, p_question_id text)
RETURNS void AS $$
DECLARE r record; v_level_id text;
BEGIN
  SELECT level_id INTO v_level_id FROM "public"."questions" WHERE id = p_question_id;
  FOR r IN SELECT DISTINCT user_id FROM "public"."user_question_scores" WHERE question_id = p_question_id LOOP
    PERFORM recompute_user_book_level_score(r.user_id, p_book_id, v_level_id);
  END LOOP;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recompute_user_book_level_scores_for_question_level_change(p_question_id text, p_old_level_id text, p_new_level_id text)
RETURNS void AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT DISTINCT user_id, book_id FROM "public"."user_question_scores" uqs JOIN "public"."book_questions" bq ON bq.question_id = uqs.question_id WHERE uqs.question_id = p_question_id LOOP
    PERFORM recompute_user_book_level_score(r.user_id, r.book_id, p_old_level_id);
    PERFORM recompute_user_book_level_score(r.user_id, r.book_id, p_new_level_id);
  END LOOP;
END; $$ LANGUAGE plpgsql;

-- Triggers for automatic recomputation
CREATE OR REPLACE FUNCTION trg_uqs_level_after_ins_upd_del()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM recompute_user_book_level_scores_for_user_question(NEW.user_id, NEW.question_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.user_id <> OLD.user_id OR NEW.question_id <> OLD.question_id THEN
      PERFORM recompute_user_book_level_scores_for_user_question(OLD.user_id, OLD.question_id);
      PERFORM recompute_user_book_level_scores_for_user_question(NEW.user_id, NEW.question_id);
    ELSE
      PERFORM recompute_user_book_level_scores_for_user_question(NEW.user_id, NEW.question_id);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM recompute_user_book_level_scores_for_user_question(OLD.user_id, OLD.question_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER uqs_level_after_ins_upd_del
AFTER INSERT OR UPDATE OR DELETE ON "public"."user_question_scores"
FOR EACH ROW EXECUTE FUNCTION trg_uqs_level_after_ins_upd_del();

CREATE OR REPLACE FUNCTION trg_bq_level_after_ins_upd_del()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM recompute_user_book_level_scores_for_book_question(NEW.book_id, NEW.question_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.book_id <> OLD.book_id OR NEW.question_id <> OLD.question_id THEN
      PERFORM recompute_user_book_level_scores_for_book_question(OLD.book_id, OLD.question_id);
      PERFORM recompute_user_book_level_scores_for_book_question(NEW.book_id, NEW.question_id);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM recompute_user_book_level_scores_for_book_question(OLD.book_id, OLD.question_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER bq_level_after_ins_upd_del
AFTER INSERT OR UPDATE OR DELETE ON "public"."book_questions"
FOR EACH ROW EXECUTE FUNCTION trg_bq_level_after_ins_upd_del();

CREATE OR REPLACE FUNCTION trg_questions_level_after_update()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.level_id <> OLD.level_id THEN
    PERFORM recompute_user_book_level_scores_for_question_level_change(NEW.id, OLD.level_id, NEW.level_id);
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER questions_level_after_update
AFTER UPDATE ON "public"."questions"
FOR EACH ROW EXECUTE FUNCTION trg_questions_level_after_update();
