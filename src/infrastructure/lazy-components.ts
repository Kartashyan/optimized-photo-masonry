import { lazy } from "react";

const LazyPhotoGridPage = lazy(() => import("../ui/pages/photo-grid.page"));
const LazyPhotoDetailsPage = lazy(() => import("../ui/pages/photo-details.page"));

export { LazyPhotoGridPage, LazyPhotoDetailsPage };