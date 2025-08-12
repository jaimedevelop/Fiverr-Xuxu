// src/types/business.ts - Updated with Order Settings
export interface DayHours {
  isOpen: boolean;
  openTime: string; // Format: "HH:MM"
  closeTime: string; // Format: "HH:MM"
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

// NEW: Order scheduling settings
export interface OrderSettings {
  cutoffTime: string; // e.g., "17:00" for 5pm
  morningOrderDeadline: string; // e.g., "12:00" for 12pm
  sameDayCompletionHour: string; // e.g., "15:00" for 3pm
  enableOrderQueue: boolean;
  defaultQueueDelay: number; // in minutes
  minOrderAdvanceTime: number; // minimum minutes ahead for scheduling
}

// Default order settings for new businesses
export const DEFAULT_ORDER_SETTINGS: OrderSettings = {
  cutoffTime: "17:00",
  morningOrderDeadline: "12:00",
  sameDayCompletionHour: "15:00",
  enableOrderQueue: true,
  defaultQueueDelay: 60,
  minOrderAdvanceTime: 30
};

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
  orderSettings?: OrderSettings; // NEW: Optional during registration
  
  // Terms
  acceptTerms: boolean;
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
  orderSettings: OrderSettings; // NEW: Required for existing businesses
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVerified?: boolean;
  rating?: number;
  totalOrders?: number;
}

// Helper function to create a new business with default settings
export const createBusinessWithDefaults = (registrationData: BusinessRegistrationData): Omit<Business, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    storeName: registrationData.storeName,
    accountManager: registrationData.accountManager,
    email: registrationData.email,
    phone: registrationData.phone,
    address: {
      street: registrationData.street,
      colonia: registrationData.colonia,
      municipality: registrationData.municipality,
      postalCode: registrationData.postalCode,
      state: registrationData.state,
    },
    logoUrl: registrationData.logoUrl,
    operatingHours: registrationData.operatingHours,
    orderSettings: registrationData.orderSettings || DEFAULT_ORDER_SETTINGS, // Use provided or default
    isActive: true,
    isVerified: false,
    rating: 0,
    totalOrders: 0
  };
};