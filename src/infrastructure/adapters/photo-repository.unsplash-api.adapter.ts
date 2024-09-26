import { Photo } from "../../domain/photo";
import { PhotoRepository } from "../../domain/ports/photo-repository.port";
import { BasicPhoto } from "./unsplash";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export class UnsplashApiAdapter implements PhotoRepository {
  async fetchPhotos(query: string) {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${ACCESS_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=604800', // Cache for 1 week
      },
      cache: 'force-cache',
    }
    );
    const data = await response.json() as { results: BasicPhoto[] };
    return data.results.map(PhotoMapper.toDomain);
  }

  async fetchPhotoById(id: string) {
    const response = await fetch(
      `https://api.unsplash.com/photos/${id}?client_id=${ACCESS_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=604800', // Cache for 1 week
      },
      cache: 'force-cache',
    }
    );
    const data = await response.json() as BasicPhoto;
    return PhotoMapper.toDomain(data);
  }
}

class PhotoMapper {
  static toDomain(photo: BasicPhoto): Photo {
    return {
      id: photo.id,
      urls: {
        small: photo.urls.small,
        full: photo.urls.full,
      },
      user: {
        name: photo.user.name,
      },
      description: photo.description || "",
      alt_description: photo.alt_description || "",
      created_at: photo.created_at,
    };
  }
}
