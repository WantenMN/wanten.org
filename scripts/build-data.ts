import fs from "node:fs";
import path from "node:path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { rehypeCodeCopyButton } from "../src/lib/rehype/rehype-code-copy-button";
import { rehypeHeadingAnchor } from "../src/lib/rehype/rehype-heading-anchor";
import type { PostData } from "../src/lib/post-utils";
import { collectUrls } from "./urls";
import {
  assertNoDuplicateSlugs,
  collectPostFiles,
  parsePostFile,
  sortPostsByDateDesc,
  toPostData,
} from "./post-shared";

const SITE_URL = "https://www.wanten.org";
const GENERATED_DIR = path.join(process.cwd(), "src", "generated");
const PUBLIC_DIR = path.join(process.cwd(), "public");

async function renderMarkdown(markdownBody: string): Promise<string> {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
      inline: "tailing-curly-colon",
    })
    .use(rehypeCodeCopyButton)
    .use(rehypeHeadingAnchor)
    .use(rehypeExternalLinks, { target: "_blank" })
    .use(rehypeStringify)
    .process(markdownBody);
  return processed.toString();
}

async function buildPosts(): Promise<PostData[]> {
  const filePaths = collectPostFiles();

  const posts: PostData[] = [];
  for (const itemPath of filePaths) {
    const parsed = parsePostFile(itemPath);
    if (!parsed) {
      continue;
    }
    const contentHtml = await renderMarkdown(parsed.markdownBody);
    posts.push(toPostData(parsed, contentHtml));
  }

  assertNoDuplicateSlugs(posts);

  return sortPostsByDateDesc(posts);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function latestDate(posts: PostData[]): Date {
  return new Date(
    Math.max(...posts.map((post) => new Date(post.date).getTime()))
  );
}

function buildRss(posts: PostData[]): string {
  const visible = posts.filter((post) => !post.hidden);
  const items = visible
    .map((post, index) => {
      const pubDate = new Date(post.date).toUTCString();
      // Latest 50 keep full content; older ones title only to bound file size.
      const description =
        index < 50
          ? `\n      <description>${escapeXml(post.contentHtml)}</description>`
          : "";
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}${post.slug}</link>
      <guid>${SITE_URL}${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>${description}
    </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wanten</title>
    <description>Wanten's personal website showcases his work and thoughts.</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <language>zh-CN</language>
    <lastBuildDate>${latestDate(posts).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function buildSitemap(urls: string[], posts: PostData[]): string {
  const dateBySlug = new Map(posts.map((post) => [post.slug, post.date]));
  const fallback = latestDate(posts).toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((urlPath) => {
    const loc = urlPath === "/" ? SITE_URL : `${SITE_URL}${urlPath}`;
    const lastmod = dateBySlug.has(urlPath)
      ? new Date(dateBySlug.get(urlPath) as string).toISOString()
      : fallback;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  })
  .join("\n")}
</urlset>
`;
}

const posts = await buildPosts();
const visiblePosts = posts.filter((post) => !post.hidden);
fs.mkdirSync(GENERATED_DIR, { recursive: true });
fs.writeFileSync(
  path.join(GENERATED_DIR, "posts.json"),
  `${JSON.stringify(posts, null, 2)}\n`
);
fs.writeFileSync(path.join(PUBLIC_DIR, "rss.xml"), buildRss(posts));
fs.writeFileSync(
  path.join(PUBLIC_DIR, "sitemap.xml"),
  buildSitemap(collectUrls(visiblePosts), posts)
);
console.log(`Generated ${posts.length} posts, rss.xml and sitemap.xml.`);
