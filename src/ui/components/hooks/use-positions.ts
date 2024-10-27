import { useMemo } from "react";

export function usePositions<T extends {width: number, height: number}>(
  items: T[],
  columnWidth: number,
  columnCount: number,
  gap: number
) {
  const positions = useMemo(() => {
    const columnHeights = Array<number>(columnCount).fill(0);
    const positions = items.map((item, index) => {
      const aspectRatio = item.width / item.height;
      const height = columnWidth / aspectRatio;

      const column = columnHeights.indexOf(Math.min(...columnHeights));

      const x = column * (columnWidth + gap);
      const y = columnHeights[column];

      columnHeights[column] += height + gap;

      return {
        ...item as T,
        index,
        x,
        y,
        width: columnWidth,
        height,
      };
    });
    return positions;
  }, [items, columnWidth, columnCount, gap]);

  return positions;
}