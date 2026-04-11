-- Clean up duplicate business profiles, keeping only the most recent one for each user
WITH latest_profiles AS (
  SELECT DISTINCT ON (user_id) 
    id, user_id, updated_at
  FROM business_profiles 
  WHERE user_id = '1a572e74-d905-48c6-a681-07271b031e20'
  ORDER BY user_id, updated_at DESC
)
DELETE FROM business_profiles 
WHERE user_id = '1a572e74-d905-48c6-a681-07271b031e20'
  AND id NOT IN (SELECT id FROM latest_profiles);