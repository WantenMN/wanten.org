"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import Image from "next/image";

const Navigation = () => {
  return (
    <nav className="flex w-full items-center justify-between select-none">
      <Link href={"/"} className={cn("")} title="Home">
        <Image src="/favicon.ico" alt="Home" width={24} height={24} />
      </Link>
    </nav>
  );
};

export default Navigation;
