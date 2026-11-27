// Builds docs/REVIEW_PACKET.md from the files in content/, so the packet always matches what the app shows.
// Usage: node scripts/review-packet.mjs          writes the file
//        node scripts/review-packet.mjs --check  fails if the file is out of date (used by the tests)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const root = new URL('../', import.meta.url);
const out = new URL('docs/REVIEW_PACKET.md', root);

const read = (dir) =>
  readdirSync(new URL(`content/${dir}/`, root))
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(readFileSync(new URL(`content/${dir}/${f}`, root), 'utf8')));

const cell = (s) => String(s ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const row = (...cells) => `| ${cells.map(cell).join(' | ')} |`;
const table = (rows) => ['| Where | Claim | Source | Checked | What the source says |', '| --- | --- | --- | --- | --- |', ...rows].join('\n');

export function buildPacket() {
  const help = read('help').sort((a, b) => a.order - b.order);
  const checklist = read('checklist');
  const letters = read('letters');

  const helpRows = help.flatMap((p) =>
    p.official.map((c) => row(`Help: ${p.title} (/help/${p.slug})`, c.text, c.source, c.lastChecked, c.confirms)),
  );
  const checklistRows = checklist
    .filter((i) => i.official)
    .map((i) => row(`Checklist: ${i.title}`, i.official, i.source, i.lastChecked, i.confirms));
  const letterRows = letters.flatMap((l) =>
    (l.sources ?? []).map((s) => row(`Letter: ${l.title} (${l.id})`, l.about, s.url, l.lastChecked, s.confirms)),
  );

  const sourceNeeded = [
    ...help.flatMap((p) => p.sourceNeeded.map((s) => `- Help: ${p.title}. ${s} (left out of the page)`)),
    ...checklist.filter((i) => !i.source).map((i) => `- Checklist: ${i.title}. No official page found yet; the app shows "Source needed".`),
    ...letters.filter((l) => !l.sources).map((l) => `- Letter: ${l.title}. ${l.sourceNote}`),
  ];
  const suggestions = [
    ...help.flatMap((p) => p.suggestions.map((s) => `- Help: ${p.title}. ${s}`)),
    ...checklist.filter((i) => i.suggestion).map((i) => `- Checklist: ${i.title}. ${i.suggestion}`),
  ];
  const notes = help.filter((p) => p.note).map((p) => `- Help: ${p.title}. ${p.note}`);
  const lawyer = help.flatMap((p) => [`**${p.title}**`, '', ...p.lawyer.map((s) => `- ${s}`), '']);
  const urls = [...new Set([...help.flatMap((p) => p.official.map((c) => c.source)), ...checklist.map((i) => i.source), ...letters.flatMap((l) => (l.sources ?? []).map((s) => s.url))].filter(Boolean))].sort();

  return `# EyesClose: review packet

This file is made by \`npm run review-packet\` from the files in \`content/\`. Do not edit it by hand.

## What EyesClose is

EyesClose is a free website for families in India after a death. A family member answers about ten questions.
The site then shows a checklist of what to close or claim, who to contact, and a link to each official page.
It also makes three letters to print, and has pages for harder situations.

Answers stay on the phone. Nothing typed is sent to us or stored.

## What it does not do

- It is general information, not legal advice.
- It does not say who inherits what. Those rules differ by religion and by state.
- It does not contact anyone or file anything for the family.
- A letter goes with the institution's own form. It does not replace it.
- Nothing has been checked by a CA or lawyer yet. Every item shows "Not yet checked by a professional".

## What we ask you

1. Is anything here wrong?
2. Is anything missing that would mislead a family?
3. Are the "When to talk to a lawyer" notes right?

Each row below is one claim as it appears in the app, with the official page it comes from and the date we
checked that page. "What the source says" is our note of the source's own words. Please mark any row you disagree with.

## Factual claims

### Harder situations pages (${helpRows.length} claims)

${table(helpRows)}

### Checklist items (${checklistRows.length} claims from ${checklist.length} items)

${table(checklistRows)}

### Letters (${letters.length} letters)

${table(letterRows)}

### Notes shown with the official points

${notes.join('\n')}

## Source needed

These were not confirmed from an official page, so they are not stated as fact in the app.

${sourceNeeded.join('\n')}

## Our suggestions

These are marked in the app as our own suggestion, not from an official page.

${suggestions.join('\n')}

## When to talk to a lawyer

${lawyer.join('\n').trimEnd()}

## Every official source used

${urls.map((u) => `- ${u}`).join('\n')}
`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const text = buildPacket();
  if (process.argv.includes('--check')) {
    if (readFileSync(out, 'utf8').replaceAll('\r\n', '\n') !== text) {
      console.error('docs/REVIEW_PACKET.md is out of date. Run: npm run review-packet');
      process.exit(1);
    }
  } else {
    writeFileSync(out, text);
    console.log('Wrote docs/REVIEW_PACKET.md');
  }
}
