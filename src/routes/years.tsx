import { Link, createFileRoute } from "@tanstack/react-router";

import { BASE_TITLE } from "@/config/constants";
import { getYearsWithCountFn } from "@/lib/posts.functions";

export const Route = createFileRoute("/years")({
  loader: async () => await getYearsWithCountFn(),
  head: () => ({
    meta: [{ title: `Years - ${BASE_TITLE}` }],
  }),
  component: Years,
});

function Years() {
  const years = Route.useLoaderData();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Years</h1>
      <p className="text-muted-foreground mb-6">All years with posts</p>

      <div className="space-y-2">
        {years.map(({ year, count }) => (
          <Link
            key={year}
            to="/$year"
            params={{ year: year.toString() }}
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
}
