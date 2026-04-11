
-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the monthly job reset to run on the 1st of every month at midnight UTC
SELECT cron.schedule(
  'monthly-job-reset',
  '0 0 1 * *', -- At 00:00 on day-of-month 1
  $$
  SELECT
    net.http_post(
        url:='https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/reset-monthly-jobs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGNxdmN1em1taXJ1cWNzc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDU5NjcsImV4cCI6MjA2NjE4MTk2N30.G7BnxSnKEC7mDYEltnyFvntdpAID5AEGkdwFu8FfAyE"}'::jsonb,
        body:='{"trigger": "cron", "date": "' || now() || '"}'::jsonb
    ) as request_id;
  $$
);

-- Create a table to log cron job executions for monitoring
CREATE TABLE IF NOT EXISTS public.cron_job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  execution_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on cron job logs
ALTER TABLE public.cron_job_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view cron logs
CREATE POLICY "Admins can view cron logs" ON public.cron_job_logs
  FOR SELECT USING (true); -- Will be restricted to admin users once admin system is built

-- Insert a test log entry to verify the table works
INSERT INTO public.cron_job_logs (job_name, status, details) 
VALUES ('monthly-job-reset', 'scheduled', '{"message": "CRON job scheduled successfully"}');
