// src/services/businessService.ts
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { uploadImage } from '../firebase';
import { BusinessRegistrationData } from '../types/business';

export const registerBusiness = async (formData: BusinessRegistrationData) => {
  try {
    // Create Firebase auth user (v9+ syntax)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    const user = userCredential.user;

    // Upload logo if provided
    let logoUrl = '';
    if (formData.logo) {
      const result = await uploadImage(formData.logo, `business-logos/${user.uid}`);
      if (result.error) {
        throw new Error(result.error);
      }
      logoUrl = result.url || '';
    }

    // Create business document in Firestore (v9+ syntax)
    const businessRef = doc(collection(db, 'businesses'));
    const businessId = businessRef.id;

    const businessData = {
      id: businessId,
      storeName: formData.storeName,
      accountManager: formData.accountManager,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        colonia: formData.colonia,
        municipality: formData.municipality,
        postalCode: formData.postalCode,
        state: formData.state
      },
      logoUrl: logoUrl,
      operatingHours: formData.operatingHours,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
      userId: user.uid
    };

    await setDoc(businessRef, businessData);

    // Update user profile with business ID and role
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      role: 'admin',
      businessId: businessId,
      createdAt: Timestamp.now()
    });

    // Send email verification (v9+ syntax)
    await sendEmailVerification(user);

    return {
      user: {
        uid: user.uid,
        email: user.email || '',
        role: 'admin' as const,
        businessId
      },
      businessId
    };
  } catch (error) {
    console.error('Error registering business:', error);
    throw error;
  }
};