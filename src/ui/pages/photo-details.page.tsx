import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Photo } from "../../domain/photo";
import { PhotoDetails } from "../components/photo-details";

export const PhotoDetailsPage: React.FC = () => {
  const { photo } = useLoaderData() as { photo: Photo };
  const navigate = useNavigate();
  const handleNavigate = () => navigate(-1);
  return <PhotoDetails photo={photo} navigateBack={handleNavigate} />;
};
