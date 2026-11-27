import { z } from 'zod';
import { checklistItems } from '../form/content';
import { SUBJECT_KEYS, type Subject } from './subjects';
import { TOKENS, tokensIn } from './template';

const text = z
  .string()
  .min(1)
  .max(300)
  .refine((t) => tokensIn(t).every((name) => (TOKENS as readonly string[]).includes(name)), {
    error: `Only these placeholders are allowed: ${TOKENS.join(', ')}.`,
  });
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text, bold: z.boolean().optional() }).strict(),
  z.object({ type: z.literal('field'), label: text }).strict(),
  z.object({ type: z.literal('ticks'), label: z.string().min(1).max(60), options: z.array(z.string().min(1).max(20)).min(2) }).strict(),
  z.object({ type: z.literal('list'), title: z.string().min(1).max(60), items: z.array(text).min(1) }).strict(),
  z.object({ type: z.literal('gap') }).strict(),
  z.object({ type: z.literal('signature') }).strict(),
]);

const common = {
  id: z.string().regex(/^[a-z0-9-]+$/),
  version: z.number().int().positive(),
  title: z.string().min(1).max(60),
  about: z.string().min(1).max(300),
  fileName: z.string().regex(/^eyesclose-[a-z0-9-]+\.pdf$/),
  verifiedBy: z.string().min(1).nullable(),
  letter: z.array(block).min(1),
};

/** Shape of one file in content/letters/. */
export const letterSchema = z.discriminatedUnion('kind', [
  // Goes with the institution's own form; every claim comes from an official page.
  z
    .object({
      ...common,
      kind: z.literal('with-form'),
      takeWith: z.string().min(1).max(80),
      /** Where to ask for the form in person, for example "the branch". */
      askAt: z.string().min(1).max(40),
      sources: z.array(z.object({ url: z.url({ protocol: /^https$/ }), confirms: z.string().min(1).max(200) }).strict()).min(1),
      lastChecked: date,
      appliesTo: z.array(z.object({ item: z.string().min(1), institution: z.string().min(1).nullable() }).strict()).min(1),
    })
    .strict(),
  // Only tells the institution about the death and asks what it needs. Names no form, rule, deadline or process.
  z
    .object({
      ...common,
      kind: z.literal('intimation'),
      sourceType: z.literal('general intimation, no process claimed'),
      sourceNote: z.string().min(1).max(400),
      written: date,
      appliesTo: z
        .array(
          z
            .object({ item: z.string().min(1), institution: z.string().min(1).nullable(), subject: z.enum(SUBJECT_KEYS) })
            .strict(),
        )
        .min(1),
    })
    .strict(),
]);

export type Letter = z.infer<typeof letterSchema>;
export type LetterBlock = Letter['letter'][number];

// Bundled at build time, like the checklist. Nothing is fetched.
const files = import.meta.glob('../../../../content/letters/*.json', { eager: true, import: 'default' });

export const letters = z.array(letterSchema).parse(Object.values(files));

export interface LetterChoice {
  letter: Letter;
  /** The institution named by content, or the suggested name for a general letter (editable there). */
  institution: string | null;
  /** The official link from the checked checklist item, used to say where the form is. */
  formUrl: string | null;
  /** For a general letter: what it is about, chosen from the checklist item. */
  subject: Subject | null;
}

/** The letter offered for a checklist item, if any. Each item has at most one. */
export function letterForItem(itemId: string): LetterChoice | null {
  for (const letter of letters) {
    if (letter.kind === 'intimation') {
      const match = letter.appliesTo.find((a) => a.item === itemId);
      if (match) return { letter, institution: match.institution, formUrl: null, subject: match.subject };
      continue;
    }
    const match = letter.appliesTo.find((a) => a.item === itemId);
    if (!match) continue;
    // When the bank is not known ("Another bank"), the item's link is general (RBI), not that bank's form page.
    const formUrl = match.institution ? (checklistItems.find((i) => i.id === itemId)?.source ?? null) : null;
    return { letter, institution: match.institution, formUrl, subject: null };
  }
  return null;
}
