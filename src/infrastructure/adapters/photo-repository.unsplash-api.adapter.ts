import { appConfigs } from './../app-configs';
import { Photo } from "../../domain/photo";
import { PhotoListResult, PhotoRepository, PhotoSearch } from "../../domain/ports/photo-repository.port";
import { BasicPhoto } from "./unsplash";

export class UnsplashApiAdapter implements PhotoRepository {
  private createRequest(search: PhotoSearch, options?: { signal: AbortSignal }): Request {
    const { per_page = appConfigs.search.perPage, page, query } = search;
    const params = new URLSearchParams({
      per_page: String(per_page),
      page: String(page),
      query: query.trim() || "cats",
    });

    const url = new URL(appConfigs.API_URL);
    url.search = params.toString();

    return new Request(url.toString(), {
      method: 'GET',
      signal: options?.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Client-ID ${appConfigs.ACCESS_KEY}`,
        'Cache-Control': 'max-age=604800', // 1 week
      },
    });
  }

  private parsePaginationLinks(linksHeaderString: string | null): Record<string, number> {
    if (!linksHeaderString) return {};

    try {
      return linksHeaderString.split(',').reduce((acc, link) => {
        const [urlPart, relPart] = link.split(';').map((s) => s.trim());
        const urlMatch = urlPart.match(/<(.+)>/);
        const relMatch = relPart.match(/rel="(.+)"/);
        if (urlMatch && relMatch) {
          const url = new URL(urlMatch[1]);
          const page = url.searchParams.get('page');
          if (page) {
            acc[relMatch[1]] = Number(page);
          }
        }
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error('parsePaginationLinks error:', error);
      return {};
    }
  }

  async fetchPhotos(search: PhotoSearch, options?: { signal: AbortSignal }): Promise<PhotoListResult> {
    try {
      const request = this.createRequest(search, options);
      const response = await fetch(request);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.errors?.join(', ') || response.statusText || 'Unknown error';
        throw new Error(`Error fetching photos: ${response.status} ${errorMessage}`);
      }

      const linksHeaderString = response.headers.get('Link');
      const pagination = this.parsePaginationLinks(linksHeaderString);

      const data = (await response.json()) as { results: BasicPhoto[] };
      return { photos: data.results.map(PhotoMapper.toDomain), pagination };
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // Request was aborted
        console.warn('fetchPhotos aborted');
        throw error;
      } else if (error instanceof Error) {
        console.error('fetchPhotos error:', error.message);
        throw error;
      } else {
        console.error('fetchPhotos unknown error:', error);
        throw new Error('An unknown error occurred while fetching photos.');
      }
    }
  }

  async fetchPhotoById(id: string): Promise<Photo> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Photo ID cannot be empty.');
      }

      const url = new URL(`https://api.unsplash.com/photos/${id}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Client-ID ${appConfigs.ACCESS_KEY}`,
        },
        cache: 'force-cache',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.errors?.join(', ') || response.statusText || 'Unknown error';
        throw new Error(`Error fetching photo by ID: ${response.status} ${errorMessage}`);
      }

      const data = (await response.json()) as BasicPhoto;
      return PhotoMapper.toDomain(data);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.warn('fetchPhotoById aborted');
        throw error;
      } else if (error instanceof Error) {
        console.error('fetchPhotoById error:', error.message);
        throw error;
      } else {
        console.error('fetchPhotoById unknown error:', error);
        throw new Error('An unknown error occurred while fetching the photo.');
      }
    }
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

export const photoRepository = new UnsplashApiAdapter();