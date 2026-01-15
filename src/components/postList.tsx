"use client";

import Link from "next/link";

import { AllPostInfo } from "@/lib/posts";

import { Separator } from "./ui/separator";

const PostList = ({ allPostInfo }: { allPostInfo: AllPostInfo }) => {
  return (
    <ul>
      {allPostInfo.map((post, index) => (
        <li key={post.id}>
          <Link
            className="flex-1 text-lg font-medium text-zinc-800 hover:text-black hover:underline focus:text-black focus:underline"
            href={`/${post.path}`}
          >
            {post.title}
          </Link>
          <p className="my-2 text-zinc-500">{post.desc}</p>
          <span className="block text-sm text-zinc-400">{post.date}</span>
          {index !== allPostInfo.length - 1 && <Separator />}
        </li>
      ))}
    </ul>
  );
};

export default PostList;
