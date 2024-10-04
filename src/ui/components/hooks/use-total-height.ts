import { useMemo } from "react";

interface Position {
  y: number;
  height: number;
}

export function useTotalHeight(positions: Position[]) {
  const totalHeight = useMemo(() => {
    if (positions.length === 0) return 0;
    return Math.max(0, ...positions.map((pos) => pos.y + pos.height));
  }, [positions]);

  return totalHeight;
}