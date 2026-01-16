import Link from "next/link";
import { getYearsWithCount } from "@/lib/posts";
import { Separator } from "@/components/ui/separator";
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
      <p className="mb-6 text-zinc-600">All years with posts</p>

      <div className="space-y-2">
        {years.map(({ year, count }) => (
          <Link
            key={year}
            href={`/${year}`}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          >
            <span className="text-lg font-medium text-zinc-800">{year}</span>
            <span className="text-sm text-zinc-500">({count} posts)</span>
          </Link>
        ))}
      </div>

      {years.length === 0 && <p className="text-zinc-500">No posts found.</p>}
    </div>
  );
};

export default Page;
