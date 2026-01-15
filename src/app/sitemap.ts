import type { MetadataRoute } from "next";
import { getAllPostInfo } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.wanten.org";
  const posts = getAllPostInfo({ includeHidden: true });

  const urls = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/${post.path}`,
      lastModified: new Date(post.date),
    })),
  ];

  return urls;
}
