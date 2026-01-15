import { NextResponse } from "next/server";
import { getAllPostInfo } from "@/lib/posts";
import { BASE_TITLE, BASE_DESC } from "@/config/constants";

const SITE_URL = process.env.SITE_URL || "https://wanten.org";

export async function GET() {
  const posts = getAllPostInfo();

  const rssItems = posts
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      return `
    <item>
      <title>${post.title}</title>
      <description>${post.desc}</description>
      <link>${SITE_URL}${post.slug}</link>
      <guid>${SITE_URL}${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>
    `;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BASE_TITLE}</title>
    <description>${BASE_DESC}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
