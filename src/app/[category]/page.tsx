import PostList from "@/components/postList";
import { BASE_TITILE, CATEGORIES } from "@/config/constants";
import { getAllPostInfo } from "@/lib/posts";
import { capitalizeFirstAlpha } from "@/lib/utils";
import { Metadata } from "next";

export function generateStaticParams() {
  return CATEGORIES.map((item) => ({
    category: item,
  }));
}

const Page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;
  const allPostInfo = getAllPostInfo({ suffixDir: category });
  return <PostList allPostInfo={allPostInfo} />;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${capitalizeFirstAlpha(category)} - ${BASE_TITILE}`,
  };
}

export default Page;
