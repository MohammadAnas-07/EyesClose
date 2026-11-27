// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, createServer, preview, type PreviewServer } from 'vite';
import { PAGES } from '../vite.config';

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
  it('serves the landing page at / with only our menu script and the production CSP', async () => {
    const page = await get('/');
    expect(page.status).toBe(200);
    expect(title(page.body)).toMatch(/^EyesClose: what to close after someone dies/);
    expect(page.body.match(/<script[^>]*>/gi)).toEqual(['<script src="/menu.js" defer>']);
    expect(page.body).toContain('<script src="/menu.js" defer></script>');
    expect(page.csp).toContain("default-src 'none'");
    expect(page.csp).toContain("script-src 'self';");
  });

  it('serves menu.js from our origin, small, and unable to read storage or send anything', async () => {
    const res = await fetch(`${base}/menu.js`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/javascript/);
    const code = await res.text();
    expect(code.split('\n').length).toBeLessThan(25);
    expect(code).not.toMatch(/fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|localStorage|sessionStorage|indexedDB|cookie|innerHTML|import\(|\.value\b|location/);
  });

  it('serves /help and each help page as plain HTML with the CSP, and a friendly 404 for unknown slugs', async () => {
    for (const path of ['/help', ...PAGES.filter((p) => p.startsWith('/help/'))]) {
      const page = await get(path);
      expect(page.status, path).toBe(200);
      expect(page.body, path).not.toMatch(/<script/i);
      expect(page.body, path).toMatch(/<meta property="og:title" content="[^"]+"/);
      expect(page.body, path).toContain('This is general information, not legal advice.');
      expect(page.csp).toContain("default-src 'none'");
    }
    expect(PAGES.filter((p) => p.startsWith('/help/'))).toHaveLength(6);
    expect(title((await get('/help/no-nominee')).body)).toBe('If there is no nominee | EyesClose');
    const missing = await get('/help/not-a-real-page');
    expect(missing.status).toBe(404);
    expect(title(missing.body)).toBe('Page not found | EyesClose');
  });

  it('keeps docs/REVIEW_PACKET.md in step with content/', () => {
    expect(() => execFileSync(process.execPath, ['../scripts/review-packet.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow();
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
    expect(body).toContain('href="/help"');
    for (const id of anchors) expect(body, id).toContain(`id="${id}"`);
  });

  it('makes the landing page load only files from our own origin', async () => {
    for (const path of ['/', '/data', '/help', '/help/no-nominee', '/does-not-exist']) {
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
    for (const path of PAGES) expect(sitemap).toContain(`${path}</loc>`);
    expect((await fetch(`${base}/og-image.png`)).headers.get('content-type')).toBe('image/png');
  });

  it('has no broken links between our own pages', async () => {
    for (const path of ['/', '/data', '/help', ...PAGES.filter((p) => p.startsWith('/help/')), '/does-not-exist']) {
      const links = [...(await get(path)).body.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/g)].map((m) => m[1]!);
      for (const link of new Set(links)) expect((await get(link)).status, `${path} -> ${link}`).toBe(200);
    }
  });
});

describe('the dev server (npm run dev)', () => {
  it('serves /start, /data and the help pages without a trailing slash, like production', async () => {
    const dev = await createServer({ root, configFile, logLevel: 'silent', server: { port: 0 } });
    await dev.listen();
    try {
      const url = dev.resolvedUrls!.local[0]!.replace(/\/$/, '');
      for (const [path, name] of [
        ['/start', 'Start the checklist | EyesClose'],
        ['/start/some/old/link', 'Start the checklist | EyesClose'],
        ['/data', 'How we handle your data | EyesClose'],
        ['/help', 'Harder situations | EyesClose'],
        ['/help/no-nominee', 'If there is no nominee | EyesClose'],
      ]) {
        const res = await fetch(url + path);
        expect(res.status, path).toBe(200);
        expect(title(await res.text()), path).toBe(name);
      }
    } finally {
      await dev.close();
    }
  }, 60_000);
});
