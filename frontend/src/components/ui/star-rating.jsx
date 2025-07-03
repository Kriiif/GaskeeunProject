import React, { useState } from 'react'
import { Star } from 'lucide-react'

const StarRating = ({ rating = 0, onRatingChange, size = "h-5 w-5", readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (index) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  const handleMouseEnter = (index) => {
    if (!readOnly) {
      setHoverRating(index + 1)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const filled = index < (hoverRating || rating)
        return (
          <Star
            key={index}
            className={`${size} transition-colors duration-200 ${
              filled 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${
              !readOnly ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'
            }`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        )
      })}
    </div>
  )
}

export default StarRating
