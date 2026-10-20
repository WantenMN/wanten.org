import fs from "node:fs";
import path from "node:path";
import {
  createRequestHandler,
  defaultRenderHandler,
} from "@tanstack/react-router/ssr/server";

import { getRouter } from "../src/router";
import { collectUrls } from "./urls";

const SITE_URL = "https://www.wanten.org";
const DIST_DIR = path.join(process.cwd(), "dist");
const MANIFEST_PATH = path.join(DIST_DIR, ".vite", "manifest.json");

interface ViteManifestChunk {
  file: string;
  css?: string[];
  imports?: string[];
  isEntry?: boolean;
}

function collectEntryAssets(): { js: string[]; css: string[] } {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Record<
    string,
    ViteManifestChunk
  >;
  const js: string[] = [];
  const css: string[] = [];
  const visited = new Set<string>();

  const visit = (key: string) => {
    if (visited.has(key)) {
      return;
    }
    visited.add(key);
    const chunk = manifest[key];
    if (!chunk) {
      return;
    }
    js.push(`/${chunk.file}`);
    for (const style of chunk.css ?? []) {
      css.push(`/${style}`);
    }
    for (const imported of chunk.imports ?? []) {
      visit(imported);
    }
  };

  const entryKey = Object.keys(manifest).find(
    (key) => manifest[key].isEntry || key.endsWith("src/main.tsx")
  );
  if (!entryKey) {
    throw new Error(`No entry found in ${MANIFEST_PATH}`);
  }
  visit(entryKey);
  return { js, css };
}

function injectAssets(html: string, assets: { js: string[]; css: string[] }) {
  const cssTags = assets.css
    .map((href) => `<link rel="stylesheet" href="${href}">`)
    .join("\n");
  const jsTags = assets.js
    .map((src) => `<script type="module" src="${src}"></script>`)
    .join("\n");
  return html
    .replace("</head>", `${cssTags}</head>`)
    .replace("</body>", `${jsTags}</body>`);
}

function outputPath(urlPath: string): string {
  const relative =
    urlPath === "/" ? "index.html" : `${urlPath.slice(1)}/index.html`;
  return path.join(DIST_DIR, relative);
}

const assets = collectEntryAssets();
const urls = collectUrls();

for (const urlPath of urls) {
  const handler = createRequestHandler({
    createRouter: () => getRouter(),
    request: new Request(`${SITE_URL}${urlPath}`),
  });
  const response = await handler(defaultRenderHandler);
  if (response.status !== 200) {
    throw new Error(
      `Prerender ${urlPath} failed with status ${response.status}`
    );
  }
  const location = response.headers.get("location");
  if (location) {
    throw new Error(`Prerender ${urlPath} redirected to ${location}`);
  }
  const html = injectAssets(await response.text(), assets);
  const filePath = outputPath(urlPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
  console.log(
    `Prerendered ${urlPath} -> ${path.relative(process.cwd(), filePath)}`
  );
}
console.log(`Done. ${urls.length} pages.`);
