import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Photo } from '../../domain/photo';
import { MasonryGrid } from '../components/masonry-grid';

export const PhotoGridPage: React.FC = () => {
  const { photos } = useLoaderData() as { photos: Photo[] };
  const navigate = useNavigate();

  const handlePhotoClick = (id: string) => {
    navigate(`/photo/${id}`);
  };

  return (
    <MasonryGrid photos={photos} columns={3} onItemClick={handlePhotoClick}/>
  );
};