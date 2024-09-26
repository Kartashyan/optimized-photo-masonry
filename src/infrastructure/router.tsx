import { createBrowserRouter } from "react-router-dom";
import { loader as masonryGridLoader } from "./masonry-grid.loader";
import { loader as photoDetailsLoader } from "./photo-details.loader";
import App from "../App";
import MasonryGrid from "../ui/masonry-grid";
import PhotoDetails from "../ui/photo-details";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      {
        path: "",
        element: <MasonryGrid />,
        loader: masonryGridLoader,
        errorElement: <div>Failed to load photos</div>,
      },
      {
        path: "photo/:id",
        element: <PhotoDetails />,
        loader: photoDetailsLoader,
        errorElement: <div>Failed to load photo</div>,
      },
    ],
  },
]);
