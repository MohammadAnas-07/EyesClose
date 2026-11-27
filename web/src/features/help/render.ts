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
    <meta name="theme-color" content="#f5f5f5" />
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

const header = `<a href="#main" class="skip-link">Skip to the main content</a>
    <header class="border-b border-line-strong bg-paper">
      <div class="mx-auto flex h-16 w-full max-w-300 items-center justify-between gap-3 px-5 sm:px-8">
        <a href="/" class="rounded-md text-base font-semibold tracking-heading">EyesClose</a>
        <a href="/start" class="inline-flex min-h-11 items-center justify-center rounded-pill bg-ink px-4 text-sm font-medium text-surface hover:bg-ink/85 sm:px-6">Start the checklist</a>
      </div>
    </header>`;

const footer = `<footer class="border-t border-line-strong bg-surface px-5 py-12 text-sm sm:px-8">
      <div class="mx-auto grid w-full max-w-300 gap-8 md:grid-cols-[2fr_1fr_1fr]">
        <div class="flex flex-col gap-2">
          <p class="text-base font-semibold tracking-heading">EyesClose</p>
          <p class="max-w-sm text-ink-soft">A free checklist of what to close after a family member dies in India, and who to contact.</p>
        </div>
        <nav aria-label="Footer">
          <ul class="flex flex-col gap-2">
            <li><a href="/" class="footer-link">Home</a></li>
            <li><a href="/help" class="footer-link">Harder situations</a></li>
            <li><a href="/data" class="footer-link">How we handle your data</a></li>
          </ul>
        </nav>
        <div class="flex flex-col gap-2 text-ink-soft">
          <p>This is general information, not legal advice.</p>
          <p>&copy; %YEAR% EyesClose</p>
        </div>
      </div>
    </footer>`;

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
            <a href="${esc(c.source)}" rel="noopener noreferrer" class="self-start rounded-md text-sm font-medium text-ink-soft underline decoration-ink/30 underline-offset-4 hover:text-ink">Source: ${esc(host(c.source))}</a>
          </li>`,
    )
    .join('');
  const verified = page.official.every((c) => c.verifiedBy !== null);
  return `${header}
    <main id="main" class="mx-auto flex w-full max-w-2xl flex-col gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
      <div class="flex flex-col gap-4">
        <a href="/help" class="self-start rounded-md text-sm text-ink-soft underline decoration-ink/30 underline-offset-4 hover:text-ink">All harder situations</a>
        <h1 class="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] text-balance">${esc(page.title)}</h1>
        <p class="text-lg">${esc(page.opening)}</p>
        <p class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          ${verified ? '' : '<span class="rounded-pill bg-tint px-3 py-1">Not yet checked by a professional</span>'}
          <span class="text-ink-soft">Sources checked on ${checked}</span>
        </p>
      </div>

      <section aria-labelledby="official" class="flex flex-col gap-4">
        <h2 id="official" class="text-xl">What the official sources say</h2>
        <ul class="flex flex-col gap-3">${claims}</ul>
        ${page.note ? `<p class="text-sm text-ink-soft">${esc(page.note)}</p>` : ''}
      </section>

      <section aria-labelledby="next" class="flex flex-col gap-3 rounded-card bg-tint p-5">
        <h2 id="next" class="text-xl">What families often do next</h2>
        <p class="text-sm font-medium text-ink-soft">Our suggestion, not from an official page</p>
        ${list(page.suggestions)}
      </section>

      <section aria-labelledby="lawyer" class="flex flex-col gap-3">
        <h2 id="lawyer" class="text-xl">When to talk to a lawyer</h2>
        <p>It can help to talk to a lawyer when:</p>
        ${list(page.lawyer)}
      </section>

      <div class="flex flex-col gap-3 border-t border-line-strong pt-6">
        <a href="/start" class="inline-flex min-h-13 items-center justify-center rounded-pill bg-ink px-8 text-lg font-medium text-surface hover:bg-ink/85 sm:self-start">Start a new checklist</a>
        <p class="text-sm text-ink-soft">If you came from your checklist, close this tab to go back to it.</p>
        <p class="text-sm text-ink-soft">This is general information, not legal advice.</p>
      </div>
    </main>
    ${footer}`;
}

export function helpIndexHead(): string {
  return head('Harder situations', 'What official sources say when the usual steps do not fit: no death certificate, no nominee, no will, a joint account, a death abroad, or a police case.', '/help');
}

export function helpIndexBody(pages: HelpPage[]): string {
  const rows = pages
    .map(
      (p) => `<li>
            <a href="/help/${p.slug}" class="flex min-h-13 flex-col gap-1 rounded-card border border-line-strong bg-surface p-4 hover:bg-tint">
              <span class="font-medium underline decoration-ink/30 underline-offset-4">${esc(p.title)}</span>
              <span class="text-sm text-ink-soft">${esc(p.description)}</span>
            </a>
          </li>`,
    )
    .join('');
  return `${header}
    <main id="main" class="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
      <div class="flex flex-col gap-4">
        <h1 class="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] text-balance">Harder situations</h1>
        <p class="text-lg">Some families do not fit the usual steps. These pages say what official sources say about each case, and when a lawyer can help.</p>
        <p class="text-sm text-ink-soft">This is general information, not legal advice.${
          pages.some((p) => p.official.some((c) => c.verifiedBy === null)) ? ' Not yet checked by a professional.' : ''
        }</p>
      </div>
      <ul class="flex flex-col gap-3">${rows}</ul>
      <a href="/start" class="inline-flex min-h-13 items-center justify-center rounded-pill bg-ink px-8 text-lg font-medium text-surface hover:bg-ink/85 sm:self-start">Start a new checklist</a>
      <p class="-mt-4 text-sm text-ink-soft">If you came from your checklist, close this tab to go back to it.</p>
    </main>
    ${footer}`;
}
