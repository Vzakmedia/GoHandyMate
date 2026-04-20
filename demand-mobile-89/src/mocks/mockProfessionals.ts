import { Professional } from '@/types/professional';

export const MOCK_PROFESSIONALS: Professional[] = [
    {
        id: '1',
        full_name: 'Alex Rivera',
        email: 'alex@example.com',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        rating: 4.9,
        reviewCount: 124,
        experienceYears: 8,
        completedJobs: 450,
        isSponsored: true,
        isOnline: true,
        user_role: 'handyman',
        zip_code: '94105',
        subscription_status: 'active',
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        averageRate: 85,
        responseTime: '15 mins',
        service_pricing: [
            { category_id: 'Plumbing', subcategory_id: 'Leak Repair', base_price: 85, is_active: true },
            { category_id: 'Handyman', subcategory_id: 'General Repair', base_price: 65, is_active: true }
        ],
        skill_rates: [
            { skill_name: 'Plumbing', hourly_rate: 85, is_active: true },
            { skill_name: 'Carpentry', hourly_rate: 75, is_active: true }
        ]
    },
    {
        id: '2',
        full_name: 'Sarah Chen',
        email: 'sarah@example.com',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        rating: 4.8,
        reviewCount: 89,
        experienceYears: 5,
        completedJobs: 210,
        isSponsored: false,
        isOnline: true,
        user_role: 'handyman',
        zip_code: '94601',
        subscription_status: 'active',
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        averageRate: 120,
        responseTime: '30 mins',
        service_pricing: [
            { category_id: 'Electrical', subcategory_id: 'Wiring', base_price: 120, is_active: true }
        ],
        skill_rates: [
            { skill_name: 'Electrical', hourly_rate: 120, is_active: true }
        ]
    },
    {
        id: '3',
        full_name: 'Marcus Thorne',
        email: 'marcus@example.com',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        rating: 5.0,
        reviewCount: 56,
        experienceYears: 12,
        completedJobs: 340,
        isSponsored: true,
        isOnline: false,
        user_role: 'handyman',
        zip_code: '94025',
        subscription_status: 'active',
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        averageRate: 95,
        responseTime: '45 mins',
        service_pricing: [
            { category_id: 'Carpentry', subcategory_id: 'Deck Building', base_price: 95, is_active: true }
        ],
        skill_rates: [
            { skill_name: 'Carpentry', hourly_rate: 95, is_active: true }
        ]
    }
];
