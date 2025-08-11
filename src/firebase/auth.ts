// src/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from './config';

// Define return types for our functions
interface AuthResult {
  user: FirebaseUser | null;
  error: string | null;
}

interface UserProfileResult {
  data: DocumentData | null;
  error: string | null;
}

// Register new user
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    if (name) {
      await updateProfile(user, {
        displayName: name
      });
    }
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name || '',
      email: user.email,
      phone: '',
      role: 'user', // Default role for new users
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign in user
export const signInUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign out user
export const signOutUser = async (): Promise<{ error: string | null }> => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get user profile data
export const getUserProfile = async (uid: string): Promise<UserProfileResult> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    } else {
      return { data: null, error: 'User profile not found' };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};