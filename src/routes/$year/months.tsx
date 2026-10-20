import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import DateNavigation from "@/components/dateNavigation";
import { BASE_TITLE } from "@/config/constants";
import { getMonthsWithCountFn } from "@/lib/posts.functions";

export const Route = createFileRoute("/$year/months")({
  loader: async ({ params }) => {
    const yearNum = parseInt(params.year);
    if (isNaN(yearNum)) {
      throw notFound();
    }
    const months = await getMonthsWithCountFn({ data: { year: yearNum } });
    return { yearNum, months };
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.year} Months - ${BASE_TITLE}` }],
  }),
  component: YearMonthsPage,
});

function YearMonthsPage() {
  const { yearNum, months } = Route.useLoaderData();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        <DateNavigation type="year" currentYear={yearNum} /> Months
      </h1>
      <p className="text-muted-foreground mb-6">
        All months with posts in {yearNum}
      </p>

      <div className="space-y-2">
        {months.map(({ month, count }) => (
          <Link
            key={month}
            to="/$year/$month"
            params={{
              year: String(yearNum),
              month: String(month).padStart(2, "0"),
            }}
            className="border-border hover:bg-accent flex items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <span className="text-foreground text-lg font-medium">
              {yearNum} / {String(month).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground text-sm">
              ({count} posts)
            </span>
          </Link>
        ))}
      </div>

      {months.length === 0 && (
        <p className="text-muted-foreground">No posts found in {yearNum}.</p>
      )}
    </div>
  );
}
