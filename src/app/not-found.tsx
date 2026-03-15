"use client";

import { useEffect } from "react";
import { BASE_TITLE } from "@/config/constants";

export default function NotFound() {
  useEffect(() => {
    document.title = `Page Not Found - ${BASE_TITLE}`;
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h1 className="text-foreground mb-4 text-4xl font-bold">
        Page Not Found
      </h1>
      <p className="text-muted-foreground text-lg">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
    </div>
  );
}
