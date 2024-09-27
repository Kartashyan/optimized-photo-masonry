import React from "react";
import { useLoaderData } from "react-router-dom";
import { Photo } from "../../domain/photo";
import { PhotoDetails } from "../components/photo-details";

export const PhotoDetailsPage: React.FC = () => {
  const { photo } = useLoaderData() as { photo: Photo };
  return <PhotoDetails photo={photo} />;
};
