import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { RouterClient } from "@tanstack/react-router/ssr/client";

import "@/styles/globals.css";
import "@/styles/post.css";

import { getRouter } from "./router";

const router = getRouter();

if (import.meta.env.PROD) {
  hydrateRoot(
    document,
    <StrictMode>
      <RouterClient router={router} />
    </StrictMode>
  );
} else {
  hydrateRoot(document, <RouterProvider router={router} />, {
    onRecoverableError: (error) => {
      if (
        error instanceof Error &&
        error.message.startsWith("Hydration failed because")
      ) {
        return;
      }
      console.error(error);
    },
  });
}
