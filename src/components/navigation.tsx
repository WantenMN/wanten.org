"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { capitalizeFirstAlpha, cn } from "@/lib/utils";

import { Separator } from "./ui/separator";
import { CATEGORIES } from "@/config/constants";

const Navigation = () => {
  const pathname = usePathname();
  const pages = [
    {
      title: "Me",
      path: "/",
    },
    ...CATEGORIES.map((category) => ({
      title: capitalizeFirstAlpha(category),
      path: `/${category}`,
    })),
  ];

  return (
    <nav className="flex w-full items-center justify-end select-none">
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
              <Separator orientation="vertical" />
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
