import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeFormat from "rehype-format";
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
  }
>;

export function getAllPostInfo({
  suffixDir = "",
}: {
  suffixDir: string;
}): AllPostInfo {
  const fullPath = path.join(postsDirectory, suffixDir);
  const fileNames = fs.readdirSync(fullPath);

  return fileNames.map((fileName) => {
    const filePath = path.join(fullPath, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const matterResult = matter(fileContents);
    return {
      id: fileName.replace(/\.md$/, ""),
      ...(matterResult.data as Exclude<PostData, "contentHtml">),
    };
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
    .use(rehypeExternalLinks, { target: "_blank" })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    ...(matterResult.data as Exclude<PostData, "contentHtml">),
    contentHtml,
  };
}
