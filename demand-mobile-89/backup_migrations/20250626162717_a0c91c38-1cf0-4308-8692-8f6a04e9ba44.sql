
-- Update the quote_submissions table to allow 'completed' and other job statuses
ALTER TABLE quote_submissions DROP CONSTRAINT IF EXISTS quote_submissions_status_check;

-- Add a new constraint that includes all the statuses we need
ALTER TABLE quote_submissions ADD CONSTRAINT quote_submissions_status_check 
CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'));
