import generatedPosts from "../generated/posts.json";

import {
  collectUrls as collectUrlsFromSource,
  getAdjacentPosts as getAdjacentPostsFromSource,
  getAllPostInfo as getAllPostInfoFromSource,
  getDaysWithCount as getDaysWithCountFromSource,
  getMonthsWithCount as getMonthsWithCountFromSource,
  getPostByFilePath as getPostByFilePathFromSource,
  getPostData as getPostDataFromSource,
  getPostsByDate as getPostsByDateFromSource,
  getYearsWithCount as getYearsWithCountFromSource,
} from "./post-utils";
import type {
  AdjacentPost,
  AllPostInfo,
  Frontmatter,
  PostData,
  PostInfo,
} from "./post-utils";

export type {
  AdjacentPost,
  AllPostInfo,
  Frontmatter,
  PostData,
  PostInfo,
};

const allPostData = generatedPosts as PostData[];

export function getAllPostInfo(
  { includeHidden = false }: { includeHidden?: boolean } = {},
  source: PostData[] = allPostData
): AllPostInfo {
  return getAllPostInfoFromSource({ includeHidden }, source);
}

export function getPostData(
  { slug }: { slug: string },
  source: PostData[] = allPostData
): PostData | null {
  return getPostDataFromSource({ slug }, source);
}

export function getPostByFilePath(
  filePath: string,
  source: PostData[] = allPostData
): PostData | null {
  return getPostByFilePathFromSource(filePath, source);
}

export function getAdjacentPosts(
  slug: string,
  { includeHidden = false }: { includeHidden?: boolean } = {},
  source: PostData[] = allPostData
): {
  previousPost: AdjacentPost | null;
  nextPost: AdjacentPost | null;
} {
  return getAdjacentPostsFromSource(slug, { includeHidden }, source);
}

export function getPostsByDate(
  year?: number,
  month?: number,
  day?: number,
  source: PostData[] = allPostData
): AllPostInfo {
  return getPostsByDateFromSource(year, month, day, source);
}

export function getYearsWithCount(
  source: PostData[] = allPostData
): { year: number; count: number }[] {
  return getYearsWithCountFromSource(source);
}

export function getMonthsWithCount(
  year: number,
  source: PostData[] = allPostData
): { month: number; count: number }[] {
  return getMonthsWithCountFromSource(year, source);
}

export function getDaysWithCount(
  year: number,
  month: number,
  source: PostData[] = allPostData
): { day: number; count: number }[] {
  return getDaysWithCountFromSource(year, month, source);
}

export function collectUrls(source: PostData[] = allPostData): string[] {
  return collectUrlsFromSource(source);
}
