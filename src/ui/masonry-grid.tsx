import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Photo } from '../domain/photo';

const MasonryGrid: React.FC = () => {
  const { photos } = useLoaderData() as { photos: Photo[] };
  const navigate = useNavigate();

  const handlePhotoClick = (id: string) => {
    navigate(`/photo/${id}`);
  };

  return (
    <div className="masonry-grid">
      {photos.map((photo) => (
        <div key={photo.id} className="masonry-item" onClick={() => handlePhotoClick(photo.id)}>
          <img src={photo.urls.small} alt={photo.description || 'Photo'} />
          <p>{photo.user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;