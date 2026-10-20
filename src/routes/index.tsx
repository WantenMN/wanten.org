import { createFileRoute } from "@tanstack/react-router";

import PostList from "@/components/postList";
import { BASE_TITLE } from "@/config/constants";
import { getAllPostInfo } from "@/lib/posts";

export const Route = createFileRoute("/")({
  loader: () => getAllPostInfo({}),
  head: () => ({
    meta: [{ title: BASE_TITLE }],
  }),
  component: Home,
});

function Home() {
  const allPostInfo = Route.useLoaderData();
  return <PostList allPostInfo={allPostInfo} />;
}
