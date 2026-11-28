import { lastCheckedOf, type HelpPage } from './schema';

// Builds the static /help pages at build time. The output is plain HTML and CSS: no script, no form.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const esc = (s: string) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

/** "2026-11-27" becomes "27 November 2026". */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m! - 1]} ${y}`;
}

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

function head(title: string, description: string, path: string): string {
  const t = esc(title);
  const d = esc(description);
  return `<title>${t} | EyesClose</title>
    <meta name="description" content="${d}" />
    <meta name="referrer" content="no-referrer" />
    <meta name="theme-color" content="#ecebe7" />
    <link rel="canonical" href="%SITE_URL%${path}" />
    <link rel="icon" href="data:," />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="EyesClose" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:url" content="%SITE_URL%${path}" />
    <meta property="og:image" content="%SITE_URL%/og-image.png" />
    <meta property="og:image:alt" content="EyesClose. What to close after someone dies, and in what order." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="%SITE_URL%/og-image.png" />`;
}

const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="arrow size-5 shrink-0"><path d="M5 12h14M13 6l6 6-6 6" /></svg>`;

/** The header of the plain pages other than home: name and the main action. */
export const siteHeader = `<a href="#main" class="skip-link">Skip to the main content</a>
    <header class="border-b border-line-strong bg-paper gutter">
      <div class="mx-auto flex h-16 w-full max-w-300 items-center justify-between gap-3">
        <a href="/" class="inline-flex min-h-11 items-center rounded-control text-base font-medium tracking-heading">EyesClose</a>
        <a href="/start" class="press inline-flex min-h-11 items-center justify-center rounded-control bg-ink px-4 text-sm font-medium text-surface hover:bg-ink/85 sm:px-6">Start the checklist</a>
      </div>
    </header>`;

// Placeholders the build replaces on every plain page (see helpFiles() in vite.config.ts).
export const FOOTER_MARK = '<!--site-footer-->';
export const CARDS_MARK = '<!--help-cards-->';

/** One card per help page, for the home page. The whole card is the link. */
export function helpCards(pages: HelpPage[]): string {
  return pages
    .map(
      (p) => `<li>
            <a href="/help/${p.slug}" class="card-link press group flex h-full min-h-13 items-start gap-4 rounded-card border border-line-strong bg-paper p-5 sm:p-6">
              <span class="flex flex-1 flex-col gap-2">
                <span class="text-lg font-medium leading-snug">${esc(p.title)}</span>
                <span class="text-ink-soft">${esc(p.description)}</span>
              </span>
              ${arrow}
            </a>
          </li>`,
    )
    .join('');
}

/** The tall black footer of the plain pages, with every help page by name. */
export function siteFooter(pages: HelpPage[]): string {
  const link = (href: string, text: string) => `<li><a href="${href}" class="footer-dark-link">${esc(text)}</a></li>`;
  return `<footer class="site-footer bg-paper-dark gutter pb-10 pt-16 text-surface lg:pb-16 lg:pt-24">
      <div class="mx-auto flex w-full max-w-300 flex-col gap-12 lg:gap-16">
        <div class="flex flex-col gap-6 border-b border-line-dark pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pb-16">
          <p class="max-w-2xl text-section tracking-heading text-balance">Start with the steps for the first 7 days.</p>
          <a href="/start" class="footer-cta press inline-flex min-h-13 shrink-0 items-center justify-center gap-2 self-start rounded-control bg-surface px-8 text-lg font-medium text-ink lg:self-auto">Start the checklist ${arrow}</a>
        </div>
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.5fr_1.2fr] lg:gap-12">
          <div class="flex flex-col gap-3">
            <p class="text-xl font-medium tracking-heading">EyesClose</p>
            <p class="max-w-xs text-ink-on-dark-soft">A free checklist of what to close after a family member dies in India, and who to contact.</p>
          </div>
          <nav aria-labelledby="footer-product" class="flex flex-col gap-3">
            <h2 id="footer-product" class="text-sm font-medium tracking-normal text-ink-on-dark-soft">Product</h2>
            <ul class="footer-list">${link('/#how', 'How it works')}${link('/#today', 'What you get')}${link('/#faq', 'FAQ')}</ul>
          </nav>
          <nav aria-labelledby="footer-help" class="flex flex-col gap-3">
            <h2 id="footer-help" class="text-sm font-medium tracking-normal text-ink-on-dark-soft">Help</h2>
            <ul class="footer-list">${link('/help', 'Harder situations')}${pages.map((p) => link(`/help/${p.slug}`, p.title)).join('')}</ul>
          </nav>
          <div class="flex flex-col gap-3">
            <h2 class="text-sm font-medium tracking-normal text-ink-on-dark-soft">About</h2>
            <ul class="footer-list">${link('/data', 'How we handle your data')}</ul>
            <p class="max-w-xs text-sm text-ink-on-dark-soft">This is general information, not legal advice.</p>
          </div>
        </div>
        <p class="border-t border-line-dark pt-8 text-sm text-ink-on-dark-soft">&copy; %YEAR% EyesClose</p>
      </div>
    </footer>`;
}

