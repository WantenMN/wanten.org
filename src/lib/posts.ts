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

export interface PostData {
  contentHtml: string;
  title: string;
  desc: string;
  cat: string;
  time: string;
}

export type AllPostInfo = Array<
  Exclude<PostData, "contentHtml"> & {
    id: string;
    prefix: string;
  }
>;

export function getAllPostInfo({
  suffixDir = "",
}: {
  suffixDir?: string;
} = {}): AllPostInfo {
  const fullPath = suffixDir
    ? path.join(postsDirectory, suffixDir)
    : postsDirectory;
  const allPosts: AllPostInfo = [];

  const getPostsFromDir = (directory: string, prefix: string) => {
    const items = fs.readdirSync(directory);

    items.forEach((item) => {
      const itemPath = path.join(directory, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        getPostsFromDir(itemPath, item);
      } else if (item.endsWith(".md")) {
        const fileContents = fs.readFileSync(itemPath, "utf8");
        const matterResult = matter(fileContents);
        allPosts.push({
          id: item.replace(/\.md$/, ""),
          prefix,
          ...(matterResult.data as Exclude<PostData, "contentHtml">),
        });
      }
    });
  };

  getPostsFromDir(fullPath, suffixDir);

  return allPosts.sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
}

export async function getPostData({
  prefixDir = "",
  id,
}: {
  prefixDir?: string;
  id: string;
}) {
  const fullPath = path.join(postsDirectory, prefixDir, `${id}.md`);
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
    ...(matterResult.data as Exclude<PostData, "contentHtml">),
    contentHtml,
  };
}
