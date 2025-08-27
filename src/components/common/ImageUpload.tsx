// src/components/common/ImageUpload.tsx
import React, { useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import { getButtonClass } from '../../utils/themeHelper';

interface ImageUploadProps {
  onImageChange: (file: File | null, url: string) => void;
  currentImageUrl?: string;
}

const ImageUpload = ({ onImageChange, currentImageUrl }: ImageUploadProps) => {
  const { uploadImage, isLoading, error, progress } = useImageUpload();
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 5MB.');
        return;
      }
      
      try {
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // Upload to Firebase Storage
        const downloadUrl = await uploadImage(file, 'business-logos');
        
        // Pass file and URL to parent component
        onImageChange(file, downloadUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error al subir la imagen. Inténtalo de nuevo.');
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Image Preview Area */}
      <div className="relative">
        {previewUrl ? (
          <div className="relative group">
            <img 
              src={previewUrl} 
              alt="Logo preview" 
              className="w-32 h-32 object-contain card-base p-2 transition-transform duration-200 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-1.5 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 hover:border-saffron-400 hover:bg-gradient-to-br hover:from-saffron-50 hover:to-orange-50 transition-all duration-300 cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Loading Progress */}
      {isLoading && (
        <div className="w-full max-w-xs space-y-2">
          <div className="text-xs text-gray-600 font-medium">Subiendo: {progress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-saffron h-2 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {/* Upload Button */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className={`${getButtonClass('outline')} cursor-pointer inline-flex items-center space-x-2`}
        >
          <Upload className="h-4 w-4" />
          <span>{isLoading ? 'Subiendo...' : 'Seleccionar Imagen'}</span>
        </label>
      </div>
      
      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB
      </p>
    </div>
  );
};

export default ImageUpload;