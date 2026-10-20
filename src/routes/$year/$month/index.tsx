import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import DateNavigation from "@/components/dateNavigation";
import PostList from "@/components/postList";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";
import { getPostsByDateFn } from "@/lib/posts.functions";

export const Route = createFileRoute("/$year/$month/")({
  beforeLoad: ({ params }) => {
    const paddedMonth = params.month.padStart(2, "0");
    if (params.month !== paddedMonth) {
      throw redirect({
        to: "/$year/$month",
        params: { year: params.year, month: paddedMonth },
      });
    }
  },
  loader: async ({ params }) => {
    const paddedMonth = params.month.padStart(2, "0");
    const yearNum = parseInt(params.year);
    const monthNum = parseInt(paddedMonth);
    if (isNaN(yearNum) || isNaN(monthNum)) {
      throw notFound();
    }
    const posts = await getPostsByDateFn({
      data: { year: yearNum, month: monthNum },
    });
    return { yearNum, monthNum, posts };
  },
  head: ({ params }) => {
    const paddedMonth = params.month.padStart(2, "0");
    return {
      meta: [{ title: `${params.year} / ${paddedMonth} - ${BASE_TITLE}` }],
    };
  },
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
