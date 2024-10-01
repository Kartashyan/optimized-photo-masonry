import { useEffect, useState } from "react";
import { Photo } from "../../../domain/photo";
import { useInitialPhotosBeforeRender } from "./use-initial-photos-before-render";
import { useFetcher } from "react-router-dom";

export const usePhotosQuery = () => {
  const initialData = useInitialPhotosBeforeRender();
  const fetcher = useFetcher();

  const [photos, setPhotos] = useState<Photo[]>(initialData.photos);
  const [pagination, setPagination] = useState<Record<string, number>>({ next: 2 });

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }
    if (fetcher.data) {
      const newPhotos = [...(fetcher.data.photos as Photo[])];
      setPhotos((prev) => [...prev, ...newPhotos]);
      setPagination(fetcher.data.pagination);
    }
  }, [fetcher, fetcher.data, fetcher.state]);

  const loadMore = () => {
    console.log("load more");
    const page = pagination.next;
    const hasMore = !!pagination.next;
    if (!hasMore) {
      console.log("no more");
      return;
    }
    fetcher.load(`/photos?page=${page}`);
  };
  const loading = fetcher.state === "loading";

  return { photos, loading, loadMore };
}