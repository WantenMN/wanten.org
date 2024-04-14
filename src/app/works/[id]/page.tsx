import { Metadata } from "next";

import Post from "@/components/post";
import { baseDesc, baseTitle } from "@/config/constants";
import { getPostData, PostData } from "@/lib/posts";

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params }: Props) => {
  const postData: PostData = await getPostData({
    prefixDir: "works",
    id: params.id,
  });
  return (
    <>
      <Post postData={postData} />
    </>
  );
};

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata> {
  const postData: PostData = await getPostData({
    prefixDir: "works",
    id: params.id,
  });
  return {
    title: `${postData.title} | ${baseTitle}`,
    description: postData.desc,
  };
}

export default Page;
