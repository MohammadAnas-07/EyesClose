import { z } from 'zod';

// Answer values. Labels live in questions.ts; these are the stored values.
export const RELATIONSHIPS = ['son', 'daughter', 'husband', 'wife', 'parent', 'sibling', 'other'] as const;
export const CERTIFICATE = ['yes', 'waiting', 'not-yet', 'not-sure'] as const;
export const BANKS = ['sbi', 'hdfc', 'icici', 'axis', 'pnb', 'bob', 'kotak', 'canara', 'other', 'not-sure', 'none'] as const;
export const MOBILE = ['jio', 'airtel', 'vi', 'bsnl', 'other', 'not-sure'] as const;
export const UPI = ['phonepe', 'gpay', 'paytm', 'other', 'none', 'not-sure'] as const;
export const WORK = ['epfo', 'pension', 'neither', 'not-sure'] as const;
export const TRI = ['yes', 'no', 'not-sure'] as const;

/** Name rule from prd.md: pdf-lib's built-in Helvetica can only draw these characters. */
export const NAME_PATTERN = /^[A-Za-z .'-]+$/;
export const NAME_MAX = 80;
export const NAME_ERROR = 'Please type the name using English letters (A to Z) only. For example: Sunita Sharma.';
export const NAME_TOO_LONG = `Please keep the name to ${NAME_MAX} letters or fewer.`;
export const NAME_REQUIRED = 'Please type the name. The letter needs it.';
export const CHOOSE_ERROR = 'Please choose an answer. If you do not know, choose "Not sure".';

const tri = z.enum(TRI, { error: CHOOSE_ERROR });
const many = <T extends readonly [string, ...string[]]>(values: T) =>
  z.array(z.enum(values), { error: CHOOSE_ERROR }).min(1, { error: CHOOSE_ERROR });

export const nameSchema = z
  .string()
  .trim()
  .max(NAME_MAX, { error: NAME_TOO_LONG })
  .refine((v) => v === '' || (NAME_PATTERN.test(v) && /[A-Za-z]/.test(v)), { error: NAME_ERROR });

/** Where a letter is made, the name cannot be left blank. */
export const requiredNameSchema = nameSchema.refine((v) => v !== '', { error: NAME_REQUIRED });

export const answersSchema = z.object({
  name: nameSchema,
  relationship: z.enum([...RELATIONSHIPS, 'not-sure'], { error: CHOOSE_ERROR }),
  deathCertificate: z.enum(CERTIFICATE, { error: CHOOSE_ERROR }),
  banks: many(BANKS),
  jointAccount: tri,
  nominee: tri,
  will: tri,
  mobile: many(MOBILE),
  upi: many(UPI),
  work: many(WORK),
  lifeInsurance: tri,
  healthInsurance: tri,
  vehicleInsurance: tri,
  loans: tri,
  emailSocial: tri,
  subscriptions: tri,
  crypto: tri,
});

export type Answers = z.infer<typeof answersSchema>;
export type AnswerKey = keyof Answers;
export type Draft = Partial<Answers>;
export const ANSWER_KEYS = Object.keys(answersSchema.shape) as AnswerKey[];

/** Returns the error message for one field, or null when the value is fine. */
export function validateField(key: AnswerKey, value: unknown): string | null {
  const result = answersSchema.shape[key].safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? CHOOSE_ERROR);
}

/**
 * Toggles a value in a multi-choice answer. "None" and "Not sure" stand alone:
 * picking one clears the rest, and picking a real option clears them.
 */
export function toggleMulti<T extends string>(current: readonly T[] = [], value: T, exclusive: readonly T[]): T[] {
  if (current.includes(value)) return current.filter((v) => v !== value);
  if (exclusive.includes(value)) return [value];
  return [...current.filter((v) => !exclusive.includes(v)), value];
}
