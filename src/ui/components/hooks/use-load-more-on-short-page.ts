import { useEffect } from "react";

export function useLoadMoreOnShortPage(
  totalHeight: number,
  viewportHeight: number,
  loading: boolean,
  loadMore: () => void
) {
  useEffect(() => {
    if (totalHeight < viewportHeight && !loading) {
      loadMore();
    }
  }, [totalHeight, viewportHeight, loading, loadMore]);
}