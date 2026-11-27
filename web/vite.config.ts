/// <reference types="vitest/config" />
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { parseHelpPages } from './src/features/help/schema';
import { helpIndexBody, helpIndexHead, helpPageBody, helpPageHead } from './src/features/help/render';

interface VercelConfig {
  headers: { headers: { key: string; value: string }[] }[];
  rewrites: { source: string; destination: string }[];
}
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as VercelConfig;
const productionHeaders = Object.fromEntries(vercel.headers[0]!.headers.map((h) => [h.key, h.value]));

/**
 * The public address used in canonical links, share tags, robots.txt and the sitemap.
 * SITE_URL wins; on Vercel the production domain comes from VERCEL_PROJECT_PRODUCTION_URL.
 */
const SITE_URL = (
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4173')
).replace(/\/$/, '');

/** The help pages, read and checked at build time. A file with a missing source, date or reviewer fails the build. */
const helpDir = new URL('../content/help/', import.meta.url);
export const helpPages = parseHelpPages(
  readdirSync(helpDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(new URL(f, helpDir), 'utf8')) as unknown),
);

/** The real pages, for the sitemap. The 404 page is left out on purpose. */
export const PAGES = ['/', '/start', '/data', '/help', ...helpPages.map((p) => `/help/${p.slug}`)];

/** Fills the /help page shells (web/help/index.html and web/help/<slug>/index.html) from content/help. */
function helpFiles(): Plugin {
  return {
    name: 'eyesclose-help-pages',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const match = /^\/help\/(?:([a-z0-9-]+)\/)?index\.html$/.exec(ctx.path);
        if (!match) return html;
        const page = match[1] ? helpPages.find((p) => p.slug === match[1]) : null;
        if (match[1] && !page) throw new Error(`No content/help file for ${ctx.path}`);
        return html
          .replace('<!--help-head-->', page ? helpPageHead(page) : helpIndexHead())
          .replace('<!--help-body-->', page ? helpPageBody(page) : helpIndexBody(helpPages));
      },
    },
  };
}

function siteFiles(): Plugin {
  return {
    name: 'eyesclose-site-files',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL).replaceAll('%YEAR%', String(new Date().getFullYear())),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      });
      const urls = PAGES.map((p) => `  <url><loc>${SITE_URL}${p === '/' ? '/' : p}</loc></url>`).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

/** Matches the two rewrite shapes vercel.json uses: an exact path, or a prefix ending in "/:path*". */
function rewriteFor(url: string): string | null {
  const path = url.split('?')[0]!;
  for (const r of vercel.rewrites) {
    const prefix = r.source.endsWith('/:path*') ? r.source.slice(0, -'/:path*'.length) : null;
    if (path === r.source || (prefix !== null && (path === prefix || path.startsWith(`${prefix}/`)))) return r.destination;
  }
  return null;
}

/**
 * `vite preview` routes like Vercel: the same rewrites, and 404.html for anything else.
 * The dev server gets the same rewrites (not the CSP, which would block Vite's dev scripts), so /start, /data
 * and /help work in `npm run dev` too.
 */
function vercelRouting(): Plugin {
  return {
    name: 'eyesclose-vercel-routing',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const target = rewriteFor(req.url ?? '/');
        if (target) req.url = target;
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        for (const [key, value] of Object.entries(productionHeaders)) res.setHeader(key, value);
        const path = req.url?.split('?')[0] ?? '/';
        const target = rewriteFor(path);
        // Like Vercel: rewrites first, then a folder's index.html.
        if (target) req.url = target;
        else if (path.endsWith('/')) req.url = `${path}index.html`;
        next();
      });
      return () => {
        server.middlewares.use((_req, res) => {
          const notFound = readFileSync(resolve(server.config.root, server.config.build.outDir, '404.html'));
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(notFound);
        });
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), helpFiles(), siteFiles(), vercelRouting()],
  appType: 'mpa',
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      // The landing, data, help and 404 pages are plain HTML and CSS. Only /start loads the app's JavaScript.
      input: {
        landing: resolve(import.meta.dirname, 'index.html'),
        start: resolve(import.meta.dirname, 'start/index.html'),
        data: resolve(import.meta.dirname, 'data/index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
        help: resolve(import.meta.dirname, 'help/index.html'),
        ...Object.fromEntries(helpPages.map((p) => [`help-${p.slug}`, resolve(import.meta.dirname, 'help', p.slug, 'index.html')])),
      },
    },
  },
  // Checklist and letter content lives in ../content and is bundled at build time.
  server: { fs: { allow: ['..'] } },
  // `vite preview` sends the same security headers as production (vercel.json), so the CSP is tested locally.
  preview: { headers: productionHeaders },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
