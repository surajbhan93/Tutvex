import React from 'react';

interface RatingStarsProps {
  rating: number; // e.g., 4.5
  maxStars?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <div style={{ color: '#f5a623', display: 'flex', alignItems: 'center' }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`}>&#9733;</span> // ★
      ))}
      {halfStar && <span>&#189;</span>}{' '}
      {/* half star – can be improved with icon */}
      {[...Array(maxStars - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <span key={`empty-${i}`} style={{ color: '#ccc' }}>
          &#9733;
        </span> // empty star ★ in gray
      ))}
      <span style={{ marginLeft: 6, color: '#444' }}>{rating.toFixed(1)}</span>
    </div>
  );
};

export default RatingStars;
