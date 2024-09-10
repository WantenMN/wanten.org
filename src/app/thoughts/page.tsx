import { Metadata } from "next";

import { baseTitle } from "@/config/constants";
import { getAllPostInfo } from "@/lib/posts";
import PostList from "@/components/postList";

export const metadata: Metadata = {
  title: `Thoughts - ${baseTitle}`,
};

const Page = () => {
  const allPostInfo = getAllPostInfo({ suffixDir: "thoughts" });
  return <PostList allPostInfo={allPostInfo} />;
};

export default Page;
