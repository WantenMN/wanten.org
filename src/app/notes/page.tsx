import { Metadata } from "next";

import PostList from "@/components/postList";
import { baseTitle } from "@/config/constants";
import { getAllPostInfo } from "@/lib/posts";

export const metadata: Metadata = {
  title: `Notes - ${baseTitle}`,
};

const Page = () => {
  const allPostInfo = getAllPostInfo({ suffixDir: "notes" });
  return <PostList allPostInfo={allPostInfo} />;
};

export default Page;
