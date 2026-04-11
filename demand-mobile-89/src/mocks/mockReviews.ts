export interface CustomerReview {
    id: string;
    rating: number;
    review_text: string;
    customer_name: string;
    customer_location: string;
    created_at: string;
}

export const MOCK_REVIEWS: CustomerReview[] = [
    {
        id: 'r1',
        rating: 5,
        review_text: "Absolutely fantastic service! Alex was punctual, professional, and fixed our leaking sink in no time. Highly recommended!",
        customer_name: "Emily Watson",
        customer_location: "San Francisco, CA",
        created_at: new Date().toISOString()
    },
    {
        id: 'r2',
        rating: 5,
        review_text: "Sarah did an amazing job with our home wiring. Very clear communication and transparent pricing. Will definitely hire again.",
        customer_name: "James Chen",
        customer_location: "Oakland, CA",
        created_at: new Date().toISOString()
    },
    {
        id: 'r3',
        rating: 4,
        review_text: "Marcus was very helpful with our deck repair. Great quality work, though it took a bit longer than expected. Overall very satisfied.",
        customer_name: "Michael Ross",
        customer_location: "Palo Alto, CA",
        created_at: new Date().toISOString()
    },
    {
        id: 'r4',
        rating: 5,
        review_text: "The easiest way to find a pro! I posted my job and had 3 quotes within an hour. The pro I chose was excellent.",
        customer_name: "David Miller",
        customer_location: "San Jose, CA",
        created_at: new Date().toISOString()
    }
];
