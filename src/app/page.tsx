import { getPostData } from "@/lib/posts";

export const dynamic = "force-static";

const Me = async () => {
  const postData = await getPostData({ id: "me" });
  return (
    <>
      <article
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </>
  );
};

export default Me;
