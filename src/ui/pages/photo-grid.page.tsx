import React from "react";
import { useNavigate } from "react-router-dom";
import { usePhotosQuery } from "../components/hooks/use-photos-query";
import { MasonryGrid } from "../components/masonry-grid";

export const PhotoGridPage: React.FC = () => {
  const { photos } = usePhotosQuery();

  const navigate = useNavigate();

  const handlePhotoClick = (id: string) => {
    navigate(`/photos/${id}`);
  };

  return <MasonryGrid photos={photos} onItemClick={handlePhotoClick} />;
};
