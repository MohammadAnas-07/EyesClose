import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Answers } from '../form/answers';
import { helpPages, helpRowsFor } from './content';
import { helpIndexBody, helpPageBody, longDate } from './render';
import { lastCheckedOf, parseHelpPages } from './schema';

// Tests run from web/, so the repo root is one level up.
const repo = (p: string) => resolve(process.cwd(), '..', p);
const raw = readdirSync(repo('content/help')).map((f) => JSON.parse(readFileSync(repo(`content/help/${f}`), 'utf8')) as Record<string, unknown>);
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const base: Answers = {
  name: '',
  relationship: 'son',
  deathCertificate: 'yes',
  banks: ['sbi'],
  jointAccount: 'no',
  nominee: 'yes',
  will: 'yes',
  mobile: ['vi'],
  upi: ['none'],
  work: ['neither'],
  lifeInsurance: 'no',
  healthInsurance: 'no',
  vehicleInsurance: 'no',
  loans: 'no',
  emailSocial: 'no',
  subscriptions: 'no',
  crypto: 'no',
};
const order = (over: Partial<Answers>) => helpRowsFor({ ...base, ...over }).map((r) => `${r.relevant ? '*' : ''}${r.page.slug}`);

describe('help content', () => {
  it('has the six pages, in order', () => {
    expect(helpPages.map((p) => p.slug)).toEqual([
      'no-death-certificate',
      'no-nominee',
      'legal-heir-and-succession',
      'joint-account',
      'death-abroad',
      'police-case',
    ]);
  });

  it('gives every claim a source, a date checked and verifiedBy, and fails when one is missing', () => {
    for (const page of helpPages) {
      for (const claim of page.official) {
        expect(claim.source, page.slug).toMatch(/^https:\/\//);
        expect(claim.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(claim).toHaveProperty('verifiedBy');
      }
    }
    const one = structuredClone(raw[0]!) as { official: Record<string, unknown>[] };
    for (const key of ['source', 'lastChecked', 'verifiedBy']) {
      const broken = structuredClone(one);
      delete broken.official[0]![key];
      expect(() => parseHelpPages([broken]), key).toThrow();
    }
    expect(() => parseHelpPages([{ ...one, official: [{ ...one.official[0], source: 'http://example.com' }] }])).toThrow();
  });

  it('has no Hindi or Devanagari, and only plain Latin text on screen', () => {
    for (const file of readdirSync(repo('content/help'))) expect(readFileSync(repo(`content/help/${file}`), 'utf8')).not.toMatch(/[ऀ-ॿ]/);
    // Printable ASCII only, once whitespace is removed.
    for (const page of helpPages) expect(helpPageBody(page).replace(/\s/g, '')).toMatch(/^[!-~]*$/);
  });

  it('shows "Not yet checked by a professional" and the date checked on every page', () => {
    for (const page of helpPages) {
      const body = helpPageBody(page);
      expect(body).toContain('Not yet checked by a professional');
      expect(body).toContain(`Sources checked on ${longDate(lastCheckedOf(page))}`);
      expect(body).toContain('This is general information, not legal advice.');
      expect(body).toContain('When to talk to a lawyer');
      expect(body).toContain('Our suggestion, not from an official page');
      expect(body).toContain('href="/start"');
    }
  });

  it('keeps each page under about 400 words of main text', () => {
    for (const page of helpPages) {
      const main = /<main[\s\S]*<\/main>/.exec(helpPageBody(page))![0];
      expect(text(main).split(' ').length, page.slug).toBeLessThan(450);
    }
  });

  it('escapes content and opens sources without a referrer', () => {
    const page = { ...helpPages[0]!, title: '<script>x</script>' };
    expect(helpPageBody(page)).not.toContain('<script>');
    for (const p of helpPages) {
      for (const a of helpPageBody(p).match(/<a href="https:[^>]+>/g) ?? []) expect(a).toContain('rel="noopener noreferrer"');
    }
  });

  it('lists all six pages on /help', () => {
    const body = helpIndexBody(helpPages);
    for (const p of helpPages) expect(body).toContain(`href="/help/${p.slug}"`);
  });

  it('has a page shell and a Vercel rewrite for every page, and none extra', () => {
    const shells = readdirSync(repo('web/help'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    expect(shells.sort()).toEqual(helpPages.map((p) => p.slug).sort());
    for (const p of helpPages) expect(existsSync(repo(`web/help/${p.slug}/index.html`))).toBe(true);
    const vercel = JSON.parse(readFileSync(repo('vercel.json'), 'utf8')) as { rewrites: { source: string; destination: string }[] };
    const help = vercel.rewrites.filter((r) => r.source.startsWith('/help'));
    expect(help).toEqual([
      { source: '/help', destination: '/help/index.html' },
      ...helpPages.map((p) => ({ source: `/help/${p.slug}`, destination: `/help/${p.slug}/index.html` })),
    ]);
  });
});

describe('"If your situation is harder" order', () => {
  it('no death certificate: that page first', () => {
    expect(order({ deathCertificate: 'not-yet' })[0]).toBe('*no-death-certificate');
    expect(order({ deathCertificate: 'waiting' })[0]).toBe('*no-death-certificate');
  });

  it('joint account: that page first, the rest in order', () => {
    expect(order({ jointAccount: 'yes' })).toEqual([
      '*joint-account',
      'no-death-certificate',
      'no-nominee',
      'legal-heir-and-succession',
      'death-abroad',
      'police-case',
    ]);
  });

  it('several matches keep the content order among themselves', () => {
    expect(order({ jointAccount: 'yes', nominee: 'no', will: 'no', deathCertificate: 'not-yet' }).slice(0, 4)).toEqual([
      '*no-death-certificate',
      '*no-nominee',
      '*legal-heir-and-succession',
      '*joint-account',
    ]);
  });

  it('nothing relevant: all six in content order, none marked', () => {
    expect(order({})).toEqual(helpPages.map((p) => p.slug));
    // "Not sure" is not a clear match.
    expect(order({ jointAccount: 'not-sure', nominee: 'not-sure', will: 'not-sure', deathCertificate: 'not-sure' })).toEqual(
      helpPages.map((p) => p.slug),
    );
  });

  it('death abroad and police case are never pushed up: the form has no question for them', () => {
    expect(Object.keys(base)).not.toEqual(expect.arrayContaining(['abroad']));
    expect(order({ jointAccount: 'yes' }).slice(-2)).toEqual(['death-abroad', 'police-case']);
  });
});
