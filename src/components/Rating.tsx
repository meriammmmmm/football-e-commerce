import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingProps {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: number;
}

export function Rating({ rating, interactive = false, onRate, size = 14 }: RatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    if (interactive) setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (interactive) setIsDragging(false);
  };

  const handleStarInteraction = (star: number, mouseX: number, elementLeft: number, elementWidth: number) => {
    if (!interactive) return;
    
    const relativeX = mouseX - elementLeft;
    const isLeftHalf = relativeX < elementWidth / 2;
    const newRating = isLeftHalf ? star - 0.5 : star;
    
    setHoveredRating(newRating);
    if (isDragging && onRate) {
      onRate(newRating);
    }
  };

  const handleClick = (star: number, e: React.MouseEvent) => {
    if (interactive && onRate) {
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const isLeftHalf = relativeX < rect.width / 2;
      const newRating = isLeftHalf ? star - 0.5 : star;
      onRate(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
      setIsDragging(false);
    }
  };

  const displayRating = interactive && hoveredRating > 0 ? hoveredRating : rating;

  const renderStar = (star: number, isInteractive: boolean) => {
    const isFull = star <= Math.floor(displayRating);
    const isHalf = !isFull && star === Math.ceil(displayRating) && displayRating % 1 !== 0;
    
    return (
      <div key={star} className="relative inline-block" style={{ width: size, height: size }}>
        {/* Background (empty) star */}
        <Star
          size={size}
          className="fill-gray-200 text-gray-200"
        />
        
        {/* Foreground (filled) star - full or half */}
        {(isFull || isHalf) && (
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{
              width: isFull ? '100%' : '50%',
            }}
          >
            <Star
              size={size}
              className="fill-amber-400 text-amber-400"
            />
          </div>
        )}
      </div>
    );
  };

  if (interactive && onRate) {
    return (
      <div 
        className="flex items-center gap-0.5 select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={(e) => handleClick(star, e)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleStarInteraction(star, e.clientX, rect.left, rect.width);
            }}
            className="transition-transform hover:scale-125 cursor-pointer"
          >
            {renderStar(star, true)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => renderStar(star, false))}
    </div>
  );
}
