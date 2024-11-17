import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/post.css";

import { Inter, Noto_Sans_SC } from "next/font/google";

import Container from "@/components/container";
import { baseDesc, baseTitle } from "@/config/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-sc",
});

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
      <body className={`${inter.variable} ${notoSansSC.variable}`}>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
