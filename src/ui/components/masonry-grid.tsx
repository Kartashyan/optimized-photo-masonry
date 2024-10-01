import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Photo } from "../../domain/photo";
import { useResizeColumns } from "./hooks/use-resize-columns";

interface MasonryGridProps {
  photos: Photo[];
  onItemClick?: (id: Photo["id"]) => void;
  loadMore: () => void;
  loading: boolean;
}

const GridContainer = styled.div`
  position: relative;
  width: 100%;
`;

const GridItem = styled.div<{
  x: number;
  y: number;
  width: number;
  height: number;
}>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
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

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  photos: allPhotos,
  onItemClick: handleItemClick,
  loadMore,
  loading,
}) => {
  const { columns, columnWidth, gap } = useResizeColumns({
    columnWidth: 236,
    gap: 8,
  });
  const observer = useRef<IntersectionObserver | null>(null);

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
  const totalHeight = useMemo(
    () => Math.max(...positions.map((pos) => pos.y + pos.height)),
    [positions]
  );

  // Calculate visible items
  const buffer = 200; // Extra buffer to load items before they are visible
  const visibleStart = scrollTop - buffer;
  const visibleEnd = scrollTop + viewportHeight + buffer;

  const visiblePositions = useMemo(
    () =>
      positions.filter(
        (pos) => pos.y + pos.height > visibleStart && pos.y < visibleEnd
      ),
    [positions, visibleStart, visibleEnd]
  );

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
      );
      if (node) observer.current.observe(node);
    },
    [loading, loadMore]
  );

  useEffect(() => {
    if (totalHeight < viewportHeight && !loading) {
      loadMore();
    }
  }, [totalHeight, viewportHeight, loading, loadMore]);

  return (
    <GridContainer style={{ height: totalHeight }}>
      {visiblePositions.map((item) => (
        <GridItem
          key={allPhotos[item.index].id}
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          onClick={() => handleItemClick?.(allPhotos[item.index].id)}
        >
          <Image src={allPhotos[item.index].urls.small} />
        </GridItem>
      ))}
      <Sentinel ref={lastItemRef} style={{ top: totalHeight }} />
    </GridContainer>
  );
};

export default MasonryGrid;

function calculatePositions<T extends { width: number; height: number }>(
  items: T[],
  columnWidth: number,
  columnCount: number,
  gap: number
) {
  const columnHeights = Array<number>(columnCount).fill(0); // Array to keep track of the height of each column
  const positions = items.map((item, index) => {
    const aspectRatio = item.width / item.height;
    const height = columnWidth / aspectRatio;

    const column = columnHeights.indexOf(Math.min(...columnHeights)); // Find the shortest column

    const x = column * (columnWidth + gap);
    const y = columnHeights[column];

    columnHeights[column] += height + gap; // Update the column height

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
