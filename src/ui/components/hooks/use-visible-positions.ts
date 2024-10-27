import { useMemo } from "react";

export function useVisiblePositions<T extends { y: number; height: number }>(
  positions: T[],
  scrollTop: number,
  viewportHeight: number,
  buffer: number
) {
  const visibleStart = scrollTop - buffer;
  const visibleEnd = scrollTop + viewportHeight + buffer;

  const visiblePositions = useMemo(
    () =>
      positions.filter(
        (pos) => pos.y + pos.height > visibleStart && pos.y < visibleEnd
      ),
    [positions, visibleStart, visibleEnd]
  );

  return visiblePositions;
}