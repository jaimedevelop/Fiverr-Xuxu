// src/firebase/storage.ts
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from './config';

// Upload single image with better error handling
export const uploadImage = async (file: File, path: string, onProgress: ((progress: number) => void) | null = null) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Supported types: ${validTypes.join(', ')}`);
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 5MB`);
    }

    const storageRef = ref(storage, path);
    
    if (onProgress) {
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise<{ url: string; error: null } | { url: null; error: string }>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress.toFixed(2)}%`);
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject({ url: null, error: error.message });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Upload successful, URL:', downloadURL);
              resolve({ url: downloadURL, error: null });
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject({ url: null, error: (error as Error).message });
            }
          }
        );
      });
    } else {
      // Simple upload without progress
      console.log('Starting simple upload for file:', file.name);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Simple upload successful, URL:', downloadURL);
      return { url: downloadURL, error: null };
    }
  } catch (error) {
    console.error('Upload failed:', error);
    return { url: null, error: (error as Error).message };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: File[], 
  basePath: string, 
  onProgress: ((progress: number) => void) | null = null
) => {
  try {
    if (!files || files.length === 0) {
      return { urls: [], errors: ['No files provided'] };
    }

    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return uploadImage(file, path, onProgress);
    });
    
    const results = await Promise.all(uploadPromises);
    const urls: string[] = [];
    const errors: string[] = [];
    
    results.forEach((result, index) => {
      if (result.error) {
        errors.push(`File ${index + 1}: ${result.error}`);
      } else if (result.url) {
        urls.push(result.url);
      }
    });
    
    return {
      urls,
      errors: errors.length > 0 ? errors : null
    };
  } catch (error) {
    console.error('Multiple upload failed:', error);
    return { urls: [], errors: [(error as Error).message] };
  }
};

// Delete image with better error handling
export const deleteImage = async (imageUrl: string) => {
  try {
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    // Extract the path from the URL if it's a full Firebase Storage URL
    let imagePath = imageUrl;
    if (imageUrl.includes('firebase')) {
      // Extract path from Firebase Storage URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      if (pathMatch) {
        imagePath = decodeURIComponent(pathMatch[1]);
      }
    }

    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log('Image deleted successfully:', imagePath);
    return { error: null };
  } catch (error) {
    console.error('Delete failed:', error);
    return { error: (error as Error).message };
  }
};

// Delete multiple images
export const deleteMultipleImages = async (imageUrls: string[]) => {
  try {
    if (!imageUrls || imageUrls.length === 0) {
      return { errors: null };
    }

    const deletePromises = imageUrls.map(url => deleteImage(url));
    const results = await Promise.all(deletePromises);
    
    const errors = results
      .filter(result => result.error)
      .map(result => result.error as string);
    
    return { errors: errors.length > 0 ? errors : null };
  } catch (error) {
    console.error('Multiple delete failed:', error);
    return { errors: [(error as Error).message] };
  }
};

// List all files in a directory
export const listFiles = async (path: string) => {
  try {
    const listRef = ref(storage, path);
    const result = await listAll(listRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        try {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          };
        } catch (error) {
          console.error(`Failed to get URL for ${itemRef.name}:`, error);
          return null;
        }
      })
    );
    
    // Filter out failed items
    const validFiles = files.filter(file => file !== null);
    
    return { files: validFiles, error: null };
  } catch (error) {
    console.error('List files failed:', error);
    return { files: [], error: (error as Error).message };
  }
};

// Utility function to generate unique file path
export const generateFilePath = (folder: string, filename: string, userId: string | null = null): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2);
  const userPrefix = userId ? `${userId}_` : '';
  
  // Clean filename to prevent issues
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${folder}/${userPrefix}${timestamp}_${randomId}_${cleanFilename}`;
};

// Pastry image upload helper with better path generation
export const uploadPastryImage = async (
  file: File, 
  pastryId: string, 
  onProgress: ((progress: number) => void) | null = null
) => {
  const path = generateFilePath('pastries', file.name, pastryId);
  console.log('Uploading pastry image to path:', path);
  return await uploadImage(file, path, onProgress);
};

// User profile picture upload helper
export const uploadProfilePicture = async (
  file: File, 
  userId: string, 
  onProgress: ((progress: number) => void) | null = null
) => {
  const path = generateFilePath('profiles', file.name, userId);
  console.log('Uploading profile picture to path:', path);
  return await uploadImage(file, path, onProgress);
};

// Business logo upload helper
export const uploadBusinessLogo = async (
  file: File, 
  businessId: string, 
  onProgress: ((progress: number) => void) | null = null
) => {
  const path = generateFilePath('business-logos', file.name, businessId);
  console.log('Uploading business logo to path:', path);
  return await uploadImage(file, path, onProgress);
};

// Utility function to check if URL is accessible
export const checkImageAccessibility = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl) return false;
    
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Image accessibility check failed:', error);
    return false;
  }
};

// Utility function to validate image URL format
export const isValidFirebaseStorageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if it's a Firebase Storage URL
  const firebaseStoragePattern = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^\/]+\/o\/[^?]+\?/;
  return firebaseStoragePattern.test(url);
};

// Helper function to optimize image for web display
export const optimizeImageForWeb = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 800px width/height while maintaining aspect ratio)
      const maxSize = 800;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        'image/jpeg',
        0.85 // 85% quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};