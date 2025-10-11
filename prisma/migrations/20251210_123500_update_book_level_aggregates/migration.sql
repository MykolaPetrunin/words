-- Remove obsolete trigger function tied to the dropped book_questions table
DROP FUNCTION IF EXISTS "public".trg_bq_level_after_ins_upd_del() CASCADE;
DROP FUNCTION IF EXISTS "public".recompute_user_book_level_scores_for_book_question(text, text) CASCADE;

-- Update aggregation helpers to rely on questions.book_id
CREATE OR REPLACE FUNCTION "public".recompute_user_book_level_score(p_user_id text, p_book_id text, p_level_id text)
RETURNS void AS $$
DECLARE
  v_avg double precision;
  v_total integer;
  v_existing_id text;
BEGIN
  SELECT AVG(uqs.score)::double precision, COUNT(DISTINCT uqs.question_id)
    INTO v_avg, v_total
  FROM "public"."user_question_scores" uqs
  JOIN "public"."questions" q ON q.id = uqs.question_id
  WHERE uqs.user_id = p_user_id
    AND q.book_id = p_book_id
    AND q.level_id = p_level_id;

  IF v_total IS NULL OR v_total = 0 THEN
    DELETE FROM "public"."user_book_level_scores"
     WHERE user_id = p_user_id AND book_id = p_book_id AND level_id = p_level_id;
    RETURN;
  END IF;

  SELECT id INTO v_existing_id
    FROM "public"."user_book_level_scores"
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
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "public".recompute_user_book_level_scores_for_user_question(p_user_id text, p_question_id text)
RETURNS void AS $$
DECLARE
  v_book_id text;
  v_level_id text;
BEGIN
  SELECT book_id, level_id INTO v_book_id, v_level_id
    FROM "public"."questions"
   WHERE id = p_question_id;

  IF v_book_id IS NULL OR v_level_id IS NULL THEN
    RETURN;
  END IF;

  PERFORM "public".recompute_user_book_level_score(p_user_id, v_book_id, v_level_id);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS "public".recompute_user_book_level_scores_for_question_level_change(text, text, text) CASCADE;

CREATE OR REPLACE FUNCTION "public".recompute_user_book_level_scores_for_question_change(
  p_question_id text,
  p_old_book_id text,
  p_new_book_id text,
  p_old_level_id text,
  p_new_level_id text
) RETURNS void AS $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT DISTINCT user_id FROM "public"."user_question_scores" WHERE question_id = p_question_id LOOP
    IF p_old_book_id IS NOT NULL AND p_old_level_id IS NOT NULL THEN
      PERFORM "public".recompute_user_book_level_score(r.user_id, p_old_book_id, p_old_level_id);
    END IF;
    IF p_new_book_id IS NOT NULL AND p_new_level_id IS NOT NULL THEN
      PERFORM "public".recompute_user_book_level_score(r.user_id, p_new_book_id, p_new_level_id);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS questions_level_after_update ON "public"."questions";
DROP FUNCTION IF EXISTS "public".trg_questions_level_after_update() CASCADE;

CREATE OR REPLACE FUNCTION "public".trg_questions_after_update()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.book_id IS DISTINCT FROM OLD.book_id OR NEW.level_id IS DISTINCT FROM OLD.level_id THEN
      PERFORM "public".recompute_user_book_level_scores_for_question_change(NEW.id, OLD.book_id, NEW.book_id, OLD.level_id, NEW.level_id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER questions_after_update
AFTER UPDATE ON "public"."questions"
FOR EACH ROW EXECUTE FUNCTION "public".trg_questions_after_update();
