import React from 'react';

interface Tutor {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  description: string;
  avatarUrl?: string;
  onClick?: () => void;
}

const TutorCard: React.FC<Tutor> = ({
  name,
  profession,
  rating,
  reviews,
  description,
  onClick,
  avatarUrl,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        cursor: onClick ? 'pointer' : 'default',
        maxWidth: 220,
      }}
    >
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            marginBottom: 8,
          }}
        />
      )}
      <h4 style={{ margin: '8px 0' }}>{name}</h4>
      <p style={{ color: '#666', fontSize: 14 }}>{profession}</p>
      <p style={{ fontWeight: 'bold', margin: '8px 0' }}>
        {rating} ★ ({reviews} reviews)
      </p>
      <p style={{ fontSize: 13, color: '#444' }}>{description}</p>
    </div>
  );
};

export default TutorCard;
