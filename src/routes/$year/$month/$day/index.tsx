import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import DateNavigation from "@/components/dateNavigation";
import PostList from "@/components/postList";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";
import { getPostsByDateFn } from "@/lib/posts.functions";

export const Route = createFileRoute("/$year/$month/$day/")({
  beforeLoad: ({ params }) => {
    const paddedMonth = params.month.padStart(2, "0");
    const paddedDay = params.day.padStart(2, "0");
    if (params.month !== paddedMonth || params.day !== paddedDay) {
      throw redirect({
        to: "/$year/$month/$day",
        params: {
          year: params.year,
          month: paddedMonth,
          day: paddedDay,
        },
      });
    }
  },
  loader: async ({ params }) => {
    const paddedMonth = params.month.padStart(2, "0");
    const paddedDay = params.day.padStart(2, "0");
    const yearNum = parseInt(params.year);
    const monthNum = parseInt(paddedMonth);
    const dayNum = parseInt(paddedDay);
    if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
      throw notFound();
    }
    const posts = await getPostsByDateFn({
      data: { year: yearNum, month: monthNum, day: dayNum },
    });
    return { yearNum, monthNum, dayNum, posts };
  },
  head: ({ params }) => {
    const paddedMonth = params.month.padStart(2, "0");
    const paddedDay = params.day.padStart(2, "0");
    return {
      meta: [
        {
          title: `${params.year} / ${paddedMonth} / ${paddedDay} - ${BASE_TITLE}`,
        },
      ],
    };
  },
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
