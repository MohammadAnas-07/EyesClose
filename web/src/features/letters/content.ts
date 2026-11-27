import { z } from 'zod';
import { checklistItems } from '../form/content';
import { TOKENS, tokensIn } from './template';

const text = z
  .string()
  .min(1)
  .max(300)
  .refine((t) => tokensIn(t).every((name) => (TOKENS as readonly string[]).includes(name)), {
    error: `Only these placeholders are allowed: ${TOKENS.join(', ')}.`,
  });

const block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text, bold: z.boolean().optional() }).strict(),
  z.object({ type: z.literal('field'), label: z.string().min(1).max(60) }).strict(),
  z.object({ type: z.literal('ticks'), label: z.string().min(1).max(60), options: z.array(z.string().min(1).max(20)).min(2) }).strict(),
  z.object({ type: z.literal('list'), title: z.string().min(1).max(60), items: z.array(text).min(1) }).strict(),
  z.object({ type: z.literal('gap') }).strict(),
  z.object({ type: z.literal('signature') }).strict(),
]);

/** Shape of one file in content/letters/. */
export const letterSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    version: z.number().int().positive(),
    title: z.string().min(1).max(60),
    about: z.string().min(1).max(300),
    fileName: z.string().regex(/^eyesclose-[a-z0-9-]+\.pdf$/),
    takeWith: z.string().min(1).max(80),
    /** Where to ask for the form in person, for example "the branch". */
    askAt: z.string().min(1).max(40),
    sources: z.array(z.object({ url: z.url({ protocol: /^https$/ }), confirms: z.string().min(1).max(200) }).strict()).min(1),
    lastChecked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    verifiedBy: z.string().min(1).nullable(),
    appliesTo: z.array(z.object({ item: z.string().min(1), institution: z.string().min(1).nullable() }).strict()).min(1),
    letter: z.array(block).min(1),
  })
  .strict();

export type Letter = z.infer<typeof letterSchema>;
export type LetterBlock = Letter['letter'][number];

// Bundled at build time, like the checklist. Nothing is fetched.
const files = import.meta.glob('../../../../content/letters/*.json', { eager: true, import: 'default' });

export const letters = z.array(letterSchema).parse(Object.values(files));

export interface LetterChoice {
  letter: Letter;
  institution: string | null;
  /** The official link from the checked checklist item, used to say where the form is. */
  formUrl: string | null;
}

/** The letter offered for a checklist item, if any. */
export function letterForItem(itemId: string): LetterChoice | null {
  for (const letter of letters) {
    const match = letter.appliesTo.find((a) => a.item === itemId);
    if (!match) continue;
    // When the bank is not known ("Another bank"), the item's link is general (RBI), not that bank's form page.
    const formUrl = match.institution ? (checklistItems.find((i) => i.id === itemId)?.source ?? null) : null;
    return { letter, institution: match.institution, formUrl };
  }
  return null;
}
