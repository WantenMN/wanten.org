import { Metadata } from "next";

import Post from "@/components/post";
import { BASE_TITILE } from "@/config/constants";
import { getAllPostInfo, getPostData, PostData } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPostInfo({ includeHidden: true }).map((post) => ({
    path: post.path,
  }));
}

const Page = async ({ params }: { params: Promise<{ path: string }> }) => {
  const { path } = await params;
  const postData: PostData = await getPostData({
    path,
  });
  return <Post postData={postData} />;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const { path } = await params;
  const postData: PostData = await getPostData({
    path,
  });
  return {
    title: `${postData.title} - ${BASE_TITILE}`,
    description: postData.desc,
  };
}

export default Page;
