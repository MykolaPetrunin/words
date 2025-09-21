-- Add theory fields to questions table
ALTER TABLE "questions" ADD COLUMN "theory_uk" TEXT;
ALTER TABLE "questions" ADD COLUMN "theory_en" TEXT;

-- Change description fields in books table to TEXT type
ALTER TABLE "books" ALTER COLUMN "description_uk" TYPE TEXT;
ALTER TABLE "books" ALTER COLUMN "description_en" TYPE TEXT;

-- Change description fields in subjects table to TEXT type
ALTER TABLE "subjects" ALTER COLUMN "description_uk" TYPE TEXT;
ALTER TABLE "subjects" ALTER COLUMN "description_en" TYPE TEXT;

-- Add wrong answer theory fields to answers table
ALTER TABLE "answers" ADD COLUMN "wrong_answer_theory_uk" TEXT;
ALTER TABLE "answers" ADD COLUMN "wrong_answer_theory_en" TEXT;
