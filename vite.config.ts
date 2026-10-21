import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { livePosts } from "./scripts/vite-live-posts.ts";

export default defineConfig({
  server: {
    port: 3000,
    warmup: {
      clientFiles: ["./src/main.tsx"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    manifest: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-router",
      "@tanstack/react-router/ssr/client",
      "@radix-ui/react-separator",
      "clsx",
      "tailwind-merge",
    ],
  },
  plugins: [
    livePosts(),
    tailwindcss(),
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: false,
      routesDirectory: "src/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
    }),
    viteReact(),
  ],
});
