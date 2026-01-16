import PostList from "@/components/postList";
import DateNavigation from "@/components/dateNavigation";
import { getPostsByDate } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return {
    title: `${year} - ${BASE_TITLE}`,
  };
}

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
  if (isNaN(yearNum)) {
    notFound();
  }
  const posts = getPostsByDate(yearNum);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        <DateNavigation type="year" currentYear={yearNum} />
      </h1>
      {posts.length > 0 && <Separator />}
      <PostList allPostInfo={posts} />
    </div>
  );
};

export default Page;
