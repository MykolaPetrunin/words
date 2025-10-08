-- Ensure every book has at least one subject
CREATE OR REPLACE FUNCTION "public"."enforce_book_has_subject"(p_book_id text)
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "public"."books" WHERE id = p_book_id) THEN
        RETURN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM "public"."book_subjects" WHERE book_id = p_book_id) THEN
        RAISE EXCEPTION 'Book % must have at least one subject', p_book_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "public"."trg_books_require_subject"()
RETURNS trigger AS $$
BEGIN
    PERFORM "public"."enforce_book_has_subject"(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER "books_require_subject"
AFTER INSERT OR UPDATE ON "public"."books"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "public"."trg_books_require_subject"();

CREATE OR REPLACE FUNCTION "public"."trg_book_subjects_require_subject"()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.book_id IS DISTINCT FROM OLD.book_id THEN
        PERFORM "public"."enforce_book_has_subject"(OLD.book_id);
        PERFORM "public"."enforce_book_has_subject"(NEW.book_id);
        RETURN NEW;
    END IF;

    PERFORM "public"."enforce_book_has_subject"(COALESCE(NEW.book_id, OLD.book_id));

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER "book_subjects_require_subject"
AFTER DELETE OR UPDATE ON "public"."book_subjects"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "public"."trg_book_subjects_require_subject"();
