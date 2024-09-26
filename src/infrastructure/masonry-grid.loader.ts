import { PhotoService } from "../services/photo.service";
import { UnsplashApiAdapter } from "./adapters/photo-repository.unsplash-api.adapter";

export const loader = async () => {
  const photoService = new PhotoService(new UnsplashApiAdapter()); // Inject the dependency here
  const photos = await photoService.fetchPhotos("cats");
  return { photos };
};