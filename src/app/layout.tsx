import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/post.css";

import Container from "@/components/container";
import { baseDesc, baseTitle } from "@/config/constants";

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
      <body>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
