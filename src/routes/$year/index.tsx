import { createFileRoute, notFound } from "@tanstack/react-router";

import DateNavigation from "@/components/dateNavigation";
import PostList from "@/components/postList";
import { Separator } from "@/components/ui/separator";
import { BASE_TITLE } from "@/config/constants";
import { getPostsByDateFn } from "@/lib/posts.functions";

export const Route = createFileRoute("/$year/")({
  loader: async ({ params }) => {
    const yearNum = parseInt(params.year);
    if (isNaN(yearNum)) {
      throw notFound();
    }
    const posts = await getPostsByDateFn({ data: { year: yearNum } });
    return { yearNum, posts };
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.year} - ${BASE_TITLE}` }],
  }),
  component: YearPage,
});

function YearPage() {
  const { yearNum, posts } = Route.useLoaderData();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        <DateNavigation type="year" currentYear={yearNum} />
      </h1>
      {posts.length > 0 && <Separator />}
      <PostList allPostInfo={posts} />
    </div>
  );
}
