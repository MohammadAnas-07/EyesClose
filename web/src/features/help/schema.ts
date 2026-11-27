import { z } from 'zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
// Shown on screen: plain English in Latin letters only (no Devanagari, no symbols the reader may not know).
const shown = (max: number) =>
  z
    .string()
    .min(1)
    .max(max)
    .regex(/^[\x20-\x7E]+$/, { error: 'Use plain English letters and punctuation only.' });

/** One sentence from an official page. Every claim carries its own source, the date it was checked and the reviewer. */
export const helpClaimSchema = z
  .object({
    text: shown(300),
    source: z.url({ protocol: /^https$/ }),
    // What the source page itself says, recorded when it was read. Used in the review packet, not on screen.
    confirms: z.string().min(1).max(400),
    lastChecked: date,
    verifiedBy: z.string().min(1).nullable(),
  })
  .strict();

/** Shape of one file in content/help/. official: only what sources say. suggestions: our own advice. */
export const helpPageSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    version: z.number().int().positive(),
    order: z.number().int().positive(),
    title: shown(60),
    description: shown(120),
    opening: shown(200),
    official: z.array(helpClaimSchema).min(1),
    // Shown under the official points when a source needs a caveat, for example where its text came from.
    note: shown(300).optional(),
    suggestions: z.array(shown(200)).max(4),
    lawyer: z.array(shown(200)).min(1),
    // Claims we could not confirm from an official page. Not shown on the page; listed in the review packet.
    sourceNeeded: z.array(z.string().min(1)),
  })
  .strict();

export type HelpClaim = z.infer<typeof helpClaimSchema>;
export type HelpPage = z.infer<typeof helpPageSchema>;

/** Parses every help file and sorts by order. Throws (and so fails the build) if any file is incomplete. */
export function parseHelpPages(files: unknown[]): HelpPage[] {
  const pages = z.array(helpPageSchema).parse(files);
  const slugs = new Set(pages.map((p) => p.slug));
  if (slugs.size !== pages.length) throw new Error('Two help pages share a slug.');
  return pages.sort((a, b) => a.order - b.order);
}

/** The latest date any claim on the page was checked. */
export function lastCheckedOf(page: HelpPage): string {
  return page.official.map((c) => c.lastChecked).sort().at(-1)!;
}
