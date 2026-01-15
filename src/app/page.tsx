import PostList from "@/components/postList";
import { getAllPostInfo } from "@/lib/posts";

export const dynamic = "force-static";

const Home = async () => {
  const allPostInfo = getAllPostInfo();
  return <PostList allPostInfo={allPostInfo} />;
};

export default Home;
