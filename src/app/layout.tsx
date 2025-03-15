import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/post.css";

import Container from "@/components/container";
import { baseDesc, baseTitle } from "@/config/constants";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: baseTitle,
  description: baseDesc,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          @import url('https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-web/style.css');
          body {
            font-family: "LXGW WenKai Screen", sans-serif;
            font-display: swap;
          }
        `}</style>
      </head>
      <body style={{ fontFamily: '"LXGW WenKai Screen", sans-serif' }}>
        <Container>{children}</Container>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
