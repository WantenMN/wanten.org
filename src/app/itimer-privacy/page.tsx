import { getPostData } from "@/lib/posts";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "iTimer 隐私政策",
  description: "iTimer 隐私政策",
};

const Me = async () => {
  const postData = await getPostData({ id: "itimer-privacy" });
  return (
    <div className="mx-auto max-w-3xl my-10">
        <article
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </div>
      
  );
};

export default Me;
