import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./infrastructure/router.tsx";
import { ErrorBoundary } from "./ui/components/error-boundaries/error-boundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<div>Something went wrong1.</div>}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
);
