import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const postsDirectory = path.join(process.cwd(), "posts");

export interface Frontmatter {
  title: string;
  desc: string;
  date: string;
  tags: string[];
  path: string;
  hidden?: boolean;
}

export interface PostInfo extends Frontmatter {
  id: string;
  filePath: string;
  slug: string;
}

export interface PostData extends Frontmatter {
  contentHtml: string;
  id: string;
  filePath: string;
  slug: string;
}

export type AllPostInfo = PostInfo[];

export function getAllPostInfo({
  includeHidden = false,
}: {
  includeHidden?: boolean;
} = {}): AllPostInfo {
  const allPosts: AllPostInfo = [];

  const getPostsFromDir = (directory: string) => {
    const items = fs.readdirSync(directory);

    items.forEach((item) => {
      const itemPath = path.join(directory, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        getPostsFromDir(itemPath);
      } else if (item.endsWith(".md")) {
        const fileContents = fs.readFileSync(itemPath, "utf8");
        const matterResult = matter(fileContents);
        const data = matterResult.data as Frontmatter;
        if (data.path && (includeHidden || !data.hidden)) {
          const date = new Date(data.date);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const slug = `/${year}/${month}/${day}/${data.path}`;
          allPosts.push({
            ...data,
            id: item.replace(/\.md$/, ""),
            filePath: path.relative(postsDirectory, itemPath),
            slug,
          });
        }
      }
    });
  };

  getPostsFromDir(postsDirectory);

  return allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostData({
  slug,
}: {
  slug: string;
}): Promise<PostData | null> {
  const allPosts = getAllPostInfo({ includeHidden: true });
  const postInfo = allPosts.find((p) => p.slug === slug);
  if (!postInfo) {
    return null;
  }
  const fullPath = path.join(postsDirectory, postInfo.filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: "vitesse-light",
    })
    .use(rehypeExternalLinks, { target: "_blank" })
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    ...postInfo,
    contentHtml,
  };
}

export function getPostsByDate(
  year?: number,
  month?: number,
  day?: number
): AllPostInfo {
  const allPosts = getAllPostInfo({ includeHidden: false });
  return allPosts.filter((post) => {
    const postDate = new Date(post.date);
    if (year && postDate.getFullYear() !== year) {
      return false;
    }
    if (month && postDate.getMonth() + 1 !== month) {
      return false;
    }
    if (day && postDate.getDate() !== day) {
      return false;
    }
    return true;
  });
}

export function getPostsByTag(tag: string): AllPostInfo {
  const allPosts = getAllPostInfo({ includeHidden: false });
  return allPosts.filter((post) => post.tags && post.tags.includes(tag));
}

export function getAllTags(): { tag: string; count: number }[] {
  const allPosts = getAllPostInfo({ includeHidden: false });
  const tagCounts: Record<string, number> = {};
  allPosts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getYearsWithCount(): { year: number; count: number }[] {
  const allPosts = getAllPostInfo({ includeHidden: false });
  const yearCounts: Record<number, number> = {};
  allPosts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => b.year - a.year);
}

export function getMonthsWithCount(
  year: number
): { month: number; count: number }[] {
  const allPosts = getAllPostInfo({ includeHidden: false });
  const monthCounts: Record<number, number> = {};
  allPosts.forEach((post) => {
    const postDate = new Date(post.date);
    const postYear = postDate.getFullYear();
    const postMonth = postDate.getMonth() + 1;
    if (postYear === year) {
      monthCounts[postMonth] = (monthCounts[postMonth] || 0) + 1;
    }
  });
  return Object.entries(monthCounts)
    .map(([month, count]) => ({ month: parseInt(month), count }))
    .sort((a, b) => b.month - a.month);
}

export function getDaysWithCount(
  year: number,
  month: number
): { day: number; count: number }[] {
  const allPosts = getAllPostInfo({ includeHidden: false });
  const dayCounts: Record<number, number> = {};
  allPosts.forEach((post) => {
    const postDate = new Date(post.date);
    const postYear = postDate.getFullYear();
    const postMonth = postDate.getMonth() + 1;
    const postDay = postDate.getDate();
    if (postYear === year && postMonth === month) {
      dayCounts[postDay] = (dayCounts[postDay] || 0) + 1;
    }
  });
  return Object.entries(dayCounts)
    .map(([day, count]) => ({ day: parseInt(day), count }))
    .sort((a, b) => b.day - a.day);
}
