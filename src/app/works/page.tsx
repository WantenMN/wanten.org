import { Metadata } from "next";

import PostList from "@/components/postList";
import { baseTitle } from "@/config/constants";

import { getAllPostInfo } from "../../lib/posts";

export const metadata: Metadata = {
  title: `Works - ${baseTitle}`,
};

const Works = () => {
  const allPostInfo = getAllPostInfo({ suffixDir: "works" });
  return <PostList allPostInfo={allPostInfo} />;
};

export default Works;
