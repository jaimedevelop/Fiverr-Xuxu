import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const ImageDisplay = ({ images = [], alt = '', className = '' }) => {
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
    
    // Check if image is significantly smaller than container or has unusual aspect ratio
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    const isVeryTall = aspectRatio < 0.5;
    const isVeryWide = aspectRatio > 2;
    const isSmall = imageDimensions.width < 400 || imageDimensions.height < 400;
    
    return isVeryTall || isVeryWide || isSmall;
  };

  const shouldUseBlurBackground = needsBlurBackground();

  if (!mainImage || imageError) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
            <ImageIcon size={24} />
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
          <div className="w-10 h-10 bg-gradient-to-r from-saffron-200 to-saffron-300 rounded-full opacity-60"></div>
        </div>
      </div>
    );
  }

  if (shouldUseBlurBackground) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Blurred background with theme colors */}
        <div 
          className="absolute inset-0 scale-110 opacity-40"
          style={{
            backgroundImage: `url(${mainImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(25px) brightness(0.7) saturate(1.2)',
          }}
        />
        
        {/* Gradient overlay for brand consistency */}
        <div className="absolute inset-0 bg-gradient-to-t from-saffron-500/20 via-transparent to-purple-500/20" />
        
        {/* Main image */}
        <div className="relative w-full h-full flex items-center justify-center p-3">
          <img
            src={mainImage}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-brand-lg border border-white/20"
            onError={() => setImageError(true)}
          />
        </div>
        
        {/* Enhanced overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
      </div>
    );
  }

  // Standard image display with theme enhancements
  return (
    <div className={`overflow-hidden relative ${className}`}>
      <img
        src={mainImage}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        onError={() => setImageError(true)}
      />
      
      {/* Subtle overlay for consistent branding */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent hover:from-black/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default ImageDisplay;