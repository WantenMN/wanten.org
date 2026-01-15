import Post from "@/components/post";
import { getPostData } from "@/lib/posts";
import { BASE_TITLE } from "@/config/constants";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const postData = await getPostData({
    slug: "/2024/09/27/about",
  });
  if (!postData) {
    return {
      title: `About - ${BASE_TITLE}`,
    };
  }
  return {
    title: `${postData.title} - ${BASE_TITLE}`,
    description: postData.desc,
  };
}

const Page = async () => {
  const postData = await getPostData({
    slug: "/2024/09/27/about",
  });
  if (!postData) {
    notFound();
  }
  return <Post postData={postData} />;
};

export default Page;
