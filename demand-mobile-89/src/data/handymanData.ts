
import { HandymanSkill, HandymanCertification, HandymanReview, HandymanStats } from "@/types/handyman";

export const mockHandymanSkills: HandymanSkill[] = [
  { name: "Plumbing", level: "Expert", years: 10, rate: 65 },
  { name: "Electrical", level: "Advanced", years: 8, rate: 70 },
  { name: "Carpentry", level: "Expert", years: 12, rate: 60 },
  { name: "Painting", level: "Intermediate", years: 5, rate: 40 },
  { name: "Drywall", level: "Advanced", years: 7, rate: 50 },
  { name: "Tile Work", level: "Intermediate", years: 4, rate: 55 }
];

export const mockHandymanCertifications: HandymanCertification[] = [
  { name: "EPA 608 Certification", issuer: "EPA", date: "2023" },
  { name: "OSHA 10 Safety", issuer: "OSHA", date: "2023" },
  { name: "Electrical License", issuer: "State of NY", date: "2022" }
];

export const mockHandymanReviews: HandymanReview[] = [
  {
    id: 1,
    customer: "Sarah Johnson",
    rating: 5,
    comment: "Excellent work on fixing my kitchen faucet. Very professional and clean.",
    date: "2 days ago",
    job: "Plumbing repair"
  },
  {
    id: 2,
    customer: "Mike Davis",
    rating: 5,
    comment: "Great job installing the ceiling fan. Fast and efficient service.",
    date: "1 week ago",
    job: "Electrical installation"
  },
  {
    id: 3,
    customer: "Lisa Wilson",
    rating: 4,
    comment: "Good work on the drywall repair. Would recommend.",
    date: "2 weeks ago",
    job: "Drywall repair"
  }
];

export const mockHandymanStats: HandymanStats = {
  totalJobs: 156,
  rating: 4.8,
  responseRate: 95,
  repeatCustomers: 68,
  onTimeRate: 98,
  reviewCount: 156,
  completedJobs: 324
};
