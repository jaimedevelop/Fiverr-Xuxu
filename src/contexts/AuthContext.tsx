// src/contexts/AuthContext.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Added setDoc import
import { auth, db } from '../firebase/config';
import { signInUser, signOutUser, onAuthStateChange, registerUser } from '../firebase/auth'; // Added registerUser import
import { AuthUser, AuthState } from '../types/auth';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>; // Added register function
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

  // Helper function to fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<AuthUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: uid,
          email: userData.email || '',
          name: userData.name || '', // Added name field
          role: userData.role || 'user',
          businessId: userData.businessId || ''
        };
      } else {
        // If no user document exists, create a default user profile
        return {
          uid: uid,
          email: '',
          name: '', // Added name field
          role: 'user',
          businessId: ''
        };
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          setAuthState(prev => ({ ...prev, loading: true }));
          
          // Fetch user data from Firestore
          const userData = await fetchUserData(firebaseUser.uid);
          
          if (userData) {
            setAuthState({
              user: {
                ...userData,
                email: userData.email || firebaseUser.email || '' // Use Firebase email as fallback
              },
              loading: false,
              error: null
            });
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAuthState({
            user: null,
            loading: false,
            error: (error as Error).message
          });
        }
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const result = await signInUser(email, password);
      
      if (result.error) {
        throw new Error(result.error);
      }
      // Fetch user role and data from Firestore
      const userData = await fetchUserData(result.user.uid);
      
      if (userData) {
        setAuthState({
          user: {
            ...userData,
            email: userData.email || result.user.email || ''
          },
          loading: false,
          error: null
        });
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  // Added handleRegister function
  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const result = await registerUser(name, email, password);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // The user document is already created in the registerUser function
      // Fetch user data from Firestore
      const userData = await fetchUserData(result.user.uid);
      
      if (userData) {
        setAuthState({
          user: {
            ...userData,
            email: userData.email || result.user.email || ''
          },
          loading: false,
          error: null
        });
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error: any) {
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
      setAuthState(prev => ({ ...prev, loading: true }));
      const result = await signOutUser();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    } catch (error: any) {
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
    register: handleRegister // Added register function to context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};