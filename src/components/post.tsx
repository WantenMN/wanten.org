import { PostData } from "@/lib/posts";

const Post = ({ postData }: { postData: PostData }) => {
  return (
    <article className="markdown-body">
      <h1>{postData.title}</h1>
      <span className="mb-8 mt-2 block text-center text-sm text-zinc-500">
        {postData.time}
      </span>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}></div>
    </article>
  );
};

export default Post;
