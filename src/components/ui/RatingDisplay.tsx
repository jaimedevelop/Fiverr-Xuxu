// src/components/ui/RatingDisplay.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating?: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showReviewCount?: boolean;
  disabled?: boolean;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  totalReviews,
  size = 'md',
  showReviewCount = true,
  disabled = true // Default to disabled for now
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  // If disabled, show placeholder
  if (disabled) {
    return (
      <div className="flex items-center space-x-1 opacity-50">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} text-gray-300`}
            fill="currentColor"
          />
        ))}
        <span className={`${textSizeClasses[size]} text-gray-400 ml-1`}>
          (Próximamente)
        </span>
      </div>
    );
  }

  // If no rating provided, don't render anything
  if (rating === undefined) {
    return null;
  }

  // Ensure rating is between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      {/* Stars */}
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= fullStars
                ? 'text-yellow-400'
                : star === fullStars + 1 && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Rating number */}
      <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
        {clampedRating.toFixed(1)}
      </span>

      {/* Review count */}
      {showReviewCount && totalReviews !== undefined && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>
          ({totalReviews} reseña{totalReviews !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;