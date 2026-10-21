import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type { PostData } from "../src/lib/post-utils.ts";

export const POSTS_DIR = path.join(process.cwd(), "posts");

export interface ParsedPost {
  date: string;
  hidden?: boolean;
  id: string;
  filePath: string;
  slug: string;
  title: string;
  markdownBody: string;
}

function extractTitleFromFilename(filePath: string): string {
  return path.basename(filePath, ".md");
}

function slugFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `/${year}/${month}/${day}/${hour}${minute}`;
}

export function collectPostFiles(directory: string = POSTS_DIR): string[] {
  const filePaths: string[] = [];
  const collect = (dir: string) => {
    for (const item of fs.readdirSync(dir)) {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        collect(itemPath);
      } else if (item.endsWith(".md")) {
        filePaths.push(itemPath);
      }
    }
  };
  collect(directory);
  return filePaths;
}

export function parsePostFile(itemPath: string): ParsedPost | null {
  const fileContents = fs.readFileSync(itemPath, "utf8");
  const matterResult = matter(fileContents);
  const data = matterResult.data as { date?: string; hidden?: boolean };
  if (!data.date) {
    return null;
  }
  const date = new Date(data.date);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date "${data.date}" in ${itemPath}`);
  }
  const title = extractTitleFromFilename(itemPath);
  let markdownBody = matterResult.content.trim();
  const h1Match = markdownBody.match(/^#\s+(.+)$/m);
  if (h1Match && h1Match[1].trim() === title) {
    markdownBody = markdownBody.replace(/^#\s+.+$/m, "").trim();
  }
  return {
    date: data.date,
    hidden: data.hidden,
    id: path.basename(itemPath, ".md"),
    filePath: path.relative(POSTS_DIR, itemPath),
    slug: slugFromDate(date),
    title,
    markdownBody,
  };
}

export function toPostData(
  parsed: ParsedPost,
  contentHtml: string
): PostData {
  return {
    date: parsed.date,
    hidden: parsed.hidden,
    id: parsed.id,
    filePath: parsed.filePath,
    slug: parsed.slug,
    title: parsed.title,
    contentHtml,
  };
}

export function assertNoDuplicateSlugs(posts: { slug: string; filePath: string; date: string }[]): void {
  const seenSlugs = new Map<string, string>();
  for (const post of posts) {
    const existing = seenSlugs.get(post.slug);
    if (existing) {
      throw new Error(
        `Duplicate slug "${post.slug}" from date "${post.date}": ${existing} and ${post.filePath}. Posts sharing the same minute collide; adjust the date to be unique.`
      );
    }
    seenSlugs.set(post.slug, post.filePath);
  }
}

export function sortPostsByDateDesc<T extends { date: string }>(posts: T[]): T[] {
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
