"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Separator } from "./ui/separator";

const Navigation = () => {
  const pathname = usePathname();
  const pages = [
    {
      title: "Me",
      path: "/",
    },
    {
      title: "Works",
      path: "/works",
    },
    {
      title: "Thoughts",
      path: "/thoughts",
    },
  ];

  return (
    <nav className="mb-4 flex w-full select-none items-center justify-end border-b border-zinc-100 pb-4">
      <ul className="flex leading-none text-zinc-400">
        {pages.map((page, index) => (
          <li key={index} className="flex">
            <Link
              href={page.path}
              key={index}
              className={cn("hover:text-zinc-800", {
                "text-zinc-800 underline": pathname === page.path,
              })}
            >
              {page.title}
            </Link>
            {index !== pages.length - 1 ? (
              <Separator
                orientation="vertical"
                className="mx-4 h-auto bg-zinc-200"
              />
            ) : (
              <></>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
