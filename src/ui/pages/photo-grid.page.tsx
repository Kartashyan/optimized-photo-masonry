import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhotosQuery } from "../components/hooks/use-photos-query";
import { MasonryGrid } from "../components/masonry-grid";
import { SearchArea } from "../components/search-area";
import { appConfigs } from "../../infrastructure/app-configs";
import styled from "styled-components";
import { AppConfigsContext } from "../components/contexts/configs-context";

const PhotoGridPage: React.FC = () => {
  const appSettings = useContext(AppConfigsContext);
  const [searchText, setSearchText] = useState("");
  const { photos, loadMore, loading, error } = usePhotosQuery(
    searchText,
    appSettings
  );

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
      {appSettings.ACCESS_KEY ? (
        <>
          <SettingsButton />
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
      ) : (
        <MissingConfigs>
          <h1>
            API Key is missing. Please add it in the settings. It will be
            persisted only in the browser storage.
          </h1>
          <SettingsButton />
        </MissingConfigs>
      )}
    </>
  );
};

export default PhotoGridPage;

const SettingsButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  return <StyledSettings onClick={handleClick}>Settings</StyledSettings>;
};

const StyledSettings = styled.button`
  position: fixed;
  top: 120px;
  left: calc(50% - 50px);
  width: 100px;
  z-index: 100;
  background: linear-gradient(
    45deg,
    rgba(255, 0, 150, 0.5) 0%,
    rgba(255, 204, 0, 0.5) 100%
  );
  backdrop-filter: blur(10px);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
`;

const MissingConfigs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(
    45deg,
    rgba(255, 0, 150, 0.5) 0%,
    rgba(255, 204, 0, 0.5) 100%
  );
  backdrop-filter: blur(10px);
  padding: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);

  h1 {
    margin-bottom: 20px;
    font-size: 24px;
  }
`;
