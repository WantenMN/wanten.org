import PostList from "@/components/postList";
import { getPostsByDate } from "@/lib/posts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const allPosts = getPostsByDate();
  const yearMonthDays = Array.from(
    new Set(
      allPosts.map((post) => {
        const date = new Date(post.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      })
    )
  );
  return yearMonthDays.map((ymd) => {
    const [year, month, day] = ymd.split("-");
    return { year, month, day };
  });
}

const Page = async ({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) => {
  const { year, month, day } = await params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);
  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {notFound();}
  const posts = getPostsByDate(yearNum, monthNum, dayNum);
  if (posts.length === 0) {notFound();}
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        {year} 年 {month} 月 {day} 日
      </h1>
      <PostList allPostInfo={posts} />
    </div>
  );
};

export default Page;
