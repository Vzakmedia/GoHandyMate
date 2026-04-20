
import { User } from '@supabase/supabase-js';
import { Profile } from '../types';

export const MOCK_USERS: { user: User; profile: Profile }[] = [
    // ADMIN
    {
        user: { id: 'admin-id', email: 'admin@gohandymate.com', aud: 'authenticated', created_at: new Date().toISOString(), app_metadata: {}, user_metadata: { full_name: 'System Admin' } } as any,
        profile: {
            id: 'admin-id',
            email: 'admin@gohandymate.com',
            full_name: 'System Admin',
            user_role: 'handyman', // Needs to be a valid role, but internal check handles admin status
            account_status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as Profile,
    },
    // HANDYMEN (4)
    {
        user: { id: 'handyman-1', email: 'jack.plumber@example.com', aud: 'authenticated', created_at: new Date().toISOString(), app_metadata: {}, user_metadata: { full_name: 'Jack Thompson' } } as any,
        profile: {
            id: 'handyman-1',
            email: 'jack.plumber@example.com',
            full_name: 'Jack Thompson',
            user_role: 'handyman',
            account_status: 'active',
            phone: '+1 555-0101',
            address: '123 Leak Lane',
            city: 'London',
            zip_code: 'NW1 6XE',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as Profile,
    },
    {
        user: { id: 'handyman-2', email: 'sparky.mike@example.com', aud: 'authenticated', created_at: new Date().toISOString(), app_metadata: {}, user_metadata: { full_name: 'Mike Watson' } } as any,
        profile: {
            id: 'handyman-2',
            email: 'sparky.mike@example.com',
            full_name: 'Mike Watson',
            user_role: 'handyman',
            account_status: 'active',
            phone: '+1 555-0102',
            address: '45 Voltage Ave',
            city: 'Manchester',
            zip_code: 'M1 1AE',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as Profile,
    },
    {
        user: { id: 'handyman-3', email: 'sarah.painter@example.com', aud: 'authenticated', created_at: new Date().toISOString(), app_metadata: {}, user_metadata: { full_name: 'Sarah Collins' } } as any,
        profile: {
            id: 'handyman-3',
            email: 'sarah.painter@example.com',
            full_name: 'Sarah Collins',
            user_role: 'handyman',
            account_status: 'active',
            phone: '+1 555-0103',
            address: '7 Canvas Road',
            city: 'Bristol',
            zip_code: 'BS1 5TY',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as Profile,
    },
    {
        user: { id: 'handyman-4', email: 'bob.builder@example.com', aud: 'authenticated', created_at: new Date().toISOString(), app_metadata: {}, user_metadata: { full_name: 'Bob Richards' } } as any,
        profile: {
            id: 'handyman-4',
            email: 'bob.builder@example.com',
            full_name: 'Bob Richards',
            user_role: 'handyman',
            account_status: 'active',
            phone: '+1 555-0104',
            address: '88 Foundation St',
            city: 'Birmingham',
            zip_code: 'B1 1QU',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as Profile,
    },
    // CUSTOMERS (2)
    {
        user: { id: 'customer-1', email: 'jane.smith@example.com', aud: 'authenticated', created_at: new Date().toISOString(), app_metadata: {}, user_metadata: { full_name: 'Jane Smith' } } as any,
        profile: {
            id: 'customer-1',
            email: 'jane.smith@example.com',
            full_name: 'Jane Smith',
            user_role: 'customer',
            account_status: 'active',
            phone: '+1 555-0401',
            address: '14 Residential St',
            city: 'Newcastle',
            zip_code: 'NE1 1RF',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as Profile,
    },
    {
        user: { id: 'customer-2', email: 'peter.jones@example.com', aud: 'authenticated', created_at: new Date().toISOString(), app_metadata: {}, user_metadata: { full_name: 'Peter Jones' } } as any,
        profile: {
            id: 'customer-2',
            email: 'peter.jones@example.com',
            full_name: 'Peter Jones',
            user_role: 'customer',
            account_status: 'active',
            phone: '+1 555-0402',
            address: '99 Garden Lane',
            city: 'Glasgow',
            zip_code: 'G1 1PA',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as Profile,
    },
];
