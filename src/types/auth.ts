// src/types/auth.ts
import User from './user';

export default interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthResult {
  user: {
    uid: string;
    email: string | null;
  };
  error?: string;
}