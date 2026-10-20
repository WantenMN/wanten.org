import { createFileRoute } from "@tanstack/react-router";

import PostList from "@/components/postList";
import { BASE_TITLE } from "@/config/constants";
import { getAllPostInfoFn } from "@/lib/posts.functions";

export const Route = createFileRoute("/")({
  loader: async () => await getAllPostInfoFn({ data: {} }),
  head: () => ({
    meta: [{ title: BASE_TITLE }],
  }),
  component: Home,
});

function Home() {
  const allPostInfo = Route.useLoaderData();
  return <PostList allPostInfo={allPostInfo} />;
}
