import React, { useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Photo } from '../../domain/photo';

type MasonryGridProps = {
  photos: Photo[];
  columns: number;
  onItemClick: (id: Photo["id"]) => void;
}

const Grid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  grid-gap: 16px;
  padding: 16px;
`;

const GridItem = styled.div<{ spanRows: number }>`
  grid-row-end: span ${props => props.spanRows};
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const MasonryGrid: React.FC<MasonryGridProps> = ({ photos, columns, onItemClick: handleItemClick }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const getSpanRows = useCallback((photo: Photo) => {
    const aspectRatio = photo.height / photo.width;
    return Math.ceil(aspectRatio * 100 / (100 / columns));
  }, [columns]);

  const memoizedPhotos = useMemo(() => {
    return photos.map(photo => ({
      ...photo,
      spanRows: getSpanRows(photo)
    }));
  }, [photos, getSpanRows]);

  return (
    <Grid ref={gridRef} columns={columns}>
      {memoizedPhotos.map(photo => (
        <GridItem key={photo.id} spanRows={photo.spanRows} onClick={() => handleItemClick(photo.id)}>
          <Image src={photo.urls.small} alt={photo.alt_description} />
        </GridItem>
      ))}
    </Grid>
  );
};