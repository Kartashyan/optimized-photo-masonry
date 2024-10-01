import { useState } from "react";
import { Photo } from "../../../domain/photo";
import { useInitialPhotosBeforeRender } from "./use-initial-photos-before-render";

export const usePhotosQuery = () => {
  const initialData = useInitialPhotosBeforeRender();

  const [photos] = useState<Photo[]>(initialData.photos);
  const loadMore = () => {
    console.log("load more");
  };


  return { photos, loading: false, loadMore };
}