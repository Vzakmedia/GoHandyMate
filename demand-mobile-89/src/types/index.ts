
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'provider' | 'property_manager' | 'franchise_admin';
  avatar?: string;
  phone?: string;
  address?: string;
  verified?: boolean;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  estimatedPrice: number;
  scheduledDate?: Date;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  providerId?: string;
  createdAt: Date;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  licenses: string[];
  services: string[];
  hourlyRate: number;
  availability: string[];
  workingRadius: number;
  location: {
    lat: number;
    lng: number;
  };
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'update' | 'question' | 'recommendation' | 'alert' | 'showcase' | 'poll';
  title: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  location: string;
  createdAt: Date;
  isLiked?: boolean;
}
