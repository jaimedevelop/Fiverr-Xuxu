import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../firebase/config';
import { Upload, X, Image as ImageIcon, Move, Star } from 'lucide-react';

const PhotoUpload = ({ images = [], onChange, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0 || disabled) return;
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} no es un archivo de imagen`);
        }
        // Create unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2);
        const extension = file.name.split('.').pop();
        const filename = `pastries/${timestamp}_${randomId}.${extension}`;
        // Upload to Firebase Storage
        const storageRef = ref(storage, filename);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      });
      const newImageUrls = await Promise.all(uploadPromises);
      onChange([...images, ...newImageUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Error al subir imágenes: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveImage = async (index) => {
    if (disabled) return;
    try {
      const imageUrl = images[index];
      
      // Try to delete from Firebase Storage
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Could not delete image from storage:', error);
        // Continue with removal from array even if storage deletion fails
      }
      // Remove from array
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Error al eliminar imagen. Por favor, inténtelo de nuevo.');
    }
  };

  const handleReorderImages = (fromIndex, toIndex) => {
    if (disabled) return;
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  const moveImage = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < images.length) {
      handleReorderImages(index, newIndex);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${
            disabled ? 'text-gray-300' : 'text-gray-400'
          }`} />
          
          <div className="mb-4">
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
              Arrastra y suelta imágenes aquí, o{' '}
              <button
                type="button"
                onClick={() => !disabled && fileInputRef.current?.click()}
                disabled={disabled}
                className={`font-medium ${
                  disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                explora
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF hasta 10MB cada una
            </p>
          </div>
          
          {uploading && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Subiendo imágenes...</span>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
      </div>
      
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Imágenes Subidas ({images.length})
            </h4>
            <p className="text-xs text-gray-500">
              La primera imagen será la foto principal
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <ImagePreview
                key={`${imageUrl}-${index}`}
                imageUrl={imageUrl}
                index={index}
                isMain={index === 0}
                onRemove={handleRemoveImage}
                onMoveUp={() => moveImage(index, 'up')}
                onMoveDown={() => moveImage(index, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < images.length - 1}
                disabled={disabled}
              />
            ))}
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Star className="text-blue-600 mt-0.5" size={14} />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Consejos para Fotos:</p>
                <ul className="space-y-1">
                  <li>• La primera imagen será la foto principal que se muestra en los listados</li>
                  <li>• Usa los botones de flecha para reordenar las imágenes</li>
                  <li>• Las fotos de alta calidad y bien iluminadas captan más atención</li>
                  <li>• Muestra diferentes ángulos y detalles de tu postre</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Image Preview Component
const ImagePreview = ({ 
  imageUrl, 
  index, 
  isMain, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown, 
  disabled 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative group">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-8 h-8 rounded"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon size={24} />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Subida ${index + 1}`}
            className={`w-full h-full object-cover transition-opacity ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Main Photo Badge */}
        {isMain && (
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star size={10} />
              Principal
            </span>
          </div>
        )}
        
        {/* Controls Overlay */}
        {!disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-1">
              {/* Move Up */}
              {canMoveUp && (
                <button
                  onClick={onMoveUp}
                  className="bg-white text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Mover a la izquierda"
                >
                  <Move size={14} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              )}
              
              {/* Remove */}
              <button
                onClick={() => onRemove(index)}
                className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                title="Eliminar imagen"
              >
                <X size={14} />
              </button>
              
              {/* Move Down */}
              {canMoveDown && (
                <button
                  onClick={onMoveDown}
                  className="bg-white text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Mover a la derecha"
                >
                  <Move size={14} style={{ transform: 'rotate(90deg)' }} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Image Index */}
      <div className="absolute -bottom-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
        {index + 1}
      </div>
    </div>
  );
};

export default PhotoUpload;