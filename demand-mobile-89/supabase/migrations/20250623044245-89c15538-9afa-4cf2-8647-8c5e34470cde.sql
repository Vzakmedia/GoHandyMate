
-- Create a table to track API sync status and logs
CREATE TABLE public.api_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL, -- 'job_requests', 'contractor_data', etc.
  operation TEXT NOT NULL, -- 'create', 'update', 'delete', 'full_sync'
  local_record_id UUID,
  external_api_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed', 'retrying'
  error_message TEXT,
  request_payload JSONB,
  response_data JSONB,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index for efficient querying
CREATE INDEX idx_api_sync_logs_status ON public.api_sync_logs(status);
CREATE INDEX idx_api_sync_logs_sync_type ON public.api_sync_logs(sync_type);
CREATE INDEX idx_api_sync_logs_created_at ON public.api_sync_logs(created_at);

-- Create a table to store API sync configuration
CREATE TABLE public.api_sync_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL UNIQUE,
  api_endpoint TEXT NOT NULL,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_interval_minutes INTEGER DEFAULT 15,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default sync configurations
INSERT INTO public.api_sync_config (sync_type, api_endpoint, sync_interval_minutes) VALUES
('job_requests', '/api/jobs', 5),
('contractor_data', '/api/contractors', 15);

-- Create a function to trigger API sync when data changes
CREATE OR REPLACE FUNCTION public.trigger_api_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the change for sync processing
  INSERT INTO public.api_sync_logs (sync_type, operation, local_record_id, request_payload)
  VALUES (
    TG_ARGV[0], -- sync_type passed as argument
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'create'
      WHEN TG_OP = 'UPDATE' THEN 'update'
      WHEN TG_OP = 'DELETE' THEN 'delete'
    END,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE to_jsonb(NEW)
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for the sync tables
ALTER TABLE public.api_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_sync_config ENABLE ROW LEVEL SECURITY;

-- Allow service role to access sync tables (for Edge Functions)
CREATE POLICY "Service role can manage sync logs" ON public.api_sync_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage sync config" ON public.api_sync_config
  FOR ALL USING (auth.role() = 'service_role');

-- Enable realtime for sync monitoring
ALTER TABLE public.api_sync_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_sync_logs;
