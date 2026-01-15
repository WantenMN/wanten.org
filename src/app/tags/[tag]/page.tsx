import PostList from "@/components/postList";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const allTags = getAllTags();
  return allTags.map((t) => ({ tag: t.tag }));
}

const Page = async ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) {notFound();}
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Tag: {tag}</h1>
      <PostList allPostInfo={posts} />
    </div>
  );
};

export default Page;
