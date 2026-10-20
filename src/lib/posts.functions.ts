import { createServerFn } from "@tanstack/react-start";

import {
  getAdjacentPosts,
  getAllPostInfo,
  getDaysWithCount,
  getMonthsWithCount,
  getPostData,
  getPostsByDate,
  getYearsWithCount,
} from "./posts";

export const getAllPostInfoFn = createServerFn({ method: "GET" })
  .validator((data: { includeHidden?: boolean }) => data)
  .handler(async ({ data }) => getAllPostInfo(data));

export const getPostDataFn = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => getPostData(data));

export const getPostsByDateFn = createServerFn({ method: "GET" })
  .validator((data: { year?: number; month?: number; day?: number }) => data)
  .handler(async ({ data }) => getPostsByDate(data.year, data.month, data.day));

export const getAdjacentPostsFn = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => getAdjacentPosts(data.slug));

export const getYearsWithCountFn = createServerFn({ method: "GET" })
  .validator(() => ({}))
  .handler(async () => getYearsWithCount());

export const getMonthsWithCountFn = createServerFn({ method: "GET" })
  .validator((data: { year: number }) => data)
  .handler(async ({ data }) => getMonthsWithCount(data.year));

export const getDaysWithCountFn = createServerFn({ method: "GET" })
  .validator((data: { year: number; month: number }) => data)
  .handler(async ({ data }) => getDaysWithCount(data.year, data.month));
