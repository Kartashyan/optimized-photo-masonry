import { createBrowserRouter } from "react-router-dom";
import { loader as photoDetailsLoader } from "./photo-details.loader";
import App from "../App";

import { LazyPhotoDetailsPage, LazyPhotoGridPage } from "./lazy-components";
import { Suspense } from "react";
import ErrorPage from "../ui/components/error-boundaries/error-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyPhotoGridPage />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "photos/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyPhotoDetailsPage />
          </Suspense>
        ),
        loader: photoDetailsLoader,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);
