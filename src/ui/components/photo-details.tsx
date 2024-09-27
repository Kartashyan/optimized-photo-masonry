import React from 'react';
import { Photo } from '../../domain/photo';

type PhotoDetailsProps = {
  photo: Photo;
};

export const PhotoDetails: React.FC<PhotoDetailsProps> = ({ photo}) => {
  return (
    <div>
      <img src={photo.urls.full} alt={photo.alt_description || 'Photo'} />
      <h2>{photo.user.name}</h2>
      <p>{photo.description}</p>
      <p>{new Date(photo.created_at).toLocaleDateString()}</p>
    </div>
  );
};
