
import { Job } from "@/types/job";

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Fix leaky faucet",
    description: "Kitchen faucet has been dripping for a week",
    location: "123 Main St, Downtown",
    price: 85,
    status: 'in_progress',
    scheduledDate: "2024-01-15 14:00",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1 555-0123",
    estimatedDuration: "1-2 hours"
  },
  {
    id: "2",
    title: "Install ceiling fan",
    description: "Replace old light fixture with new ceiling fan",
    location: "456 Oak Ave, Midtown",
    price: 120,
    status: 'pending',
    scheduledDate: "2024-01-16 10:00",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    customerPhone: "+1 555-0456",
    estimatedDuration: "2-3 hours"
  },
  {
    id: "3",
    title: "Patch drywall",
    description: "Small hole repair in living room wall",
    location: "789 Pine St, Uptown",
    price: 95,
    status: 'completed',
    scheduledDate: "2024-01-14 09:00",
    customerName: "Mike Davis",
    customerEmail: "mike.davis@email.com",
    customerPhone: "+1 555-0789",
    estimatedDuration: "1 hour"
  },
  {
    id: "4",
    title: "Tile repair",
    description: "Replace broken bathroom tiles",
    location: "321 Elm St, Westside",
    price: 150,
    status: 'cancelled',
    scheduledDate: "2024-01-13 15:00",
    customerName: "Lisa Wilson",
    customerEmail: "lisa.wilson@email.com",
    customerPhone: "+1 555-0321",
    estimatedDuration: "3-4 hours"
  },
  {
    id: "5",
    title: "Door lock replacement",
    description: "Replace front door lock mechanism",
    location: "654 Maple Dr, Eastside",
    price: 110,
    status: 'new_request',
    scheduledDate: "2024-01-17 11:00",
    customerName: "Robert Brown",
    customerEmail: "robert.brown@email.com",
    customerPhone: "+1 555-0654",
    estimatedDuration: "1-2 hours"
  }
];
