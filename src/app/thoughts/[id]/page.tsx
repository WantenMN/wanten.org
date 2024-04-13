import Post from "@/components/post";
import { getPostData, PostData } from "@/lib/posts";

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params }: Props) => {
  const postData: PostData = await getPostData({
    prefixDir: "thoughts",
    id: params.id,
  });
  return <Post postData={postData} />;
};

export default Page;