const list = (items: string[]) =>
  `<ul class="flex list-disc flex-col gap-3 pl-5 marker:text-ink-soft">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

export function helpPageHead(page: HelpPage): string {
  return head(page.title, page.description, `/help/${page.slug}`);
}

export function helpPageBody(page: HelpPage): string {
  const checked = longDate(lastCheckedOf(page));
  const claims = page.official
    .map(
      (c) => `<li class="flex flex-col gap-1 rounded-card border border-line-strong bg-surface p-4">
            <p>${esc(c.text)}</p>
            <a href="${esc(c.source)}" rel="noopener noreferrer" class="inline-flex min-h-11 items-center self-start rounded-control text-sm font-medium text-ink-soft underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink">Source: ${esc(host(c.source))}</a>
          </li>`,
    )
    .join('');
  const verified = page.official.every((c) => c.verifiedBy !== null);
  return `${siteHeader}
    <main id="main" class="mx-auto flex w-full max-w-2xl flex-col gap-10 gutter pb-16 pt-8 sm:pt-12">
      <div class="flex flex-col gap-4">
        <a href="/help" class="inline-flex min-h-11 items-center self-start rounded-control text-sm text-ink-soft underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink">All harder situations</a>
        <h1 class="text-title text-balance">${esc(page.title)}</h1>
        <p class="text-lg">${esc(page.opening)}</p>
        <p class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          ${verified ? '' : '<span class="rounded-control bg-tint px-3 py-1">Not yet checked by a professional</span>'}
          <span class="text-ink-soft">Sources checked on ${checked}</span>
        </p>
      </div>

      <section aria-labelledby="official" class="flex flex-col gap-4">
        <h2 id="official" class="text-2xl">What the official sources say</h2>
        <ul class="flex flex-col gap-3">${claims}</ul>
        ${page.note ? `<p class="text-sm text-ink-soft">${esc(page.note)}</p>` : ''}
      </section>

      <section aria-labelledby="next" class="flex flex-col gap-3 rounded-card bg-tint p-5">
        <h2 id="next" class="text-2xl">What families often do next</h2>
        <p class="text-sm font-medium text-ink-soft">Our suggestion, not from an official page</p>
        ${list(page.suggestions)}
      </section>

      <section aria-labelledby="lawyer" class="flex flex-col gap-3">
        <h2 id="lawyer" class="text-2xl">When to talk to a lawyer</h2>
        <p>It can help to talk to a lawyer when:</p>
        ${list(page.lawyer)}
      </section>

      <div class="flex flex-col gap-3 border-t border-line-strong pt-6">
        <a href="/start" class="press inline-flex min-h-13 items-center justify-center rounded-control bg-ink px-8 text-lg font-medium text-surface hover:bg-ink/85 sm:self-start">Start a new checklist</a>
        <p class="text-sm text-ink-soft">If you came from your checklist, close this tab to go back to it.</p>
        <p class="text-sm text-ink-soft">This is general information, not legal advice.</p>
      </div>
    </main>
    ${FOOTER_MARK}`;
}

export function helpIndexHead(): string {
  return head('Harder situations', 'What official sources say when the usual steps do not fit: no death certificate, no nominee, no will, a joint account, a death abroad, or a police case.', '/help');
}

export function helpIndexBody(pages: HelpPage[]): string {
  const rows = pages
    .map(
      (p) => `<li>
            <a href="/help/${p.slug}" class="card-link press flex min-h-13 flex-col gap-1 rounded-card border border-line-strong bg-surface p-4">
              <span class="font-medium underline decoration-ink/30 underline-offset-4">${esc(p.title)}</span>
              <span class="text-sm text-ink-soft">${esc(p.description)}</span>
            </a>
          </li>`,
    )
    .join('');
  return `${siteHeader}
    <main id="main" class="mx-auto flex w-full max-w-2xl flex-col gap-8 gutter pb-16 pt-8 sm:pt-12">
      <div class="flex flex-col gap-4">
        <h1 class="text-title text-balance">Harder situations</h1>
        <p class="text-lg">Some families do not fit the usual steps. These pages say what official sources say about each case, and when a lawyer can help.</p>
        <p class="text-sm text-ink-soft">This is general information, not legal advice.${
          pages.some((p) => p.official.some((c) => c.verifiedBy === null)) ? ' Not yet checked by a professional.' : ''
        }</p>
      </div>
      <ul class="flex flex-col gap-3">${rows}</ul>
      <a href="/start" class="press inline-flex min-h-13 items-center justify-center rounded-control bg-ink px-8 text-lg font-medium text-surface hover:bg-ink/85 sm:self-start">Start a new checklist</a>
      <p class="-mt-4 text-sm text-ink-soft">If you came from your checklist, close this tab to go back to it.</p>
    </main>
    ${FOOTER_MARK}`;
}
