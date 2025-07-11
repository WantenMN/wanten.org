"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { capitalizeFirstAlpha, cn } from "@/lib/utils";

import { Separator } from "./ui/separator";
import { CATEGORIES } from "@/config/constants";
import Image from "next/image";

const Navigation = () => {
  const pathname = usePathname();
  const pages = [
    ...CATEGORIES.map((category) => ({
      title: capitalizeFirstAlpha(category),
      path: `/${category}`,
    })),
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
