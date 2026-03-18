"use client";

import GiscusComments from "@/hooks/GiscusComments";
import { useCodeCopy } from "@/hooks/useCodeCopy";
import { PostData } from "@/lib/posts";

import { Separator } from "./ui/separator";
import Tags from "./tags";

const Post = ({ postData }: { postData: PostData }) => {
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
      <Separator />
      <section className="giscus"></section>
    </article>
  );
};

export default Post;
