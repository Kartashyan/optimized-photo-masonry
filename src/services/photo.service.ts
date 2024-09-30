import { Photo } from "../domain/photo";
import { PhotoRepository } from "../domain/ports/photo-repository.port";

export class PhotoService {
  constructor(private photoRepository: PhotoRepository) {
    this.photoRepository = photoRepository;
  }
  async fetchPhotos(query: string, options: { page: number }): Promise<{photos: Photo[]; pagination: Record<string, string>}> {
    return this.photoRepository.fetchPhotos(query, options);
  }

  async fetchPhotoById(id: string): Promise<Photo> {
    return this.photoRepository.fetchPhotoById(id);
  }
}