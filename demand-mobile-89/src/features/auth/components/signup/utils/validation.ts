
import { SignUpFormData, HandymanFormData, ContractorFormData } from '../types';

export const validateBasicForm = (data: SignUpFormData): string | null => {
  if (!data.email || !data.password || !data.confirmPassword || !data.fullName || !data.phone || !data.userRole) {
    return "Please fill in all required fields";
  }

  if (data.password !== data.confirmPassword) {
    return "Passwords don't match";
  }

  if (data.password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  return null;
};

export const validateHandymanForm = (data: HandymanFormData): string | null => {
  if (!data.ssn || !data.validIdFile) {
    return "SSN and valid ID are required for handymen";
  }
  
  if (data.ssn.replace(/\D/g, '').length !== 9) {
    return "Please enter a valid 9-digit SSN";
  }

  return null;
};

export const validateContractorForm = (data: ContractorFormData): string | null => {
  if (!data.ein || !data.businessName) {
    return "EIN and business name are required for contractors";
  }
  
  if (data.ein.replace(/\D/g, '').length !== 9) {
    return "Please enter a valid 9-digit EIN";
  }

  return null;
};
