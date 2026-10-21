import path from "node:path";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Plugin, ViteDevServer } from "vite";

import { rehypeCodeCopyButton } from "../src/lib/rehype/rehype-code-copy-button.ts";
import { rehypeHeadingAnchor } from "../src/lib/rehype/rehype-heading-anchor.ts";
import type { PostData } from "../src/lib/post-utils.ts";
import {
  POSTS_DIR,
  assertNoDuplicateSlugs,
  collectPostFiles,
  parsePostFile,
  sortPostsByDateDesc,
  toPostData,
} from "./post-shared.ts";

async function renderMarkdownDev(markdownBody: string): Promise<string> {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeCopyButton)
    .use(rehypeHeadingAnchor)
    .use(rehypeExternalLinks, { target: "_blank" })
    .use(rehypeStringify)
    .process(markdownBody);
  return processed.toString();
}

export async function buildLivePosts(): Promise<PostData[]> {
  const posts: PostData[] = [];
  for (const itemPath of collectPostFiles()) {
    const parsed = parsePostFile(itemPath);
    if (!parsed) {
      continue;
    }
    posts.push(toPostData(parsed, await renderMarkdownDev(parsed.markdownBody)));
  }
  assertNoDuplicateSlugs(posts);
  return sortPostsByDateDesc(posts);
}

const VIRTUAL_ID = "virtual:live-posts";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

export function livePosts(): Plugin {
  let server: ViteDevServer | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const reload = (file: string) => {
    if (!server || !file.endsWith(".md")) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      console.log(`[live-posts] ${file} changed, updating loaders`);
      const mod = server?.moduleGraph.getModuleById(RESOLVED_ID);
      if (mod && server) {
        void server.reloadModule(mod).finally(() => {
          server?.ws.send({ type: "custom", event: "live-posts:update" });
        });
      } else {
        server?.ws.send({ type: "custom", event: "live-posts:update" });
      }
    }, 150);
  };

  return {
    name: "live-posts",
    enforce: "pre",
    apply: "serve",
    resolveId(source, importer) {
      if (
        importer?.endsWith(path.join("src", "lib", "posts.ts")) &&
        (source.includes("generated/posts.json") ||
          source.includes("generated\\posts.json"))
      ) {
        return RESOLVED_ID;
      }
      return null;
    },
    async load(id) {
      if (id !== RESOLVED_ID) {
        return null;
      }
      const filePaths = collectPostFiles();
      for (const itemPath of filePaths) {
        this.addWatchFile(itemPath);
      }
      const posts: PostData[] = [];
      for (const itemPath of filePaths) {
        const parsed = parsePostFile(itemPath);
        if (!parsed) {
          continue;
        }
        posts.push(
          toPostData(parsed, await renderMarkdownDev(parsed.markdownBody))
        );
      }
      assertNoDuplicateSlugs(posts);
      return `export default ${JSON.stringify(sortPostsByDateDesc(posts))};`;
    },
    configureServer(devServer) {
      server = devServer;
      devServer.watcher.add(POSTS_DIR);
      devServer.watcher.on("add", reload);
      devServer.watcher.on("change", reload);
      devServer.watcher.on("unlink", reload);
      console.log(`[live-posts] watching ${POSTS_DIR}`);
    },
  };
}
