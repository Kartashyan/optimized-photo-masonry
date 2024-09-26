import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Photo } from '../domain/photo';

const PhotoDetails: React.FC = () => {
  const { photo } = useLoaderData() as { photo: Photo };

  return (
    <div>
      <img src={photo.urls.full} alt={photo.description || 'Photo'} />
      <h2>{photo.user.name}</h2>
      <p>{photo.description}</p>
      <p>{new Date(photo.created_at).toLocaleDateString()}</p>
    </div>
  );
};

export default PhotoDetails;