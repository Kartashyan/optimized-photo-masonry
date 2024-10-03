import { Photo } from "../photo";
// export type Pagination = {first: number; last: number; next?: number; prev?: number; };

export type Pagination = Record<string, number>;
type FetchListResult<T> = { photos: T[]; pagination: Pagination };
export type PhotoListResult = FetchListResult<Photo>;

export type PhotoSearch = {
  page: number;
  query: string;
  per_page?: number;
};

export interface PhotoRepository {
  fetchPhotos(search: PhotoSearch, options?: { signal: AbortSignal }): Promise<FetchListResult<Photo>>;
  fetchPhotoById(id: string): Promise<Photo>;
}