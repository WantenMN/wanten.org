import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import DateNavigation from "@/components/dateNavigation";
import { BASE_TITLE } from "@/config/constants";
import { getDaysWithCount } from "@/lib/posts";

export const Route = createFileRoute("/$year/$month/days")({
  loader: ({ params }) => {
    if (!/^\d{2}$/.test(params.month)) {
      throw notFound();
    }
    const yearNum = parseInt(params.year);
    const monthNum = parseInt(params.month);
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw notFound();
    }
    const days = getDaysWithCount(yearNum, monthNum);
    return { yearNum, monthNum, days };
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.year} / ${params.month} Days - ${BASE_TITLE}` }],
  }),
  component: MonthDaysPage,
});

function MonthDaysPage() {
  const { yearNum, monthNum, days } = Route.useLoaderData();
  const paddedMonth = String(monthNum).padStart(2, "0");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        <DateNavigation type="year" currentYear={yearNum} /> /{" "}
        <DateNavigation
          type="month"
          currentYear={yearNum}
          currentMonth={monthNum}
        />{" "}
        Days
      </h1>
      <p className="text-muted-foreground mb-6">
        All days with posts in {yearNum} / {paddedMonth}
      </p>

      <div className="space-y-2">
        {days.map(({ day, count }) => (
          <Link
            key={day}
            to="/$year/$month/$day"
            params={{
              year: String(yearNum),
              month: paddedMonth,
              day: String(day).padStart(2, "0"),
            }}
            className="border-border hover:bg-accent flex items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <span className="text-foreground text-lg font-medium">
              {yearNum} / {paddedMonth} / {String(day).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground text-sm">
              ({count} posts)
            </span>
          </Link>
        ))}
      </div>

      {days.length === 0 && (
        <p className="text-muted-foreground">
          No posts found in {yearNum} / {paddedMonth}.
        </p>
      )}
    </div>
  );
}
