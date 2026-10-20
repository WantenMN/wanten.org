import { createFileRoute } from "@tanstack/react-router";

import { getAllPostInfo } from "@/lib/posts";

const BASE_URL = "https://www.wanten.org";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = getAllPostInfo({ includeHidden: true });

        const urls = [
          {
            loc: BASE_URL,
            lastmod: new Date().toISOString(),
          },
          ...posts.map((post) => ({
            loc: `${BASE_URL}${post.slug}`,
            lastmod: new Date(post.date).toISOString(),
          })),
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml",
          },
        });
      },
    },
  },
});
