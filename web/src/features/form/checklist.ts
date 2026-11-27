import { z } from 'zod';
import { ANSWER_KEYS, type AnswerKey, type Answers } from './answers';

export const GROUPS = [
  { id: 'first-7-days', title: 'First 7 days' },
  { id: 'weeks-2-4', title: 'Weeks 2 to 4' },
  { id: 'later', title: 'Later' },
] as const;

/** Order inside each group: SIM, UPI and bank first, subscriptions last. */
export const CATEGORY_ORDER = [
  'sim',
  'upi',
  'bank',
  'documents',
  'work',
  'insurance',
  'vehicle',
  'loans',
  'online',
  'money',
  'subscriptions',
] as const;

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Shape of one file in content/checklist/. A null source means "source needed". */
export const checklistItemSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    version: z.number().int().positive(),
    title: z.string().min(1).max(80),
    text: z.string().min(1).max(400),
    group: z.enum(GROUPS.map((g) => g.id) as [string, ...string[]]),
    category: z.enum(CATEGORY_ORDER),
    contact: z.string().min(1).nullable(),
    source: z.url({ protocol: /^https$/ }).nullable(),
    lastChecked: date.nullable(),
    verifiedBy: z.string().min(1).nullable(),
    when: z
      .array(z.object({ question: z.enum(ANSWER_KEYS as [AnswerKey, ...AnswerKey[]]), anyOf: z.array(z.string()).min(1) }))
      .min(1),
  })
  .strict()
  .refine((i) => (i.source === null) === (i.lastChecked === null), {
    error: 'An item with a source needs a lastChecked date, and one without a source must not have one.',
  });

export type ChecklistItem = z.infer<typeof checklistItemSchema>;

export interface ChecklistGroup {
  id: (typeof GROUPS)[number]['id'];
  title: string;
  items: ChecklistItem[];
}

/** An item appears when any one of its conditions matches the answers. */
export function itemApplies(item: ChecklistItem, answers: Answers): boolean {
  return item.when.some(({ question, anyOf }) => {
    const value = answers[question];
    const values = Array.isArray(value) ? value : [value];
    return values.some((v) => anyOf.includes(v));
  });
}

// Catch-all items ("Other bank accounts", "Find their bank accounts") go after the named ones.
const isCatchAll = (id: string) => /-(other|find)$/.test(id);

function compare(a: ChecklistItem, b: ChecklistItem): number {
  return (
    CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
    Number(isCatchAll(a.id)) - Number(isCatchAll(b.id)) ||
    a.id.localeCompare(b.id)
  );
}

/** Builds the checklist: matching items, split into the three groups, in order. Empty groups are left out. */
export function buildChecklist(answers: Answers, items: readonly ChecklistItem[]): ChecklistGroup[] {
  const matching = items.filter((i) => itemApplies(i, answers)).sort(compare);
  return GROUPS.map((g) => ({ id: g.id, title: g.title, items: matching.filter((i) => i.group === g.id) })).filter(
    (g) => g.items.length > 0,
  );
}
