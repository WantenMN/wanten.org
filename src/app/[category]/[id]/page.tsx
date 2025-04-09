import { Metadata } from "next";

import Post from "@/components/post";
import { BASE_TITILE, CATEGORIES } from "@/config/constants";
import { getAllPostInfo, getPostData, PostData } from "@/lib/posts";

export function generateStaticParams() {
  return CATEGORIES.flatMap((category) =>
    getAllPostInfo({ suffixDir: category }).map((post) => ({
      category,
      id: post.id,
    }))
  );
}

const Page = async ({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) => {
  const { category, id } = await params;
  const postData: PostData = await getPostData({
    prefixDir: category,
    id,
  });
  return <Post postData={postData} />;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}): Promise<Metadata> {
  const { category, id } = await params;
  const postData: PostData = await getPostData({
    prefixDir: category,
    id,
  });
  return {
    title: `${postData.title} - ${BASE_TITILE}`,
    description: postData.desc,
  };
}

export default Page;
