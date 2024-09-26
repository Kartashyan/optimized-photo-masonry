import { Photo } from "../domain/photo";
import { PhotoRepository } from "../domain/ports/photo-repository.port";

export class PhotoService {
  constructor(private photoRepository: PhotoRepository) {
    this.photoRepository = photoRepository;
  }
  async fetchPhotos(query: string): Promise<Photo[]> {
    return this.photoRepository.fetchPhotos(query);
  }
}