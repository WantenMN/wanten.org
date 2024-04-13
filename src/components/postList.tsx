"use client";

import Link from "next/link";

import { AllPostInfo } from "@/lib/posts";
import { Separator } from "@radix-ui/react-separator";

const PostList = ({ allPostInfo }: { allPostInfo: AllPostInfo }) => {
  return (
    <ul>
      {allPostInfo.map((post, index) => (
        <li key={post.id}>
          <div className="flex items-center justify-between">
            <Link
              className="flex-1 text-lg font-medium text-zinc-800 hover:text-black hover:underline"
              href={`works/${post.id}`}
            >
              {post.title}
            </Link>
            <span className="text-sm text-zinc-500">{post.time}</span>
          </div>
          <p className="text-zinc-500">{post.desc}</p>
          {index !== allPostInfo.length - 1 && (
            <Separator className="my-4 h-[1px] bg-zinc-100" />
          )}
        </li>
      ))}
    </ul>
  );
};

export default PostList;
