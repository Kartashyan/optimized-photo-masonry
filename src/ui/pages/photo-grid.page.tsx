import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhotosQuery } from "../components/hooks/use-photos-query";
import { MasonryGrid } from "../components/masonry-grid";
import { SearchArea } from "../components/search-area";


export const PhotoGridPage: React.FC = () => {
  const [searchText, setSearchTesxt] = useState("");
  const { photos, loadMore, loading, error } = usePhotosQuery(searchText);

  const navigate = useNavigate();

  const handlePhotoClick = (id: string) => {
    navigate(`/photos/${id}`);
  };
  return (
    <>
      <SearchArea setSearchText={setSearchTesxt} />
      <MasonryGrid
        photos={photos}
        onItemClick={handlePhotoClick}
        loadMore={loadMore}
        loading={loading}
        top={120}
      />
      {error && <p>{error.message}</p>}
    </>
  );
};
