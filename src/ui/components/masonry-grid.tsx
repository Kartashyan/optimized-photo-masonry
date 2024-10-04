import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Photo } from "../../domain/photo";
import { useColumnsCount } from "./hooks/use-columns-count";
import { ImageGridConfigs } from "../../infrastructure/app-configs";

interface MasonryGridProps {
  photos: Photo[];
  onItemClick?: (id: Photo["id"]) => void;
  loadMore: () => void;
  loading: boolean;
  top?: number;
  imageGridConfigs?: ImageGridConfigs;
}

export const MasonryGrid: React.FC<MasonryGridProps> = memo(
  ({
    photos: allPhotos,
    onItemClick: handleItemClick,
    loadMore,
    loading,
    top = 0,
    imageGridConfigs,
  }) => {
    const { columns, columnWidth, gap } = useColumnsCount();

    const totalGridWidth = useMemo(
      () => columns * columnWidth + (columns - 1) * gap,
      [columns, columnWidth, gap]
    );

    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);

    useEffect(() => {
      const updateViewportHeight = () => {
        setViewportHeight(window.innerHeight);
      };
      updateViewportHeight();
      window.addEventListener("resize", updateViewportHeight);
      return () => {
        window.removeEventListener("resize", updateViewportHeight);
      };
    }, []);

    const handleScroll = useCallback(() => {
      setScrollTop(window.scrollY);
    }, []);

    useEffect(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [handleScroll]);

    const positions = useMemo(
      () => calculatePositions(allPhotos, columnWidth, columns, gap),
      [allPhotos, columns, columnWidth, gap]
    );

    const totalHeight = useMemo(() => {
      if (positions.length === 0) return 0;
      return Math.max(...positions.map((pos) => pos.y + pos.height));
    }, [positions]);

    // Calculate visible items
    const buffer = imageGridConfigs?.lazyLoadOffset || 0; // Extra buffer to load items before they are visible
    const visibleStart = scrollTop - buffer;
    const visibleEnd = scrollTop + viewportHeight + buffer;

    const visiblePositions = useMemo(
      () =>
        positions.filter(
          (pos) => pos.y + pos.height > visibleStart && pos.y < visibleEnd
        ),
      [positions, visibleStart, visibleEnd]
    );

    const observer = useRef<IntersectionObserver | null>(null);

    const lastItemRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadMore();
            }
          },
          {
            rootMargin: (imageGridConfigs?.loadOffset || 0) + "px",
          }
        );
        if (node) observer.current.observe(node);
      },
      [loading, loadMore, imageGridConfigs?.loadOffset]
    );

    useEffect(() => {
      if (totalHeight < viewportHeight && !loading) {
        loadMore();
      }
    }, [totalHeight, viewportHeight, loading, loadMore]);

    return (
      <GridContainer
        top={top}
        gridWidth={totalGridWidth}
        style={{ height: totalHeight }}
      >
        {visiblePositions.map((item) => (
          <GridItem
            key={allPhotos[item.index].id}
            x={item.x}
            y={item.y}
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
        <Sentinel ref={lastItemRef} style={{ top: totalHeight - top }} />
      </GridContainer>
    );
  }
);

export default MasonryGrid;

function calculatePositions<T extends { width: number; height: number }>(
  items: T[],
  columnWidth: number,
  columnCount: number,
  gap: number
) {
  const columnHeights = Array<number>(columnCount).fill(0); // Keep track of column heights
  const positions = items.map((item, index) => {
    const aspectRatio = item.width / item.height;
    const height = columnWidth / aspectRatio;

    const column = columnHeights.indexOf(Math.min(...columnHeights)); // Shortest column

    const x = column * (columnWidth + gap);
    const y = columnHeights[column];

    columnHeights[column] += height + gap; // Update column height

    return {
      ...item,
      index,
      x,
      y,
      width: columnWidth,
      height,
    };
  });

  return positions;
}

const GridContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !["gridWidth", "top"].includes(prop),
})<{ top: number; gridWidth: number }>`
  position: relative;
  top: ${(props) => props.top}px;
  width: ${(props) => props.gridWidth}px;
  margin: 0 auto;
  transition: width 0.2s ease-in-out;
`;

const GridItem = styled.div.attrs<{
  x: number;
  y: number;
  width: number;
  height: number;
}>((props) => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
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
