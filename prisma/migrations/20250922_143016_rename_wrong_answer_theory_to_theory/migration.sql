-- Rename columns in answers table from wrong_answer_theory_* to theory_*
ALTER TABLE "public"."answers" RENAME COLUMN "wrong_answer_theory_uk" TO "theory_uk";
ALTER TABLE "public"."answers" RENAME COLUMN "wrong_answer_theory_en" TO "theory_en";
