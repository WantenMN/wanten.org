import type { MetadataRoute } from "next";
import { getAllPostInfo, getPostData } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.wanten.org";
  const posts = getAllPostInfo(); // Await posts retrieval

  const urls = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...(await Promise.all(
      posts.map(async (post) => {
        const postData = await getPostData({
          prefixDir: post.prefix,
          id: post.id,
        });

        const lastModified = postData?.time
          ? (() => {
              const [datePart, timePart] = postData.time.split(" ");
              const [year, month, day] = datePart.split("-").map(Number);
              const [hours, minutes] = timePart.split(":").map(Number);
              return new Date(year, month - 1, day, hours, minutes);
            })()
          : new Date(); // Fallback to current date if time is missing

        return {
          url: `${baseUrl}/${post.prefix ? post.prefix + "/" : ""}${post.id}`,
          lastModified,
        };
      })
    )),
  ];

  return urls;
}
