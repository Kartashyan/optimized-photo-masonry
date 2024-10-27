import React, { useCallback, useState } from "react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import { usePhotosQuery } from "../components/hooks/use-photos-query";
import { MasonryGrid } from "../components/masonry-grid";
import { SearchArea } from "../components/search-area";
import { appConfigs } from "../../infrastructure/app-configs";

export const Component: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { photos, loadMore, loading, error } = usePhotosQuery(searchText);

  const navigate = useNavigate();
  
  const handlePhotoClick = useCallback(
    (id: string) => {
      navigate(`/photos/${id}`);
    },
    [navigate]
  );

  const handleSetSearchText = useCallback(
    (text: string) => setSearchText(text),
    []
  );

  return (
    <>
      <SearchArea setSearchText={handleSetSearchText} />
      <MasonryGrid
        photos={photos}
        onItemClick={handlePhotoClick}
        loadMore={loadMore}
        loading={loading}
        top={120}
        imageGridConfigs={appConfigs.imageGrid}
      />
      {error && <p>{error.message}</p>}
    </>
  );
};
Component.displayName = "PhotoGridPage";


export function ErrorBoundary() {
  const error = useRouteError();
  return isRouteErrorResponse(error) ? (
    <h1>
      {error.status} {error.statusText}
    </h1>
  ) : (
    error instanceof Error ? (
      <h1>{error.message}</h1>
    ) : (
      <h1>Unknown error</h1>
    )
  );
}

