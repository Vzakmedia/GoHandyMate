
-- Update the handle_new_handyman function to work with service role calls
CREATE OR REPLACE FUNCTION public.handle_new_handyman()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If user_id is already set (from service role call), trust it
  IF NEW.user_id IS NOT NULL THEN
    -- Verify the user has handyman role
    IF EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = NEW.user_id AND user_role = 'handyman'
    ) THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'Only users with handyman role can create handyman profiles';
    END IF;
  END IF;
  
  -- For regular calls, check auth.uid()
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'handyman'
  ) THEN
    RAISE EXCEPTION 'Only users with handyman role can create handyman profiles';
  END IF;
  
  -- Set user_id to current user if not already set
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$;
