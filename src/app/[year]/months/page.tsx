import Link from "next/link";
import { getMonthsWithCount } from "@/lib/posts";
import { notFound } from "next/navigation";
import { BASE_TITLE } from "@/config/constants";
import DateNavigation from "@/components/dateNavigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return {
    title: `${year} Months - ${BASE_TITLE}`,
  };
}

const Page = async ({ params }: { params: Promise<{ year: string }> }) => {
  const { year } = await params;
  const yearNum = parseInt(year);

  if (isNaN(yearNum)) {
    notFound();
  }

  const months = getMonthsWithCount(yearNum);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        <DateNavigation type="year" currentYear={yearNum} /> Months
      </h1>
      <p className="text-muted-foreground mb-6">
        All months with posts in {year}
      </p>

      <div className="space-y-2">
        {months.map(({ month, count }) => (
          <Link
            key={month}
            href={`/${year}/${String(month).padStart(2, "0")}`}
            className="border-border hover:bg-accent flex items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <span className="text-foreground text-lg font-medium">
              {year} / {String(month).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground text-sm">
              ({count} posts)
            </span>
          </Link>
        ))}
      </div>

      {months.length === 0 && (
        <p className="text-muted-foreground">No posts found in {year}.</p>
      )}
    </div>
  );
};

export default Page;
