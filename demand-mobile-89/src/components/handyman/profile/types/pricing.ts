
export interface ServicePricing {
  categoryId: string;
  subcategoryId?: string;
  basePrice: number;
  isActive: boolean;
  customPrice?: number;
  sameDayMultiplier: number;
  emergencyMultiplier: number;
}
