import Link from "next/link";
import { getDaysWithCount } from "@/lib/posts";
import { notFound } from "next/navigation";
import { BASE_TITLE } from "@/config/constants";
import DateNavigation from "@/components/dateNavigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  return {
    title: `${year} / ${month} Days - ${BASE_TITLE}`,
  };
}

const Page = async ({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) => {
  const { year, month } = await params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum)) {
    notFound();
  }

  const days = getDaysWithCount(yearNum, monthNum);

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
        All days with posts in {year} / {month}
      </p>

      <div className="space-y-2">
        {days.map(({ day, count }) => (
          <Link
            key={day}
            href={`/${year}/${month}/${String(day).padStart(2, "0")}`}
            className="border-border hover:bg-accent flex items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <span className="text-foreground text-lg font-medium">
              {year} / {month} / {String(day).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground text-sm">
              ({count} posts)
            </span>
          </Link>
        ))}
      </div>

      {days.length === 0 && (
        <p className="text-muted-foreground">
          No posts found in {year} / {month}.
        </p>
      )}
    </div>
  );
};

export default Page;
