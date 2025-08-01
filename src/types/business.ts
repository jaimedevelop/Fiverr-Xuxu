export interface BusinessRegistrationData {
  // Business Information
  storeName: string;
  accountManager: string;
  
  // Contact Information
  email: string;
  phone: string;
  
  // Address
  street: string;
  colonia: string;
  municipality: string;
  postalCode: string;
  state: string;
  
  // Password
  password: string;
  confirmPassword: string;
  
  // Optional Information
  logo?: File | null;
  logoUrl?: string;
  operatingHours: OperatingHours;
  
  // Terms
  acceptTerms: boolean;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime: string; // Format: "HH:MM"
  closeTime: string; // Format: "HH:MM"
}

export interface Business {
  id: string;
  storeName: string;
  accountManager: string;
  email: string;
  phone: string;
  address: {
    street: string;
    colonia: string;
    municipality: string;
    postalCode: string;
    state: string;
  };
  logoUrl?: string;
  operatingHours: OperatingHours;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}