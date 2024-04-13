"use client";

import GiscusComments from "@/hooks/GiscusComments";
import { PostData } from "@/lib/posts";

const Post = ({ postData }: { postData: PostData }) => {
  GiscusComments();

  return (
    <article className="markdown-body">
      <h1>{postData.title}</h1>
      <span className="mb-8 mt-2 block text-center text-sm text-zinc-500">
        {postData.time}
      </span>
      <div
        className="mb-4 border-b border-zinc-100"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      ></div>
      <div className="giscus"></div>
    </article>
  );
};

export default Post;
