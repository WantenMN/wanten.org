import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Post from "@/components/post";
import { BASE_TITLE } from "@/config/constants";
import { getAllPostInfo, getPostData } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPostInfo({ includeHidden: true }).map((post) => {
    const [year, month, day, slugPath] = post.slug.split("/").slice(1);
    return {
      year,
      month,
      day,
      slug: slugPath,
    };
  });
}

const Page = async ({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string; slug: string }>;
}) => {
  const { year, month, day, slug } = await params;
  const paddedMonth = month.padStart(2, "0");
  const paddedDay = day.padStart(2, "0");
  if (month !== paddedMonth || day !== paddedDay) {
    redirect(`/${year}/${paddedMonth}/${paddedDay}/${slug}`);
  }
  const fullSlug = `/${year}/${paddedMonth}/${paddedDay}/${slug}`;
  const postData = await getPostData({
    slug: fullSlug,
  });
  if (!postData) {
    notFound();
  }
  return <Post postData={postData} />;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string; slug: string }>;
}): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const paddedMonth = month.padStart(2, "0");
  const paddedDay = day.padStart(2, "0");
  if (month !== paddedMonth || day !== paddedDay) {
    redirect(`/${year}/${paddedMonth}/${paddedDay}/${slug}`);
  }
  const fullSlug = `/${year}/${paddedMonth}/${paddedDay}/${slug}`;
  const postData = await getPostData({
    slug: fullSlug,
  });
  if (!postData) {
    notFound();
  }
  return {
    title: `${postData.title} - ${BASE_TITLE}`,
    description: postData.desc,
  };
}

export default Page;
