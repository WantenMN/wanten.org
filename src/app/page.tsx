import Container from "@/components/container";
import { getPostData } from "@/lib/posts";

export const dynamic = "force-static";

const Me = async () => {
  const postData = await getPostData({ id: "home" });
  return (
    <Container>
      <article
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </Container>
  );
};

export default Me;
