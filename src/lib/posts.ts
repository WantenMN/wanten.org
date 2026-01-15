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
}

export interface PostData extends Frontmatter {
  contentHtml: string;
  id: string;
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
          allPosts.push({
            ...data,
            id: item.replace(/\.md$/, ""),
            filePath: path.relative(postsDirectory, itemPath),
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

export async function getPostData({ path: postPath }: { path: string }) {
  const allPosts = getAllPostInfo({ includeHidden: true });
  const postInfo = allPosts.find((p) => p.path === postPath);
  if (!postInfo) {
    throw new Error(`Post with path ${postPath} not found`);
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
