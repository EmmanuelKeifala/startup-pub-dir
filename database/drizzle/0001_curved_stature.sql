-- Either drop the existing column first
ALTER TABLE review_replies DROP COLUMN IF EXISTS like_count;

-- Then add your new column
ALTER TABLE review_replies ADD COLUMN like_count INTEGER DEFAULT 0;