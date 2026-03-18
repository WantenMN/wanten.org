import Link from "next/link";
import { getYearsWithCount } from "@/lib/posts";
import { BASE_TITLE } from "@/config/constants";

export async function generateMetadata() {
  return {
    title: `Years - ${BASE_TITLE}`,
  };
}

const Page = async () => {
  const years = getYearsWithCount();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Years</h1>
      <p className="text-muted-foreground mb-6">All years with posts</p>

      <div className="space-y-2">
        {years.map(({ year, count }) => (
          <Link
            key={year}
            href={`/${year}`}
            className="border-border hover:bg-accent flex items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <span className="text-foreground text-lg font-medium">{year}</span>
            <span className="text-muted-foreground text-sm">
              ({count} posts)
            </span>
          </Link>
        ))}
      </div>

      {years.length === 0 && (
        <p className="text-muted-foreground">No posts found.</p>
      )}
    </div>
  );
};

export default Page;
