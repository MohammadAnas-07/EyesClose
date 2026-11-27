import { z } from 'zod';
import { requiredNameSchema } from '../form/answers';
import { SUBJECT_KEYS } from './subjects';

export const DATE_ERROR = 'Please choose a date.';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Reads YYYY-MM-DD (what a date input gives) as a real calendar date, or null. */
function parseIsoDate(value: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const check = new Date(Date.UTC(y, m - 1, d));
  return check.getUTCMonth() === m - 1 && check.getUTCDate() === d && y >= 1900 && y <= 2100 ? { y, m, d } : null;
}

/** "2026-11-27" becomes "27 November 2026". Fixed English months, so the PDF font can always draw it. */
export function formatDate(iso: string): string {
  const p = parseIsoDate(iso);
  if (!p) throw new Error('Invalid date');
  return `${p.d} ${MONTHS[p.m - 1]} ${p.y}`;
}

/** Today's date on this device as YYYY-MM-DD. */
export function todayIso(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** The only details typed into the app for a letter. Everything else is written by hand after printing. */
export const SUBJECT_ERROR = 'Please choose what the letter is about.';

/**
 * The only details typed into the app for a letter. Everything else is written by hand after printing.
 * institution and subject are typed only for the general letter; other letters take the institution from content.
 */
export const letterDetailsSchema = z.object({
  deceasedName: requiredNameSchema,
  writerName: requiredNameSchema,
  date: z.string({ error: DATE_ERROR }).refine((v) => parseIsoDate(v) !== null, { error: DATE_ERROR }),
  institution: requiredNameSchema.optional(),
  subject: z.enum(SUBJECT_KEYS, { error: SUBJECT_ERROR }).optional(),
});
const typedInstitutionSchema = letterDetailsSchema.required({ institution: true, subject: true });

export type LetterDetails = z.infer<typeof letterDetailsSchema>;
export type LetterDetailKey = keyof LetterDetails;
export type LetterDraft = Partial<Record<LetterDetailKey, string>>;

export function validateLetterField(key: LetterDetailKey, value: unknown): string | null {
  const result = typedInstitutionSchema.shape[key].safeParse(value ?? '');
  return result.success ? null : (result.error.issues[0]?.message ?? DATE_ERROR);
}

/** Checks the typed details. typedInstitution: the letter asks the user for the institution and the subject. */
export function validateLetterDetails(
  draft: LetterDraft,
  typedInstitution = false,
): { ok: true; details: LetterDetails } | { ok: false; errors: Partial<Record<LetterDetailKey, string>> } {
  const { deceasedName = '', writerName = '', date = '', institution = '', subject } = draft;
  const result = typedInstitution
    ? typedInstitutionSchema.safeParse({ deceasedName, writerName, date, institution, subject })
    : letterDetailsSchema.safeParse({ deceasedName, writerName, date });
  if (result.success) return { ok: true, details: result.data };
  const errors: Partial<Record<LetterDetailKey, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as LetterDetailKey;
    errors[key] ??= issue.message;
  }
  return { ok: false, errors };
}
