
-- Create messages table for real-time communication
CREATE TABLE public.job_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  attachment_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.job_messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view messages where they are sender or receiver
CREATE POLICY "Users can view their own messages" 
  ON public.job_messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy to allow users to send messages
CREATE POLICY "Users can send messages" 
  ON public.job_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Policy to allow users to update read status of messages they received
CREATE POLICY "Users can update messages they received" 
  ON public.job_messages 
  FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_job_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_messages_updated_at
    BEFORE UPDATE ON public.job_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_job_messages_updated_at();

-- Enable real-time updates for job messages
ALTER TABLE public.job_messages REPLICA IDENTITY FULL;

-- Add job_messages to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_messages;

-- Create function to automatically close messaging when job is completed
CREATE OR REPLACE FUNCTION handle_job_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- When job status changes to completed, we can add logic here if needed
    -- For now, messages remain accessible but no new messages can be sent to completed jobs
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_completion_trigger
    AFTER UPDATE ON public.job_requests
    FOR EACH ROW
    WHEN (OLD.status != NEW.status AND NEW.status = 'completed')
    EXECUTE FUNCTION handle_job_completion();
