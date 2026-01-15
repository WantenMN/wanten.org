import PostList from "@/components/postList";
import { getPostsByDate } from "@/lib/posts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const allPosts = getPostsByDate();
  const years = Array.from(
    new Set(allPosts.map((post) => new Date(post.date).getFullYear()))
  );
  return years.map((year) => ({ year: year.toString() }));
}

const Page = async ({ params }: { params: Promise<{ year: string }> }) => {
  const { year } = await params;
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) {notFound();}
  const posts = getPostsByDate(yearNum);
  if (posts.length === 0) {notFound();}
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{year} 年</h1>
      <PostList allPostInfo={posts} />
    </div>
  );
};

export default Page;
