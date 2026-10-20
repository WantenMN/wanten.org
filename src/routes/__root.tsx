import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import "@/styles/globals.css";
import "@/styles/post.css";

import Container from "@/components/container";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import { BASE_DESC, BASE_TITLE } from "@/config/constants";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: BASE_TITLE,
      },
      {
        name: "description",
        content: BASE_DESC,
      },
    ],
    links: [
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "RSS",
        href: "/api/rss",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Container>
          <Outlet />
        </Container>
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style>{`
          @import url('https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.2.5/index.css');
          @import url('https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.2.5/500.css');
          @import url('https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.2.5/700.css');
          @import url('https://cdn.jsdelivr.net/npm/misans@4.1.0/lib/Normal/MiSans-Regular.min.css');
          body {
            font-family: "JetBrains Mono", MiSans, monospace, sans-serif;
            font-display: swap;
          }
        `}</style>
      </head>
      <body
        style={{
          fontFamily: '"JetBrains Mono", "MiSans", monospace, sans-serif',
        }}
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}
