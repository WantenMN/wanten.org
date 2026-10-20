export interface Frontmatter {
  date: string;
  hidden?: boolean;
}

export interface PostInfo extends Frontmatter {
  id: string;
  filePath: string;
  slug: string;
  title: string;
}

export interface PostData extends Frontmatter {
  contentHtml: string;
  id: string;
  filePath: string;
  slug: string;
  title: string;
}

export interface AdjacentPost {
  slug: string;
  title: string;
}

export type AllPostInfo = PostInfo[];

function toPostInfo(post: PostData): PostInfo {
  const { contentHtml: _contentHtml, ...info } = post;
  return info;
}

export function getAllPostInfo(
  { includeHidden = false }: { includeHidden?: boolean } = {},
  source: PostData[]
): AllPostInfo {
  return source.filter((post) => includeHidden || !post.hidden).map(toPostInfo);
}

export function getPostData(
  { slug }: { slug: string },
  source: PostData[]
): PostData | null {
  return source.find((post) => post.slug === slug) ?? null;
}

export function getPostByFilePath(
  filePath: string,
  source: PostData[]
): PostData | null {
  return source.find((post) => post.filePath === filePath) ?? null;
}

export function getAdjacentPosts(
  slug: string,
  { includeHidden = false }: { includeHidden?: boolean } = {},
  source: PostData[]
): {
  previousPost: AdjacentPost | null;
  nextPost: AdjacentPost | null;
} {
  const allPosts = getAllPostInfo({ includeHidden }, source);
  const currentIndex = allPosts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return {
      previousPost: null,
      nextPost: null,
    };
  }

  const previousPost = allPosts[currentIndex + 1]
    ? {
        slug: allPosts[currentIndex + 1].slug,
        title: allPosts[currentIndex + 1].title,
      }
    : null;

  const nextPost = allPosts[currentIndex - 1]
    ? {
        slug: allPosts[currentIndex - 1].slug,
        title: allPosts[currentIndex - 1].title,
      }
    : null;

  return {
    previousPost,
    nextPost,
  };
}

export function getPostsByDate(
  year?: number,
  month?: number,
  day?: number,
  source: PostData[] = []
): AllPostInfo {
  return getAllPostInfo({ includeHidden: false }, source).filter((post) => {
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

export function getYearsWithCount(
  source: PostData[]
): { year: number; count: number }[] {
  const yearCounts: Record<number, number> = {};
  getAllPostInfo({ includeHidden: false }, source).forEach((post) => {
    const year = new Date(post.date).getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => b.year - a.year);
}

export function getMonthsWithCount(
  year: number,
  source: PostData[]
): { month: number; count: number }[] {
  const monthCounts: Record<number, number> = {};
  getAllPostInfo({ includeHidden: false }, source).forEach((post) => {
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
  month: number,
  source: PostData[]
): { day: number; count: number }[] {
  const dayCounts: Record<number, number> = {};
  getAllPostInfo({ includeHidden: false }, source).forEach((post) => {
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

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function collectUrls(source: PostData[]): string[] {
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
