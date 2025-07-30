// src/firebase/storage.js
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from './config';

// Upload single image
export const uploadImage = async (file, path, onProgress = null) => {
  try {
    const storageRef = ref(storage, path);
    
    if (onProgress) {
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            reject({ url: null, error: error.message });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ url: downloadURL, error: null });
            } catch (error) {
              reject({ url: null, error: error.message });
            }
          }
        );
      });
    } else {
      // Simple upload without progress
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { url: downloadURL, error: null };
    }
  } catch (error) {
    return { url: null, error: error.message };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, basePath, onProgress = null) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return uploadImage(file, path, onProgress);
    });
    
    const results = await Promise.all(uploadPromises);
    const urls = [];
    const errors = [];
    
    results.forEach((result, index) => {
      if (result.error) {
        errors.push(`File ${index}: ${result.error}`);
      } else {
        urls.push(result.url);
      }
    });
    
    return {
      urls,
      errors: errors.length > 0 ? errors : null
    };
  } catch (error) {
    return { urls: [], errors: [error.message] };
  }
};

// Delete image
export const deleteImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Delete multiple images
export const deleteMultipleImages = async (imageUrls) => {
  try {
    const deletePromises = imageUrls.map(url => deleteImage(url));
    const results = await Promise.all(deletePromises);
    
    const errors = results
      .filter(result => result.error)
      .map(result => result.error);
    
    return { errors: errors.length > 0 ? errors : null };
  } catch (error) {
    return { errors: [error.message] };
  }
};

// List all files in a directory
export const listFiles = async (path) => {
  try {
    const listRef = ref(storage, path);
    const result = await listAll(listRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url
        };
      })
    );
    
    return { files, error: null };
  } catch (error) {
    return { files: [], error: error.message };
  }
};

// Utility function to generate unique file path
export const generateFilePath = (folder, filename, userId = null) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2);
  const userPrefix = userId ? `${userId}_` : '';
  
  return `${folder}/${userPrefix}${timestamp}_${randomId}_${filename}`;
};

// Pastry image upload helper
export const uploadPastryImage = async (file, pastryId, onProgress = null) => {
  const path = generateFilePath('pastries', file.name, pastryId);
  return await uploadImage(file, path, onProgress);
};

// User profile picture upload helper
export const uploadProfilePicture = async (file, userId, onProgress = null) => {
  const path = generateFilePath('profiles', file.name, userId);
  return await uploadImage(file, path, onProgress);
};