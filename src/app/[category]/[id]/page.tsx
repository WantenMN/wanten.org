import { Metadata } from "next";

import Post from "@/components/post";
import { baseTitle, CATEGORIES } from "@/config/constants";
import { getAllPostInfo, getPostData, PostData } from "@/lib/posts";
import { PostProps } from "@/types";

export function generateStaticParams() {
  return CATEGORIES.flatMap((category) =>
    getAllPostInfo({ suffixDir: category }).map((post) => ({
      category,
      id: post.id,
    }))
  );
}

const Page = async ({ params }: PostProps) => {
  const { category, id } = await params;
  const postData: PostData = await getPostData({
    prefixDir: category,
    id,
  });
  return <Post postData={postData} />;
};

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { category, id } = await params;
  const postData: PostData = await getPostData({
    prefixDir: category,
    id,
  });
  return {
    title: `${postData.title} - ${baseTitle}`,
    description: postData.desc,
  };
}

export default Page;
