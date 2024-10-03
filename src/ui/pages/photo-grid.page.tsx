import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhotosQuery } from "../components/hooks/use-photos-query";
import { MasonryGrid } from "../components/masonry-grid";

export const PhotoGridPage: React.FC = () => {
  const [searchText, setSearchTesxt] = useState("");
  const { photos, loadMore, loading, error } = usePhotosQuery(searchText);

  const navigate = useNavigate();

  const handlePhotoClick = (id: string) => {
    navigate(`/photos/${id}`);
  };
  return (
    <>
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchTesxt(e.target.value)}
      />
      <MasonryGrid
        photos={photos}
        onItemClick={handlePhotoClick}
        loadMore={loadMore}
        loading={loading}
      />
      {error && <p>{error.message}</p>}
    </>
  );
};
