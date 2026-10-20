import { createFileRoute, notFound } from "@tanstack/react-router";

import Post from "@/components/post";
import { BASE_TITLE } from "@/config/constants";
import { getPostDataFn } from "@/lib/posts.functions";

const ABOUT_SLUG = "/2024/09/27/1422";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const postData = await getPostDataFn({ data: { slug: ABOUT_SLUG } });
    if (!postData) {
      throw notFound();
    }
    return postData;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.title} - ${BASE_TITLE}`
          : `About - ${BASE_TITLE}`,
      },
    ],
  }),
  component: About,
});

function About() {
  const postData = Route.useLoaderData();
  return <Post postData={postData} />;
}
