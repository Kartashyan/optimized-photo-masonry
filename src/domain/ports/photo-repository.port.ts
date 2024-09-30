import { Photo } from "../photo";

type Pagination = Record<string, string>;
type FetchListResult<T> = { photos: T[]; pagination: Pagination };

export interface PhotoRepository {
  fetchPhotos(query: string, options?: { page: number }): Promise<FetchListResult<Photo>>;
  fetchPhotoById(id: string): Promise<Photo>;
}