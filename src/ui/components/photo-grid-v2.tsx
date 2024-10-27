import React, { memo } from "react";
import styled from "styled-components";
import { Photo } from "../../domain/photo";
import { useColumnsCount } from "./hooks/use-columns-count";
import { ImageGridConfigs } from "../../infrastructure/app-configs";
import { useScrollPosition } from "./hooks/use-scroll-position";
import { usePositions } from "./hooks/use-positions";
import { useTotalHeight } from "./hooks/use-total-height";
import { useVisiblePositions } from "./hooks/use-visible-positions";
import { useInfiniteScroll } from "./hooks/use-infinite-scroll";
import { useLoadMoreOnShortPage } from "./hooks/use-load-more-on-short-page";

interface PhotoGrid {
  photos: Photo[];
  onItemClick?: (id: Photo["id"]) => void;
  loadMore: () => void;
  loading: boolean;
  top?: number;
  imageGridConfigs?: ImageGridConfigs;
}

export const MasonryGrid: React.FC<PhotoGrid> = memo(
  ({
    photos: allPhotos,
    onItemClick: handleItemClick,
    loadMore,
    loading,
    top = 0,
    imageGridConfigs,
  }) => {
    const { columns, columnWidth, gap } = useColumnsCount();

    const totalGridWidth = React.useMemo(
      () => columns * columnWidth + (columns - 1) * gap,
      [columns, columnWidth, gap]
    );

    const { scrollTop, viewportHeight } = useScrollPosition();

    const positions = usePositions(allPhotos, columnWidth, columns, gap);

    const totalHeight = useTotalHeight(positions);

    const buffer = imageGridConfigs?.lazyLoadOffset || 0;
    const visiblePositions = useVisiblePositions(
      positions,
      scrollTop,
      viewportHeight,
      buffer
    );

    const loadOffset = imageGridConfigs?.loadOffset || 0;
    const lastItemRef = useInfiniteScroll(loading, loadMore, loadOffset);

    useLoadMoreOnShortPage(totalHeight, viewportHeight, loading, loadMore);

    return (
      <GridContainer
        top={top}
        gridWidth={totalGridWidth}
        style={{ height: totalHeight }}
      >
        {visiblePositions.map((item) => (
          <GridItem
            key={allPhotos[item.index].id}
            left={item.x}
            top={item.y}
            width={item.width}
            height={item.height}
            onClick={() => handleItemClick?.(allPhotos[item.index].id)}
          >
            <Image
              loading={imageGridConfigs?.img.loading}
              src={allPhotos[item.index].urls.small}
              alt={item.alt_description}
            />
          </GridItem>
        ))}
        <Sentinel ref={lastItemRef} style={{ top: totalHeight - (top || 0) }} />
      </GridContainer>
    );
  }
);

export default MasonryGrid;

const GridContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !["gridWidth", "top"].includes(prop),
})<{ top: number; gridWidth: number }>`
  position: relative;
  top: ${(props) => props.top}px;
  width: ${(props) => props.gridWidth}px;
  margin: 0 auto;
  transition: width 0.2s ease-in-out;
`;

const GridItem = styled.div
  .withConfig({
    shouldForwardProp: (prop) => !["left", "top", "width", "height"].includes(prop),
  })
  .attrs<{ left: number; top: number; width: number; height: number }>((props) => ({
    style: {
      left: `${props.left}px`,
      top: `${props.top}px`,
      width: `${props.width}px`,
      height: `${props.height}px`,
    },
  }))`
  position: absolute;
  overflow: hidden;
  border-radius: 16px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Sentinel = styled.div`
  position: absolute;
  width: 100%;
  height: 1px; /* Minimal height to be observed */
`;