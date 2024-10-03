import { createBrowserRouter } from "react-router-dom";
import { loader as photoDetailsLoader } from "./photo-details.loader";
import App from "../App";
import { PhotoGridPage } from "../ui/pages/photo-grid.page";
import { PhotoDetailsPage } from "../ui/pages/photo-details.page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      {
        index: true,
        element: <PhotoGridPage />,
        errorElement: <div>Failed to load photos</div>,
      },
      {
        path: "photos",
        element: <PhotoGridPage />,
        errorElement: <div>Failed to load photos</div>,
      },
      {
        path: "photos/:id",
        element: <PhotoDetailsPage />,
        loader: photoDetailsLoader,
        errorElement: <div>Failed to load photo</div>,
      },
    ],
  },
]);
