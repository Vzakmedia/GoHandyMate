-- Fix Supabase warnings migration
-- This addresses common issues that cause warnings in Supabase

-- 1. Fix functions with mutable search_path issues
CREATE OR REPLACE FUNCTION public.maintain_job_request_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    IF NEW.updated_at < now() - interval '30 days' THEN
        NEW.status = 'completed';
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_api_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    INSERT INTO public.api_sync_logs (sync_type, operation, status, created_at)
    VALUES (NEW.sync_type, 'insert', 'pending', now());
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_on_new_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    INSERT INTO notifications (recipient_role, job_id, message, created_at)
    VALUES (
        'handyman',
        NEW.id,
        CONCAT('New ', NEW.job_type, ' job posted for unit ID ', NEW.unit_id),
        NOW()
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_location_settings_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_jobs_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    IF OLD.assigned_to_user_id IS NULL AND NEW.assigned_to_user_id IS NOT NULL THEN
        UPDATE public.profiles 
        SET jobs_this_month = jobs_this_month + 1
        WHERE id = NEW.assigned_to_user_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_handyman_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_error()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RETURN NULL;
END;
$$;

-- 2. Add missing triggers that functions reference
CREATE TRIGGER IF NOT EXISTS job_request_status_trigger
    BEFORE UPDATE ON public.job_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.maintain_job_request_status();

CREATE TRIGGER IF NOT EXISTS location_settings_update_trigger
    BEFORE UPDATE ON public.location_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_location_settings_timestamp();

CREATE TRIGGER IF NOT EXISTS handyman_update_trigger
    BEFORE UPDATE ON public.handyman
    FOR EACH ROW
    EXECUTE FUNCTION public.update_handyman_timestamp();

CREATE TRIGGER IF NOT EXISTS job_requests_increment_trigger
    AFTER UPDATE ON public.job_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_jobs_count();

-- 3. Add missing triggers for timestamp updates
CREATE TRIGGER IF NOT EXISTS update_api_sync_config_updated_at
    BEFORE UPDATE ON public.api_sync_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_business_profiles_updated_at
    BEFORE UPDATE ON public.business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_quote_requests_updated_at
    BEFORE UPDATE ON public.quote_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_quote_submissions_updated_at
    BEFORE UPDATE ON public.quote_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_escrow_payments_updated_at
    BEFORE UPDATE ON public.escrow_payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_provider_payouts_updated_at
    BEFORE UPDATE ON public.provider_payouts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Add missing triggers for specific tables
CREATE TRIGGER IF NOT EXISTS update_handyman_work_areas_updated_at
    BEFORE UPDATE ON public.handyman_work_areas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_handyman_work_settings_updated_at
    BEFORE UPDATE ON public.handyman_work_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_handyman_skill_rates_updated_at
    BEFORE UPDATE ON public.handyman_skill_rates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_handyman_service_pricing_updated_at
    BEFORE UPDATE ON public.handyman_service_pricing
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_handyman_availability_slots_updated_at
    BEFORE UPDATE ON public.handyman_availability_slots
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Add trigger for advertisement interactions
CREATE TRIGGER IF NOT EXISTS update_advertisement_interactions_trigger
    BEFORE UPDATE ON public.advertisement_interactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_advertisement_interactions_updated_at();

-- 6. Fix any missing constraints and indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_job_requests_status ON public.job_requests(status);
CREATE INDEX IF NOT EXISTS idx_job_requests_assigned_to ON public.job_requests(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_status ON public.advertisements(status);
CREATE INDEX IF NOT EXISTS idx_advertisements_user_id ON public.advertisements(user_id);
CREATE INDEX IF NOT EXISTS idx_handyman_locations_user_id ON public.handyman_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_handyman_locations_active ON public.handyman_locations(is_active);

-- 7. Add missing foreign key constraints
ALTER TABLE public.job_requests 
DROP CONSTRAINT IF EXISTS job_requests_customer_id_fkey,
ADD CONSTRAINT job_requests_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.job_requests 
DROP CONSTRAINT IF EXISTS job_requests_assigned_to_user_id_fkey,
ADD CONSTRAINT job_requests_assigned_to_user_id_fkey 
FOREIGN KEY (assigned_to_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.job_messages 
DROP CONSTRAINT IF EXISTS job_messages_sender_id_fkey,
ADD CONSTRAINT job_messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.job_messages 
DROP CONSTRAINT IF EXISTS job_messages_receiver_id_fkey,
ADD CONSTRAINT job_messages_receiver_id_fkey 
FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 8. Ensure proper RLS is enabled on all tables that need it
ALTER TABLE public.cron_job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_sync_config ENABLE ROW LEVEL SECURITY;

-- 9. Add missing table-level comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles table containing additional user information';
COMMENT ON TABLE public.job_requests IS 'Table for managing job requests between customers and service providers';
COMMENT ON TABLE public.advertisements IS 'Table for managing paid advertisements and promotions';
COMMENT ON TABLE public.handyman_locations IS 'Real-time location tracking for handymen';

-- 10. Ensure all enum types are properly defined
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status_enum') THEN
        CREATE TYPE account_status_enum AS ENUM ('pending', 'active', 'suspended', 'rejected');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_status') THEN
        CREATE TYPE chat_status AS ENUM ('waiting', 'active', 'closed');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type') THEN
        CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');
    END IF;
END $$;