import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import Post from "@/components/post";
import { BASE_TITLE } from "@/config/constants";
import { getAdjacentPostsFn, getPostDataFn } from "@/lib/posts.functions";

export const Route = createFileRoute("/$year/$month/$day/$slug")({
  beforeLoad: ({ params }) => {
    const paddedMonth = params.month.padStart(2, "0");
    const paddedDay = params.day.padStart(2, "0");
    if (params.month !== paddedMonth || params.day !== paddedDay) {
      throw redirect({
        to: "/$year/$month/$day/$slug",
        params: {
          year: params.year,
          month: paddedMonth,
          day: paddedDay,
          slug: params.slug,
        },
      });
    }
  },
  loader: async ({ params }) => {
    const paddedMonth = params.month.padStart(2, "0");
    const paddedDay = params.day.padStart(2, "0");
    const fullSlug = `/${params.year}/${paddedMonth}/${paddedDay}/${params.slug}`;
    const postData = await getPostDataFn({ data: { slug: fullSlug } });
    if (!postData) {
      throw notFound();
    }
    const adjacentPosts = await getAdjacentPostsFn({
      data: { slug: fullSlug },
    });
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
