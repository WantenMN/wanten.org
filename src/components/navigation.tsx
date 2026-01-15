"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rss } from "lucide-react";

import { cn } from "@/lib/utils";

import { Separator } from "./ui/separator";
import Image from "next/image";

const Navigation = () => {
  const pathname = usePathname();
  const pages = [
    {
      title: "",
      path: "/api/rss",
      isIcon: true,
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Tags",
      path: "/tags",
    },
  ];

  return (
    <nav className="flex w-full items-center justify-between select-none">
      <Link href={"/"} className={cn("")} title="Home">
        <Image src="/favicon.ico" alt="Home" width={24} height={24} />
      </Link>

      <ul className="flex leading-none text-zinc-400">
        {pages.map((page, index) => (
          <li key={index} className="flex">
            <Link
              href={page.path}
              className={cn("flex items-center hover:text-zinc-800", {
                "text-zinc-800 underline": pathname === page.path,
              })}
              title={page.isIcon ? "RSS Feed" : undefined}
            >
              {page.isIcon ? <Rss size={16} /> : page.title}
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
