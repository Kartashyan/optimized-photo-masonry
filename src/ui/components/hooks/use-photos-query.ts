import { useEffect, useState } from "react";
import { Photo } from "../../../domain/photo";
import { useDebounce } from "./use-debounce";
import { photoService } from "../../../services/photo.service";
import { type Pagination } from './../../../domain/ports/photo-repository.port';
import { AppConfigs } from "../../../infrastructure/app-configs";

export const usePhotosQuery = (query: string, configs: AppConfigs) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const debouncedQuery = useDebounce(query, configs.search.debounceDelay);

  useEffect(() => {
    setPhotos([]);
    setPage(1);
    setPagination(null);
  }, [debouncedQuery]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await photoService.fetchPhotos(
          { page, query: debouncedQuery },
          { signal: abortController.signal, configs }
        );

        setPhotos((prevPhotos) => [...prevPhotos, ...result.photos]);
        setPagination(result.pagination);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Request was aborted; no need to update state
          return;
        }

        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unexpected error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery, page, configs]);

  const loadMore = () => {
    if (pagination?.next) {
      setPage(pagination.next);
    }
  };

  return { photos, loading, loadMore, error };
};