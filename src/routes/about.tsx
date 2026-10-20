import { createFileRoute, notFound } from "@tanstack/react-router";

import Post from "@/components/post";
import { BASE_TITLE } from "@/config/constants";
import { getPostByFilePath } from "@/lib/posts";

const ABOUT_FILE_PATH = "关于.md";

export const Route = createFileRoute("/about")({
  loader: () => {
    const postData = getPostByFilePath(ABOUT_FILE_PATH);
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
