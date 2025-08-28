// src/components/user/common/ImageDisplay.tsx
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageDisplayProps {
  images: string[];
  alt: string;
  className?: string;
}

const ImageDisplay = ({ images = [], alt = '', className = '' }: ImageDisplayProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const mainImage = images.length > 0 ? images[0] : null;

  useEffect(() => {
    if (mainImage) {
      setImageLoaded(false);
      setImageError(false);
      
      // Create image to get dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setImageLoaded(true);
      };
      img.onerror = () => {
        setImageError(true);
      };
      img.src = mainImage;
    }
  }, [mainImage]);

  // Determine if image needs special treatment
  const needsBlurBackground = () => {
    if (!imageLoaded || !imageDimensions.width || !imageDimensions.height) return false;
    
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    const isVeryTall = aspectRatio < 0.5;
    const isVeryWide = aspectRatio > 2;
    const isSmall = imageDimensions.width < 400 || imageDimensions.height < 400;
    
    return isVeryTall || isVeryWide || isSmall;
  };

  const shouldUseBlurBackground = needsBlurBackground();

  if (!mainImage || imageError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-slate">
          <div className="bg-gray-200 rounded-full p-3 mx-auto mb-2 w-fit">
            <ImageIcon size={32} />
          </div>
          <span className="text-xs font-medium">Sin Imagen</span>
        </div>
      </div>
    );
  }

  if (!imageLoaded) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <div className="animate-pulse">
          <div className="bg-saffron-200 rounded-lg w-8 h-8"></div>
        </div>
      </div>
    );
  }

  if (shouldUseBlurBackground) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Blurred background */}
        <div 
          className="absolute inset-0 scale-110 blur-lg opacity-60"
          style={{
            backgroundImage: `url(${mainImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px) brightness(0.8)',
          }}
        />
        
        {/* Main image */}
        <div className="relative w-full h-full flex items-center justify-center p-2">
          <img
            src={mainImage}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-brand-lg ring-1 ring-white/20"
            onError={() => setImageError(true)}
          />
        </div>
        
        {/* Overlay gradient for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    );
  }

  // Standard image display
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={mainImage}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default ImageDisplay;