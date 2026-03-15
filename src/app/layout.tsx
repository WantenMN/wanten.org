import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/post.css";

import Container from "@/components/container";
import { ThemeProvider } from "@/components/theme-provider";
import { BASE_DESC, BASE_TITLE } from "@/config/constants";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: BASE_TITLE,
  description: BASE_DESC,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS"
          href="/api/rss"
        />
        <style>{`
          @import url('https://cdn.jsdelivr.net/npm/misans@4.1.0/lib/Latin/MiSansLatin-Medium.min.css');
          body {
            font-family: MiSans, sans-serif;
            font-display: swap;
          }
        `}</style>
      </head>
      <body style={{ fontFamily: '"MiSans", sans-serif' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Container>{children}</Container>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
