import { Photo } from "../domain/photo";
import { PhotoRepository, PhotoListResult } from "../domain/ports/photo-repository.port";
import { UnsplashApiAdapter } from "../infrastructure/adapters/photo-repository.unsplash-api.adapter";

export class PhotoService {
  constructor(private photoRepository: PhotoRepository) {
    this.photoRepository = photoRepository;
  }
  async fetchPhotos(search: {
    page: number;
    query: string;
    per_page?: number;
  }, options?: { signal: AbortSignal }): Promise<PhotoListResult> {
    return this.photoRepository.fetchPhotos(search, options);
  }

  async fetchPhotoById(id: string): Promise<Photo> {
    return this.photoRepository.fetchPhotoById(id);
  }
}

export const photoService = new PhotoService(new UnsplashApiAdapter());