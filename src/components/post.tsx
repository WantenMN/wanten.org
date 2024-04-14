"use client";

import GiscusComments from "@/hooks/GiscusComments";
import { PostData } from "@/lib/posts";

import { Separator } from "./ui/separator";

const Post = ({ postData }: { postData: PostData }) => {
  GiscusComments();

  return (
    <article className="markdown-body">
      <h1>{postData.title}</h1>
      <span className="mb-8 mt-4 block text-sm text-zinc-400">
        {postData.time}
      </span>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}></div>
      <Separator />
      <div className="giscus"></div>
    </article>
  );
};

export default Post;
