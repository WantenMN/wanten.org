"use client";

import Link from "next/link";

import GiscusComments from "@/hooks/GiscusComments";
import { useCodeCopy } from "@/hooks/useCodeCopy";
import { AdjacentPost, PostData } from "@/lib/posts";

import { Separator } from "./ui/separator";
import Tags from "./tags";

type AdjacentPosts = {
  previousPost: AdjacentPost | null;
  nextPost: AdjacentPost | null;
};

const Post = ({
  postData,
  adjacentPosts = {
    previousPost: null,
    nextPost: null,
  },
}: {
  postData: PostData;
  adjacentPosts?: AdjacentPosts;
}) => {
  GiscusComments();
  const handleMarkdownClick = useCodeCopy();

  return (
    <article>
      <h1 className="mb-4 text-[1.5rem] font-medium">{postData.title}</h1>
      <section className="mt-4 mb-8 text-sm">
        <a
          className="text-muted-foreground hover:text-foreground inline-block no-underline hover:no-underline"
          title="Edit History"
          href={`http://github.com/WantenMN/wanten.org/commits/main/posts/${postData.filePath}`}
          target="_blank"
        >
          <span>{postData.date}</span>
        </a>
        <Tags tags={postData.tags} className="mt-2" />
      </section>
      <section
        className="markdown-body"
        onClick={handleMarkdownClick}
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      ></section>
      {(adjacentPosts.previousPost || adjacentPosts.nextPost) && (
        <>
          <Separator className="mt-10 mb-8" />
          <nav aria-label="Post navigation" className="mb-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {adjacentPosts.nextPost ? (
                <Link
                  href={adjacentPosts.nextPost.slug}
                  aria-label={`Go to newer post: ${adjacentPosts.nextPost.title}`}
                  className="group border-border hover:bg-accent flex min-h-16 items-center gap-3 rounded-lg border px-4 py-3 no-underline transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground group-hover:text-foreground text-lg transition-colors"
                  >
                    &lt;
                  </span>
                  <span className="text-foreground text-sm font-medium">
                    {adjacentPosts.nextPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {adjacentPosts.previousPost ? (
                <Link
                  href={adjacentPosts.previousPost.slug}
                  aria-label={`Go to older post: ${adjacentPosts.previousPost.title}`}
                  className="group border-border hover:bg-accent flex min-h-16 items-center justify-end gap-3 rounded-lg border px-4 py-3 text-right no-underline transition-colors"
                >
                  <span className="text-foreground text-sm font-medium">
                    {adjacentPosts.previousPost.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground group-hover:text-foreground text-lg transition-colors"
                  >
                    &gt;
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        </>
      )}
      <Separator />
      <section className="giscus"></section>
    </article>
  );
};

export default Post;
