// Shared types for handyman skills and pricing components

export interface SkillData {
  categoryId: string;
  skillName: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  isActive: boolean;
}

export interface ServicePricingData {
  categoryId: string;
  subcategoryId?: string;
  basePrice: number;
  customPrice?: number;
  isActive: boolean;
  sameDayMultiplier: number;
  emergencyMultiplier: number;
}

export interface SkillsAndPricingState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lastSyncTime: Date | null;
  setLastSyncTime: (time: Date | null) => void;
  syncError: string | null;
  setSyncError: (error: string | null) => void;
  syncingToCustomer: boolean;
  setSyncingToCustomer: (syncing: boolean) => void;
}

export interface ProcessedSkillsData {
  activeSkills: SkillData[];
  activeCategoryServices: ServicePricingData[];
  allActiveServices: ServicePricingData[];
  skillsByLevel: Record<string, number>;
}