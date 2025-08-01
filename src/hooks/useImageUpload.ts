import { useState } from 'react';
import { uploadImage } from '../firebase/storage'; // Changed to named import

export const useImageUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadImageHandler = async (file: File, path: string): Promise<string> => { // Renamed to avoid conflict
    setIsLoading(true);
    setError(null);
    setProgress(0);
    try {
      const result = await uploadImage(file, path, (progress) => {
        setProgress(progress);
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.url;
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
      throw err;
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return {
    isLoading,
    error,
    progress,
    uploadImage: uploadImageHandler // Renamed to avoid conflict
  };
};