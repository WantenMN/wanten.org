import PostList from "@/components/postList";
import { getPostsByDate } from "@/lib/posts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const allPosts = getPostsByDate();
  const yearMonths = Array.from(
    new Set(
      allPosts.map((post) => {
        const date = new Date(post.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      })
    )
  );
  return yearMonths.map((ym) => {
    const [year, month] = ym.split("-");
    return { year, month };
  });
}

const Page = async ({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) => {
  const { year, month } = await params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  if (isNaN(yearNum) || isNaN(monthNum)) {notFound();}
  const posts = getPostsByDate(yearNum, monthNum);
  if (posts.length === 0) {notFound();}
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        {year} 年 {month} 月
      </h1>
      <PostList allPostInfo={posts} />
    </div>
  );
};

export default Page;
