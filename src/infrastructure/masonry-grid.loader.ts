import { LoaderFunction } from "react-router-dom";
import { PhotoService } from "../services/photo.service";
import { UnsplashApiAdapter } from "./adapters/photo-repository.unsplash-api.adapter";

export const loader: LoaderFunction = async ({ request }) => {
  const photoService = new PhotoService(new UnsplashApiAdapter()); // Injecting the dependency here
  const query = new URL(request.url).searchParams.get("query") || "cats";
  const page = Number(new URL(request.url).searchParams.get("page")) || 1;
  const result = await photoService.fetchPhotos(query, { page });
  return result;
};