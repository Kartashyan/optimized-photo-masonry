import React from "react";
import { useNavigate } from "react-router-dom";
import { useInitialPhotosBeforeRender } from "../components/hooks/use-initial-photos-before-render";
import { MasonryGrid } from "../components/masonry-grid";

export const PhotoGridPage: React.FC = () => {
  const initialData = useInitialPhotosBeforeRender();

  const navigate = useNavigate();

  const handlePhotoClick = (id: string) => {
    navigate(`/photos/${id}`);
  };

  return (
    <MasonryGrid photos={initialData.photos} onItemClick={handlePhotoClick} />
  );
};
