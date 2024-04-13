import type { Metadata } from "next";
import "./globals.css";
import "@/styles/post.css";

import { Inter, Noto_Sans_SC } from "next/font/google";
import localFont from "next/font/local";

import Container from "@/components/container";

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
  title: "Wanten Moment Now",
  description: "Wanten's personal website showcases his work and thoughts.",
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
