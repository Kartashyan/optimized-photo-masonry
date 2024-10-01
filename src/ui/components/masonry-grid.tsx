import React, { useMemo } from "react";
import styled from "styled-components";
import { Photo } from "../../domain/photo";
import { useResizeColumns } from "./hooks/use-resize-columns";

interface MasonryGridProps {
  photos: Photo[];
  onItemClick?: (id: Photo["id"]) => void;
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

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  photos: allPhotos,
  onItemClick: handleItemClick,
}) => {
  const { columns, columnWidth, gap } = useResizeColumns({
    columnWidth: 236,
    gap: 8,
  });

  const positions = useMemo(
    () => calculatePositions(allPhotos, columnWidth, columns, gap),
    [allPhotos, columns, columnWidth, gap]
  );
  const totalHeight = useMemo(
    () => Math.max(...positions.map((pos) => pos.y + pos.height)),
    [positions]
  );

  return (
    <GridContainer style={{ height: totalHeight }}>
      {positions.map((item) => (
        <GridItem
          key={item.id}
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          data-testid={`grid-item-${item.id}`}
          onClick={() => handleItemClick?.(item.id)}
        >
          <Image src={item.urls.small} alt="" />
        </GridItem>
      ))}
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
  const positions = items.map((item) => {
    const aspectRatio = item.width / item.height;
    const height = columnWidth / aspectRatio;

    const column = columnHeights.indexOf(Math.min(...columnHeights)); // Find the shortest column

    const x = column * (columnWidth + gap);
    const y = columnHeights[column];

    columnHeights[column] += height + gap; // Update the column height

    return {
      ...item,
      x,
      y,
      width: columnWidth,
      height,
    };
  });

  return positions;
}
