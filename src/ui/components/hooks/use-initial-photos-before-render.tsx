import { useLoaderData } from "react-router-dom";
import { PhotoListResult } from "../../../domain/ports/photo-repository.port";

export const useInitialPhotosBeforeRender = (): PhotoListResult => {
  const data = useLoaderData() as PhotoListResult;
  return data;
};
