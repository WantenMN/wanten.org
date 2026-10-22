# AGENTS.md

Personal site (wanten.org). Vite 8 + React 19 + TanStack Router (file-based) + Tailwind v4. Package manager: pnpm 10, Node 24.

## Commands

- `pnpm dev` — dev server on port 3000. Note: Vite 8 syntax is `vite dev`, not `vite`.
- `pnpm build` — runs `prebuild` (`tsx scripts/build-data.ts`) then `vite build`, then `tsx scripts/prerender.tsx`.
- `pnpm lint` / `pnpm format` — eslint / prettier. No test or typecheck scripts exist.

## Content pipeline (must know)

- Posts live in `posts/**/*.md`. Frontmatter `date` is required; files without it are silently skipped. `hidden: true` excludes a post from listings/RSS/sitemap.
- Slug is derived from `date` (`/YYYY/MM/DD/HHmm`). Two posts sharing the same minute collide — `assertNoDuplicateSlugs` throws.
- `scripts/build-data.ts` (build only) renders markdown with shiki and writes gitignored artifacts: `src/generated/posts.json`, `public/rss.xml`, `public/sitemap.xml`.
- `src/lib/posts.ts` imports `../generated/posts.json` but is a thin wrapper over `src/lib/post-utils.ts` (pure functions taking `PostData[]`, defaulting to generated data).
- Dev never touches `src/generated/`: `scripts/vite-live-posts.ts` intercepts the `generated/posts.json` import via `virtual:live-posts` and renders markdown **without shiki** for speed. Dev-only rendering difference is intentional.
- `resolveId` path matching must be slash-normalized (`replace(/\\/g, "/")`); `path.join` produces `\` on Windows and never matches Vite's `/`-style importer, which breaks first-run dev when `src/generated/` doesn't exist.

## Conventions

- Do not write code comments.

## Build / deploy

- `vite.config.ts` sets `build.manifest: true` because `scripts/prerender.tsx` reads `dist/.vite/manifest.json` to inject JS/CSS, then SSRs every URL from `collectUrls` into `dist/**/index.html`.
- CI (`.github/workflows/gh-pages.yml`): `pnpm build`, then `cp dist/index.html dist/404.html` as SPA fallback for deep links, deploys `dist/` to external repo `WantenMN/wantenmn.github.io`.
- `src/routeTree.gen.ts` is TanStack-generated and gitignored; routes live in `src/routes/`. Router factory is `getRouter()` in `src/router.tsx`, shared by client and prerender.
