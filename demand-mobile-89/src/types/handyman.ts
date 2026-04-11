
export interface HandymanSkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  years: number;
  rate: number;
}

export interface HandymanCertification {
  name: string;
  issuer: string;
  date: string;
}

export interface HandymanReview {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  job: string;
}

export interface HandymanStats {
  totalJobs: number;
  rating: number;
  responseRate: number;
  repeatCustomers: number;
  onTimeRate: number;
  reviewCount: number;
  completedJobs: number;
}

export interface HandymanProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  hourlyRate: number;
  experience: string;
  availability: boolean;
  skills?: HandymanSkill[] | string[];
}
