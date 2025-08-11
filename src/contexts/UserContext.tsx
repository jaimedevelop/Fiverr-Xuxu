// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import User from '../types/user';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { authState } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<User | null> => {
    try {
      console.log("📄 FETCHING USER DATA from Firestore for UID:", uid);
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("  - User document found:", userData);
        console.log("  - User role:", userData.role);
        
        const user = {
          uid: uid,
          email: userData.email || '',
          name: userData.name || '',
          role: userData.role || 'user',
          businessId: userData.businessId || '',
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLogin: userData.lastLogin?.toDate(),
          profileImageUrl: userData.profileImageUrl,
          phone: userData.phone,
          preferences: userData.preferences
        };
        
        console.log("  - Returning user object:", user);
        return user;
      } else {
        console.log("  - No user document found, creating new one");
        const newUserData: User = {
          uid: uid,
          email: authState.user?.email || '',
          name: authState.user?.name || '',
          role: 'user',
          businessId: '',
          createdAt: new Date()
        };
        
        console.log("  - Creating user document:", newUserData);
        await setDoc(doc(db, 'users', uid), {
          ...newUserData,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        return newUserData;
      }
    } catch (error) {
      console.error('❌ Error fetching user data from Firestore:', error);
      throw error;
    }
  };

  // Effect to handle auth state changes
  useEffect(() => {
    const loadUserData = async () => {
      console.log("👤 USER CONTEXT: Loading user data");
      console.log("  - Auth user:", authState.user);
      console.log("  - Auth loading:", authState.loading);
      
      // If no authenticated user, clear user data
      if (!authState.user) {
        console.log("  - No auth user, clearing user data");
        setUser(null);
        setLoading(false);
        setError(null);
        return;
      }

      // If auth is still loading, don't fetch user data yet
      if (authState.loading) {
        console.log("  - Auth still loading, waiting...");
        return;
      }

      console.log("  - Fetching user data from Firestore for UID:", authState.user.uid);
      setLoading(true);
      setError(null);

      try {
        const userData = await fetchUserData(authState.user.uid);
        console.log("  - Firestore user data loaded:", userData);
        console.log("  - User role from Firestore:", userData?.role);
        setUser(userData);
      } catch (err: any) {
        console.error("  - Error loading user data:", err);
        setError('Failed to load user profile: ' + err.message);
      } finally {
        console.log("  - User loading complete");
        setLoading(false);
      }
    };

    loadUserData();
  }, [authState.user, authState.loading]);

  const updateUser = async (userData: Partial<User>) => {
    if (!authState.user || !user) {
      throw new Error('No authenticated user');
    }

    console.log("👤 USER CONTEXT: Updating user data:", userData);
    setLoading(true);
    setError(null);

    try {
      // Update user data in Firestore
      const updateData = {
        ...userData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, 'users', authState.user.uid), updateData);
      console.log("  - User data updated in Firestore");
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);
      console.log("  - Local user state updated");
    } catch (err: any) {
      console.error("  - Error updating user:", err);
      setError('Failed to update user profile: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!authState.user) {
      console.log("👤 USER CONTEXT: No auth user, cannot refresh");
      return;
    }

    console.log("👤 USER CONTEXT: Refreshing user data");
    setLoading(true);
    setError(null);

    try {
      const userData = await fetchUserData(authState.user.uid);
      console.log("  - User data refreshed:", userData);
      setUser(userData);
    } catch (err: any) {
      console.error("  - Error refreshing user data:", err);
      setError('Failed to refresh user data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    updateUser,
    refreshUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};