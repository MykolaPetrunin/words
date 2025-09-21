-- CreateTable: subjects
CREATE TABLE "public"."subjects" (
    "id" TEXT NOT NULL,
    "name_uk" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description_uk" TEXT,
    "description_en" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable: book_subjects (many-to-many relation)
CREATE TABLE "public"."book_subjects" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable: user_subject_level_scores
CREATE TABLE "public"."user_subject_level_scores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "average_score" DOUBLE PRECISION NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_subject_level_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "book_subjects_book_id_idx" ON "public"."book_subjects"("book_id");
CREATE INDEX "book_subjects_subject_id_idx" ON "public"."book_subjects"("subject_id");
CREATE UNIQUE INDEX "book_subjects_book_id_subject_id_key" ON "public"."book_subjects"("book_id", "subject_id");

-- CreateIndex
CREATE INDEX "user_subject_level_scores_user_id_idx" ON "public"."user_subject_level_scores"("user_id");
CREATE INDEX "user_subject_level_scores_subject_id_idx" ON "public"."user_subject_level_scores"("subject_id");
CREATE INDEX "user_subject_level_scores_level_id_idx" ON "public"."user_subject_level_scores"("level_id");
CREATE UNIQUE INDEX "user_subject_level_scores_user_id_subject_id_level_id_key" ON "public"."user_subject_level_scores"("user_id", "subject_id", "level_id");

-- AddForeignKey
ALTER TABLE "public"."book_subjects" ADD CONSTRAINT "book_subjects_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."book_subjects" ADD CONSTRAINT "book_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_subject_level_scores" ADD CONSTRAINT "user_subject_level_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_subject_level_scores" ADD CONSTRAINT "user_subject_level_scores_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."user_subject_level_scores" ADD CONSTRAINT "user_subject_level_scores_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Functions for recomputing subject level scores
CREATE OR REPLACE FUNCTION recompute_user_subject_level_score(p_user_id text, p_subject_id text, p_level_id text)
RETURNS void AS $$
DECLARE v_avg double precision; v_total integer; v_existing_id text;
BEGIN
  SELECT AVG(ubls.average_score)::double precision, SUM(ubls.total_questions)
    INTO v_avg, v_total
  FROM "public"."user_book_level_scores" ubls
  JOIN "public"."book_subjects" bs ON bs.book_id = ubls.book_id
  WHERE ubls.user_id = p_user_id
    AND bs.subject_id = p_subject_id
    AND ubls.level_id = p_level_id;

  IF v_total IS NULL OR v_total = 0 THEN
    DELETE FROM "public"."user_subject_level_scores" WHERE user_id = p_user_id AND subject_id = p_subject_id AND level_id = p_level_id;
    RETURN;
  END IF;

  SELECT id INTO v_existing_id FROM "public"."user_subject_level_scores"
   WHERE user_id = p_user_id AND subject_id = p_subject_id AND level_id = p_level_id;

  IF v_existing_id IS NULL THEN
    INSERT INTO "public"."user_subject_level_scores" (id, user_id, subject_id, level_id, average_score, total_questions, created_at, updated_at)
    VALUES (md5(random()::text || clock_timestamp()::text), p_user_id, p_subject_id, p_level_id, v_avg, v_total, now(), now());
  ELSE
    UPDATE "public"."user_subject_level_scores"
       SET average_score = v_avg,
           total_questions = v_total,
           updated_at = now()
     WHERE id = v_existing_id;
  END IF;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recompute_user_subject_level_scores_for_book_level(p_user_id text, p_book_id text, p_level_id text)
RETURNS void AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT DISTINCT subject_id FROM "public"."book_subjects" WHERE book_id = p_book_id LOOP
    PERFORM recompute_user_subject_level_score(p_user_id, r.subject_id, p_level_id);
  END LOOP;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recompute_user_subject_level_scores_for_book_subject(p_book_id text, p_subject_id text)
RETURNS void AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT DISTINCT user_id, level_id FROM "public"."user_book_level_scores" WHERE book_id = p_book_id LOOP
    PERFORM recompute_user_subject_level_score(r.user_id, p_subject_id, r.level_id);
  END LOOP;
END; $$ LANGUAGE plpgsql;

-- Update existing triggers to also recompute subject scores
CREATE OR REPLACE FUNCTION trg_ubls_after_ins_upd_del()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM recompute_user_subject_level_scores_for_book_level(NEW.user_id, NEW.book_id, NEW.level_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.user_id <> OLD.user_id OR NEW.book_id <> OLD.book_id OR NEW.level_id <> OLD.level_id THEN
      PERFORM recompute_user_subject_level_scores_for_book_level(OLD.user_id, OLD.book_id, OLD.level_id);
      PERFORM recompute_user_subject_level_scores_for_book_level(NEW.user_id, NEW.book_id, NEW.level_id);
    ELSE
      PERFORM recompute_user_subject_level_scores_for_book_level(NEW.user_id, NEW.book_id, NEW.level_id);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM recompute_user_subject_level_scores_for_book_level(OLD.user_id, OLD.book_id, OLD.level_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER ubls_after_ins_upd_del
AFTER INSERT OR UPDATE OR DELETE ON "public"."user_book_level_scores"
FOR EACH ROW EXECUTE FUNCTION trg_ubls_after_ins_upd_del();

-- Triggers for book_subjects changes
CREATE OR REPLACE FUNCTION trg_bs_after_ins_upd_del()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM recompute_user_subject_level_scores_for_book_subject(NEW.book_id, NEW.subject_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.book_id <> OLD.book_id OR NEW.subject_id <> OLD.subject_id THEN
      PERFORM recompute_user_subject_level_scores_for_book_subject(OLD.book_id, OLD.subject_id);
      PERFORM recompute_user_subject_level_scores_for_book_subject(NEW.book_id, NEW.subject_id);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM recompute_user_subject_level_scores_for_book_subject(OLD.book_id, OLD.subject_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER bs_after_ins_upd_del
AFTER INSERT OR UPDATE OR DELETE ON "public"."book_subjects"
FOR EACH ROW EXECUTE FUNCTION trg_bs_after_ins_upd_del();
