"use client";

import Link from "next/link";

import { AllPostInfo } from "@/lib/posts";

import { Separator } from "./ui/separator";
import Tags from "./tags";

const PostList = ({ allPostInfo }: { allPostInfo: AllPostInfo }) => {
  return (
    <ul>
      {allPostInfo.map((post, index) => (
        <li key={post.id}>
          <Link
            className="flex-1 text-lg font-medium text-zinc-800 hover:text-black hover:underline focus:text-black focus:underline"
            href={post.slug}
          >
            {post.title}
          </Link>
          <p className="my-2 text-zinc-500">{post.desc}</p>
          <span className="block text-sm text-zinc-400">
            {(() => {
              const [datePart, timePart] = post.date.split(" ");
              const dateParts = datePart.split("-");
              const [year, month, day] = dateParts;
              return (
                <>
                  <Link
                    href={`/${year}`}
                    className="text-sm text-zinc-400 hover:text-zinc-600 hover:underline"
                  >
                    {year}
                  </Link>
                  -
                  <Link
                    href={`/${year}/${month}`}
                    className="text-sm text-zinc-400 hover:text-zinc-600 hover:underline"
                  >
                    {month}
                  </Link>
                  -
                  <Link
                    href={`/${year}/${month}/${day}`}
                    className="text-sm text-zinc-400 hover:text-zinc-600 hover:underline"
                  >
                    {day}
                  </Link>
                  {timePart && ` ${timePart}`}
                </>
              );
            })()}
          </span>
          <Tags tags={post.tags} />

          {index !== allPostInfo.length - 1 && <Separator />}
        </li>
      ))}
    </ul>
  );
};

export default PostList;
