// src/types/user.ts
export default interface User {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  businessId: string;
  createdAt: Date;
  lastLogin?: Date;
  profileImageUrl?: string;
  phone?: string;
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