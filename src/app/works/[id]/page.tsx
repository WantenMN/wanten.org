import { Metadata } from "next";

import Post from "@/components/post";
import { baseTitle } from "@/config/constants";
import { getAllPostInfo, getPostData, PostData } from "@/lib/posts";
import { PostProps } from "@/types/post";

export function generateStaticParams() {
  const posts = getAllPostInfo({ suffixDir: "works" });
  return posts.map((post) => ({
    id: post.id,
  }));
}

const Page = async ({ params }: PostProps) => {
  const { id } = await params;
  const postData: PostData = await getPostData({
    prefixDir: "works",
    id,
  });

  return (
    <>
      <Post postData={postData} />
    </>
  );
};

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { id } = await params;
  const postData: PostData = await getPostData({
    prefixDir: "works",
    id,
  });
  return {
    title: `${postData.title} - ${baseTitle}`,
    description: postData.desc,
  };
}

export default Page;
