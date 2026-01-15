"use client";

import GiscusComments from "@/hooks/GiscusComments";
import { PostData } from "@/lib/posts";

import { Separator } from "./ui/separator";

const Post = ({ postData }: { postData: PostData }) => {
  GiscusComments();

  return (
    <article className="markdown-body">
      <h1>{postData.title}</h1>
      <section className="mt-4 mb-8 text-sm">
        <a
          className="inline-block text-zinc-400!"
          title="Edit History"
          href={`http://github.com/WantenMN/wanten.org/commits/main/posts/${postData.filePath}`}
          target="_blank"
        >
          <span>{postData.date}</span>
        </a>
      </section>
      <section
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      ></section>
      <Separator />
      <section className="giscus"></section>
    </article>
  );
};

export default Post;
