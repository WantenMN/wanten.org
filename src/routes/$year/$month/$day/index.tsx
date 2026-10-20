import { createFileRoute, notFound } from "@tanstack/react-router";

import DateNavigation from "@/components/dateNavigation";
import PostList from "@/components/postList";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";
import { getPostsByDate } from "@/lib/posts";

export const Route = createFileRoute("/$year/$month/$day/")({
  loader: ({ params }) => {
    if (!/^\d{2}$/.test(params.month) || !/^\d{2}$/.test(params.day)) {
      throw notFound();
    }
    const yearNum = parseInt(params.year);
    const monthNum = parseInt(params.month);
    const dayNum = parseInt(params.day);
    if (
      isNaN(yearNum) ||
      isNaN(monthNum) ||
      isNaN(dayNum) ||
      monthNum < 1 ||
      monthNum > 12
    ) {
      throw notFound();
    }
    const posts = getPostsByDate(yearNum, monthNum, dayNum);
    return { yearNum, monthNum, dayNum, posts };
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.year} / ${params.month} / ${params.day} - ${BASE_TITLE}`,
      },
    ],
  }),
  component: DayPage,
});

function DayPage() {
  const { yearNum, monthNum, dayNum, posts } = Route.useLoaderData();

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
        {" / "}
        <DateNavigation
          type="day"
          currentYear={yearNum}
          currentMonth={monthNum}
          currentDay={dayNum}
        />
      </h1>
      {posts.length > 0 && <Separator />}
      <PostList allPostInfo={posts} />
    </div>
  );
}
