import PostList from "@/components/postList";

import { getAllPostInfo } from "../../lib/posts";

const Works = () => {
  const allPostInfo = getAllPostInfo({ suffixDir: "works" });
  return <PostList allPostInfo={allPostInfo} />;
};

export default Works;
