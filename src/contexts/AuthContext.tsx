// src/contexts/AuthContext.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { signInUser, signOutUser, onAuthStateChange, registerUser } from '../firebase/auth';
import { AuthState } from '../types/auth';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

useEffect(() => {
  console.log("🔐 AUTH CONTEXT: Setting up auth listener");
  
  const unsubscribe = onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
    console.log("🔐 AUTH STATE CHANGED:");
    console.log("  - Firebase user:", firebaseUser);
    console.log("  - User UID:", firebaseUser?.uid);
    console.log("  - User email:", firebaseUser?.email);
    
    if (firebaseUser) {
      const authUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'user', // Default role, will be updated by UserContext
        businessId: '', // Will be populated by UserContext
        createdAt: new Date()
      };
      
      console.log("  - Setting auth state with default user role:", authUserData);
      
      setAuthState({
        user: authUserData,
        loading: false,
        error: null
      });
    } else {
      console.log("  - No firebase user, clearing auth state");
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    }
  });
  
  return () => {
    console.log("🔐 AUTH CONTEXT: Cleaning up auth listener");
    unsubscribe();
  };
}, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("🔐 AUTH CONTEXT: Login attempt for email:", email);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const result = await signInUser(email, password);
      
      if (result.error) {
        console.log("🔐 AUTH CONTEXT: Login failed:", result.error);
        throw new Error(result.error);
      }
      
      console.log("🔐 AUTH CONTEXT: Login successful, Firebase user:", result.user);
      // AuthContext only handles Firebase Auth success
      // UserContext will handle Firestore user data
      
    } catch (error: any) {
      console.log("🔐 AUTH CONTEXT: Login error:", error.message);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      console.log("🔐 AUTH CONTEXT: Register attempt for:", email);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const result = await registerUser(name, email, password);
      
      if (result.error) {
        console.log("🔐 AUTH CONTEXT: Register failed:", result.error);
        throw new Error(result.error);
      }
      
      console.log("🔐 AUTH CONTEXT: Register successful");
      // AuthContext only handles Firebase Auth success
      // UserContext will handle Firestore user data
      
    } catch (error: any) {
      console.log("🔐 AUTH CONTEXT: Register error:", error.message);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🔐 AUTH CONTEXT: Logout attempt");
      setAuthState(prev => ({ ...prev, loading: true }));
      const result = await signOutUser();
      
      if (result.error) {
        console.log("🔐 AUTH CONTEXT: Logout failed:", result.error);
        throw new Error(result.error);
      }
      
      console.log("🔐 AUTH CONTEXT: Logout successful");
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.log("🔐 AUTH CONTEXT: Logout error:", error.message);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const value = {
    authState,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};