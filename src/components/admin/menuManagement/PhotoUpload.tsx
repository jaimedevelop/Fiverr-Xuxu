import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../firebase/config';
import { Upload, X, Image as ImageIcon, Move, Star } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

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
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          dragOver
            ? 'border-purple-500 bg-purple-50 scale-105'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
            disabled ? 'bg-gray-100' : dragOver ? 'bg-purple-100' : 'bg-gradient-to-r from-purple-100 to-saffron-100'
          }`}>
            <Upload className={`w-8 h-8 ${
              disabled ? 'text-gray-300' : dragOver ? 'text-purple-500' : 'text-purple-500'
            }`} />
          </div>
          
          <div className="mb-6">
            <p className={`text-base font-semibold mb-2 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              Arrastra y suelta imágenes aquí, o{' '}
              <button
                type="button"
                onClick={() => !disabled && fileInputRef.current?.click()}
                disabled={disabled}
                className={`font-bold underline ${
                  disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                explora
              </button>
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF hasta 10MB cada una
            </p>
          </div>
          
          {uploading && (
            <div className="flex items-center justify-center gap-3 text-purple-600">
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold">Subiendo imágenes...</span>
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-gray-900">
              Imágenes Subidas ({images.length})
            </h4>
            <p className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
              La primera imagen será la foto principal
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          <div className="card-base p-6 bg-gradient-to-r from-sky-50 to-purple-50 border-dashed border-2 border-sky-200">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="text-sky-600" size={16} />
              </div>
              <div className="text-sm text-sky-800">
                <p className="font-bold mb-3">Consejos para Fotos Perfectas:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></span>
                    La primera imagen será la foto principal que se muestra en los listados
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></span>
                    Usa los botones de flecha para reordenar las imágenes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></span>
                    Las fotos de alta calidad y bien iluminadas captan más atención
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></span>
                    Muestra diferentes ángulos y detalles de tu postre
                  </li>
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
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        {!imageLoaded && !imageError && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse bg-gradient-to-r from-purple-200 to-saffron-200 w-10 h-10 rounded-full"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ImageIcon size={32} className="mx-auto mb-2" />
              <span className="text-xs">Error</span>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Subida ${index + 1}`}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Main Photo Badge */}
        {isMain && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-saffron-500 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star size={12} />
              Principal
            </span>
          </div>
        )}
        
        {/* Controls Overlay */}
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-3">
            <div className="flex items-center gap-2">
              {/* Move Up */}
              {canMoveUp && (
                <button
                  onClick={onMoveUp}
                  className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
                  title="Mover a la izquierda"
                >
                  <Move size={16} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              )}
              
              {/* Remove */}
              <button
                onClick={() => onRemove(index)}
                className="bg-red-500/90 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-200 shadow-lg"
                title="Eliminar imagen"
              >
                <X size={16} />
              </button>
              
              {/* Move Down */}
              {canMoveDown && (
                <button
                  onClick={onMoveDown}
                  className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
                  title="Mover a la derecha"
                >
                  <Move size={16} style={{ transform: 'rotate(90deg)' }} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Image Index */}
      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-lg">
        {index + 1}
      </div>
    </div>
  );
};

export default PhotoUpload;