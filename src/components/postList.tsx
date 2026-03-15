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
            className="text-foreground hover:text-foreground focus:text-foreground flex-1 text-lg font-medium hover:underline focus:underline"
            href={post.slug}
          >
            {post.title}
          </Link>
          <p className="text-muted-foreground my-2">{post.desc}</p>
          <span className="text-muted-foreground block text-sm">
            {(() => {
              const [datePart, timePart] = post.date.split(" ");
              const dateParts = datePart.split("-");
              const [year, month, day] = dateParts;
              return (
                <>
                  <Link
                    href={`/${year}`}
                    className="text-muted-foreground hover:text-foreground text-sm hover:underline"
                  >
                    {year}
                  </Link>
                  -
                  <Link
                    href={`/${year}/${month}`}
                    className="text-muted-foreground hover:text-foreground text-sm hover:underline"
                  >
                    {month}
                  </Link>
                  -
                  <Link
                    href={`/${year}/${month}/${day}`}
                    className="text-muted-foreground hover:text-foreground text-sm hover:underline"
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
