export interface AuthUser {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  businessId?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}