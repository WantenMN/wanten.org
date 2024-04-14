import { Separator } from "@/components/ui/separator";
import { getPostData } from "@/lib/posts";

const Me = async () => {
  const postData = await getPostData({ id: "me" });
  return (
    <>
      <article
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
      <Separator />
    </>
  );
};

export default Me;
