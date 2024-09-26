import { LoaderFunction } from "react-router-dom";
import { PhotoService } from "../services/photo.service";
import { UnsplashApiAdapter } from "./adapters/photo-repository.unsplash-api.adapter";

export const loader: LoaderFunction = async ({
  params,
}) => {
  const photoService = new PhotoService(new UnsplashApiAdapter());
  const id = String(params.id);
  const photo = await photoService.fetchPhotoById(id);
  return { photo };
}