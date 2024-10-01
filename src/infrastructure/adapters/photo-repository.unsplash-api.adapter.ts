import { Photo } from "../../domain/photo";
import { PhotoListResult, PhotoRepository } from "../../domain/ports/photo-repository.port";
import { BasicPhoto } from "./unsplash";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export class UnsplashApiAdapter implements PhotoRepository {
  async fetchPhotos(query: string, options?: { page: number }): Promise<PhotoListResult> {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=30&page=${options?.page || 1}&client_id=${ACCESS_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=604800', // Cache for 1 week
      },
      cache: 'force-cache',
    }
    );
    const linksHeaderString = response.headers.get('Link');
    const pagination = linksHeaderString?.split(',').reduce((acc, link) => {
      const [url, rel] = link.split(';').map((s) => s.trim());
      const urlMatch = url.match(/<(.+)>/);
      const relMatch = rel.match(/"(.+)"/);
      if (urlMatch && relMatch) {
        const url = new URL(urlMatch[1]);
        const page = url.searchParams.get('page');
        acc[relMatch[1]] = Number(page);
      }
      return acc;
    }
      , {} as Record<string, number>) || {};
    console.log("linkHeader", pagination);
    const data = await response.json() as { results: BasicPhoto[] };

    return { photos: data.results.map(PhotoMapper.toDomain), pagination };
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
      width: photo.width,
      height: photo.height,
    };
  }
}
