import {
  getDaysWithCount,
  getMonthsWithCount,
  getYearsWithCount,
  getAllPostInfo,
} from "../src/lib/posts";
import type { PostData } from "../src/lib/posts";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function collectUrls(source?: PostData[]): string[] {
  const urls = new Set<string>(["/", "/about", "/years"]);
  for (const { year } of getYearsWithCount(source)) {
    urls.add(`/${year}`);
    urls.add(`/${year}/months`);
    for (const { month } of getMonthsWithCount(year, source)) {
      const paddedMonth = pad(month);
      urls.add(`/${year}/${paddedMonth}`);
      urls.add(`/${year}/${paddedMonth}/days`);
      for (const { day } of getDaysWithCount(year, month, source)) {
        urls.add(`/${year}/${paddedMonth}/${pad(day)}`);
      }
    }
  }
  for (const post of getAllPostInfo({}, source)) {
    urls.add(post.slug);
  }
  return [...urls];
}
