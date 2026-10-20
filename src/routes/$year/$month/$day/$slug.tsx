import { createFileRoute, notFound } from "@tanstack/react-router";

import Post from "@/components/post";
import { BASE_TITLE } from "@/config/constants";
import { getAdjacentPosts, getPostData } from "@/lib/posts";

export const Route = createFileRoute("/$year/$month/$day/$slug")({
  loader: ({ params }) => {
    if (
      !/^\d{2}$/.test(params.month) ||
      !/^\d{2}$/.test(params.day) ||
      !/^\d{4}$/.test(params.slug)
    ) {
      throw notFound();
    }
    const fullSlug = `/${params.year}/${params.month}/${params.day}/${params.slug}`;
    const postData = getPostData({ slug: fullSlug });
    if (!postData) {
      throw notFound();
    }
    const adjacentPosts = getAdjacentPosts(fullSlug);
    return { postData, adjacentPosts };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.postData.title} - ${BASE_TITLE}`
          : BASE_TITLE,
      },
    ],
  }),
  component: SlugPage,
});

function SlugPage() {
  const { postData, adjacentPosts } = Route.useLoaderData();
  return <Post postData={postData} adjacentPosts={adjacentPosts} />;
}
