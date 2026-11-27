// @vitest-environment node
import { mkdtempSync, rmSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview, type PreviewServer } from 'vite';

// Builds the site and serves it with `vite preview`, which uses the same headers and rewrites as vercel.json.
const root = fileURLToPath(new URL('..', import.meta.url));
const configFile = resolve(root, 'vite.config.ts');
let outDir: string;
let server: PreviewServer;
let base: string;

beforeAll(async () => {
  outDir = mkdtempSync(join(tmpdir(), 'eyesclose-site-'));
  await build({ root, configFile, logLevel: 'silent', build: { outDir, emptyOutDir: true } });
  server = await preview({ root, configFile, logLevel: 'silent', build: { outDir }, preview: { port: 0, open: false } });
  base = `http://localhost:${(server.httpServer.address() as AddressInfo).port}`;
}, 120_000);

afterAll(async () => {
  await server?.close();
  rmSync(outDir, { recursive: true, force: true });
});

const get = async (path: string) => {
  const res = await fetch(base + path);
  return { status: res.status, csp: res.headers.get('content-security-policy'), body: await res.text() };
};
const title = (html: string) => /<title>([^<]*)<\/title>/.exec(html)?.[1];

/** Every URL the page itself would load: stylesheets, icons, scripts, images, preloads, and url() in its CSS. */
async function loadedUrls(html: string): Promise<string[]> {
  const urls = [
    ...[...html.matchAll(/<link\b[^>]*\brel="(?:stylesheet|icon|preload|modulepreload|manifest)"[^>]*\bhref="([^"]+)"/g)].map((m) => m[1]!),
    ...[...html.matchAll(/<(?:script|img|source|iframe)\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]!),
  ];
  for (const css of urls.filter((u) => u.endsWith('.css'))) {
    const text = await (await fetch(base + css)).text();
    urls.push(...[...text.matchAll(/url\(\s*["']?([^"')]+)/g)].map((m) => m[1]!));
  }
  return urls;
}

describe('the built site', () => {
  it('serves the landing page at / with no JavaScript and the production CSP', async () => {
    const page = await get('/');
    expect(page.status).toBe(200);
    expect(title(page.body)).toMatch(/^EyesClose: what to close after someone dies/);
    expect(page.body).not.toMatch(/<script/i);
    expect(page.csp).toContain("default-src 'none'");
  });

  it('has a main nav, a CSS-only phone menu, and a footer with the year and the legal line', async () => {
    const body = (await get('/')).body;
    expect(body).toMatch(/<nav aria-label="Main"[\s\S]*href="\/start"[\s\S]*<details class="nav-menu/);
    expect(body).not.toMatch(/\son[a-z]+=|style=/i);
    const footer = /<footer[\s\S]*<\/footer>/.exec(body)![0];
    expect(footer).toContain('This is general information, not legal advice.');
    expect(footer).toContain(`&copy; ${new Date().getFullYear()} EyesClose`);
    expect(footer).toContain('href="/data"');
    expect(footer).not.toMatch(/@|mailto:|tel:/);
  });

  it('points every in-page link at a section that exists', async () => {
    const body = (await get('/')).body;
    const anchors = new Set([...body.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1]!));
    expect(anchors).toEqual(new Set(['main', 'how', 'today', 'faq']));
    for (const id of anchors) expect(body, id).toContain(`id="${id}"`);
  });

  it('makes the landing page load only files from our own origin', async () => {
    for (const path of ['/', '/data', '/does-not-exist']) {
      const urls = await loadedUrls((await get(path)).body);
      expect(urls.length).toBeGreaterThan(0);
      for (const url of urls) expect(url, `${path} loads ${url}`).toMatch(/^(\/(?!\/)|\.\/|data:)/);
    }
  });

  it('loads the app at /start and anything under it', async () => {
    for (const path of ['/start', '/start/', '/start/some/old/link']) {
      const page = await get(path);
      expect(page.status, path).toBe(200);
      expect(page.body).toContain('<div id="root"></div>');
      expect(page.body).toMatch(/<script type="module" crossorigin src="\/assets\/start-[\w-]+\.js"><\/script>/);
    }
  });

  it('shows the calm 404 page, with the security headers, for unknown paths', async () => {
    const page = await get('/does-not-exist');
    expect(page.status).toBe(404);
    expect(title(page.body)).toBe('Page not found | EyesClose');
    expect(page.body).toContain('href="/"');
    expect(page.csp).toContain("default-src 'none'");
  });

  it('has a data page, robots.txt, a sitemap of the real pages and a share image', async () => {
    expect((await get('/data')).status).toBe(200);
    expect((await get('/robots.txt')).body).toContain('Sitemap: ');
    const sitemap = (await get('/sitemap.xml')).body;
    for (const path of ['/</loc>', '/start</loc>', '/data</loc>']) expect(sitemap).toContain(path);
    expect((await fetch(`${base}/og-image.png`)).headers.get('content-type')).toBe('image/png');
  });

  it('has no broken links between our own pages', async () => {
    for (const path of ['/', '/data', '/does-not-exist']) {
      const links = [...(await get(path)).body.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/g)].map((m) => m[1]!);
      for (const link of new Set(links)) expect((await get(link)).status, `${path} -> ${link}`).toBe(200);
    }
  });
});
