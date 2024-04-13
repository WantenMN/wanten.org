import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src/posts");

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
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    ...(matterResult.data as Exclude<PostData, "contentHtml">),
    contentHtml,
  };
}
