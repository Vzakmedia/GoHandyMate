
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  userRole: string;
}

export interface HandymanFormData {
  ssn: string;
  validIdFile: File | null;
  experienceYears: string;
  skills: string[];
  newSkill: string;
  hourlyRate: string;
  bio: string;
}

export interface ContractorFormData {
  ein: string;
  businessName: string;
  licenseNumber: string;
  licenseFile: File | null;
  insuranceFile: File | null;
  businessDescription: string;
  servicesOffered: string[];
  newService: string;
  website: string;
}
