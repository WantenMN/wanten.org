"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rss, UserRound, Tags } from "lucide-react";

import { cn } from "@/lib/utils";

import { Separator } from "./ui/separator";
import Image from "next/image";

const Navigation = () => {
  const pathname = usePathname();
  const pages = [
    {
      title: "About",
      path: "/about",
      icon: "UserRound",
    },
    {
      title: "Tags",
      path: "/tags",
      icon: "Tags",
    },
    {
      title: "",
      path: "/api/rss",
      icon: "Rss",
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
              title={page.icon === "Rss" ? "RSS Feed" : page.title}
            >
              {page.icon === "UserRound" && <UserRound size={16} />}
              {page.icon === "Tags" && <Tags size={16} />}
              {page.icon === "Rss" && <Rss size={16} />}
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
