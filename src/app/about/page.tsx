import Post from "@/components/post";
import { getPostData } from "@/lib/posts";

const Page = async () => {
  const postData = await getPostData({
    slug: "/2024/09/27/about",
  });
  return <Post postData={postData} />;
};

export default Page;
