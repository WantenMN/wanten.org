import PostList from "@/components/postList";
import { getPostsByDate } from "@/lib/posts";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;
  const paddedMonth = month.padStart(2, "0");
  const paddedDay = day.padStart(2, "0");
  return {
    title: `${year} 年 ${paddedMonth} 月 ${paddedDay} 日 - ${BASE_TITLE}`,
  };
}

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
  const paddedMonth = month.padStart(2, "0");
  const paddedDay = day.padStart(2, "0");
  if (month !== paddedMonth || day !== paddedDay) {
    redirect(`/${year}/${paddedMonth}/${paddedDay}`);
  }
  const yearNum = parseInt(year);
  const monthNum = parseInt(paddedMonth);
  const dayNum = parseInt(paddedDay);
  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
    notFound();
  }
  const posts = getPostsByDate(yearNum, monthNum, dayNum);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        {year} 年 {paddedMonth} 月 {paddedDay} 日
      </h1>
      {posts.length > 0 && <Separator />}
      <PostList allPostInfo={posts} />
    </div>
  );
};

export default Page;
