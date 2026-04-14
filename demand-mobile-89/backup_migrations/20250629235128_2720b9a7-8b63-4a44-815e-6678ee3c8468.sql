
-- Check if there are any records for this user in the handyman tables
SELECT 'handyman_skill_rates' as table_name, COUNT(*) as count FROM handyman_skill_rates WHERE user_id = '689cb901-2e11-4592-8dac-7e44cd2be72c'
UNION ALL
SELECT 'handyman_service_pricing' as table_name, COUNT(*) as count FROM handyman_service_pricing WHERE user_id = '689cb901-2e11-4592-8dac-7e44cd2be72c'
UNION ALL
SELECT 'handyman_work_areas' as table_name, COUNT(*) as count FROM handyman_work_areas WHERE user_id = '689cb901-2e11-4592-8dac-7e44cd2be72c'
UNION ALL
SELECT 'handyman_work_settings' as table_name, COUNT(*) as count FROM handyman_work_settings WHERE user_id = '689cb901-2e11-4592-8dac-7e44cd2be72c';

-- Also check if the user exists in profiles
SELECT id, full_name, user_role, account_status FROM profiles WHERE id = '689cb901-2e11-4592-8dac-7e44cd2be72c';

-- Check if there's a handyman record
SELECT * FROM handyman WHERE user_id = '689cb901-2e11-4592-8dac-7e44cd2be72c';
