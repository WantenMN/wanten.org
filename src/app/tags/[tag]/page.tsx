import PostList from "@/components/postList";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return {
    title: `Tag: ${tag} - ${BASE_TITLE}`,
  };
}

export function generateStaticParams() {
  const allTags = getAllTags();
  return allTags.map((t) => ({ tag: t.tag }));
}

const Page = async ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) {
    notFound();
  }
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Tag: {tag}</h1>
      {posts.length > 0 && <Separator />}
      <PostList allPostInfo={posts} />
    </div>
  );
};

export default Page;
