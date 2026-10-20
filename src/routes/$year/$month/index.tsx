import { createFileRoute, notFound } from "@tanstack/react-router";

import DateNavigation from "@/components/dateNavigation";
import PostList from "@/components/postList";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";
import { getPostsByDate } from "@/lib/posts";

export const Route = createFileRoute("/$year/$month/")({
  loader: ({ params }) => {
    if (!/^\d{2}$/.test(params.month)) {
      throw notFound();
    }
    const yearNum = parseInt(params.year);
    const monthNum = parseInt(params.month);
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw notFound();
    }
    const posts = getPostsByDate(yearNum, monthNum);
    return { yearNum, monthNum, posts };
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.year} / ${params.month} - ${BASE_TITLE}` }],
  }),
  component: MonthPage,
});

function MonthPage() {
  const { yearNum, monthNum, posts } = Route.useLoaderData();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        <DateNavigation type="year" currentYear={yearNum} />
        {" / "}
        <DateNavigation
          type="month"
          currentYear={yearNum}
          currentMonth={monthNum}
        />
      </h1>
      {posts.length > 0 && <Separator />}
      <PostList allPostInfo={posts} />
    </div>
  );
}
