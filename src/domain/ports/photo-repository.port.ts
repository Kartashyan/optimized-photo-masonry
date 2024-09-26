import { Photo } from "../photo";

export interface PhotoRepository {
  fetchPhotos(query: string): Promise<Photo[]>;
}