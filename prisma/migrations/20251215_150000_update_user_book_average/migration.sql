CREATE OR REPLACE FUNCTION "public".recompute_user_book_level_score(p_user_id text, p_book_id text, p_level_id text)
RETURNS void AS $$
DECLARE
  v_score_sum double precision;
  v_answered integer;
  v_total_questions integer;
  v_existing_id text;
  v_average double precision;
BEGIN
  SELECT COALESCE(SUM(uqs.score)::double precision, 0), COUNT(DISTINCT uqs.question_id)
    INTO v_score_sum, v_answered
  FROM "public"."user_question_scores" uqs
  JOIN "public"."questions" q ON q.id = uqs.question_id
  WHERE uqs.user_id = p_user_id
    AND q.book_id = p_book_id
    AND q.level_id = p_level_id;

  SELECT COUNT(*)
    INTO v_total_questions
  FROM "public"."questions"
  WHERE book_id = p_book_id
    AND level_id = p_level_id;

  IF v_total_questions IS NULL OR v_total_questions = 0 THEN
    DELETE FROM "public"."user_book_level_scores"
     WHERE user_id = p_user_id AND book_id = p_book_id AND level_id = p_level_id;
    RETURN;
  END IF;

  IF v_answered IS NULL OR v_answered = 0 THEN
    DELETE FROM "public"."user_book_level_scores"
     WHERE user_id = p_user_id AND book_id = p_book_id AND level_id = p_level_id;
    RETURN;
  END IF;

  v_average := v_score_sum / v_total_questions::double precision;

  SELECT id INTO v_existing_id
    FROM "public"."user_book_level_scores"
   WHERE user_id = p_user_id AND book_id = p_book_id AND level_id = p_level_id;

  IF v_existing_id IS NULL THEN
    INSERT INTO "public"."user_book_level_scores" (id, user_id, book_id, level_id, average_score, total_questions, created_at, updated_at)
    VALUES (md5(random()::text || clock_timestamp()::text), p_user_id, p_book_id, p_level_id, v_average, v_total_questions, now(), now());
  ELSE
    UPDATE "public"."user_book_level_scores"
       SET average_score = v_average,
           total_questions = v_total_questions,
           updated_at = now()
     WHERE id = v_existing_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
