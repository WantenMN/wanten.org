import PostList from "@/components/postList";
import { getPostsByDate } from "@/lib/posts";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const paddedMonth = month.padStart(2, "0");
  return {
    title: `${year} 年 ${paddedMonth} 月 - ${BASE_TITLE}`,
  };
}

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
  const paddedMonth = month.padStart(2, "0");
  if (month !== paddedMonth) {
    redirect(`/${year}/${paddedMonth}`);
  }
  const yearNum = parseInt(year);
  const monthNum = parseInt(paddedMonth);
  if (isNaN(yearNum) || isNaN(monthNum)) {
    notFound();
  }
  const posts = getPostsByDate(yearNum, monthNum);
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        {year} 年 {paddedMonth} 月
      </h1>
      {posts.length > 0 && <Separator />}
      <PostList allPostInfo={posts} />
    </div>
  );
};

export default Page;
