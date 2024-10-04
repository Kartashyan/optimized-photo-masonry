import { createBrowserRouter } from "react-router-dom";
import { loader as photoDetailsLoader } from "./photo-details.loader";
import App from "../App";

import { LazyPhotoDetailsPage, LazyPhotoGridPage } from "./lazy-components";
import { Suspense } from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyPhotoGridPage />
          </Suspense>
        ),
        errorElement: <div>Failed to load photos</div>,
      },
      {
        path: "photos",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyPhotoGridPage />
          </Suspense>
        ),
        errorElement: <div>Failed to load photos</div>,
      },
      {
        path: "photos/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyPhotoDetailsPage />
          </Suspense>
        ),
        loader: photoDetailsLoader,
        errorElement: <div>Failed to load photo</div>,
      },
    ],
  },
]);
