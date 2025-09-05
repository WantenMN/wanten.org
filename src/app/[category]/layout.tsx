import "@/styles/globals.css";
import "@/styles/post.css";

import Container from "@/components/container";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Container>{children}</Container>
    </>
  );
}
