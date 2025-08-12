// src/types/user.ts
export default interface User {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee' | 'user';
  businessId: string;
  createdAt: Date;
  lastLogin?: Date;
  profileImageUrl?: string;
  phone?: string;
  // Additional profile fields
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  preferences?: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}