-- Remove ALL duplicate business profiles, keeping only the most recent one
WITH ranked_profiles AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) as rn
  FROM business_profiles 
  WHERE user_id = '1a572e74-d905-48c6-a681-07271b031e20'
)
DELETE FROM business_profiles 
WHERE id IN (
  SELECT id FROM ranked_profiles WHERE rn > 1
);