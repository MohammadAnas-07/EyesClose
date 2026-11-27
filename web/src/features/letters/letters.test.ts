import { NAME_ERROR, NAME_REQUIRED, NAME_TOO_LONG } from '../form/answers';
import { checklistItems } from '../form/content';
import { composeLetter, toPlainText } from './compose';
import { letterForItem, letters, letterSchema } from './content';
import { formatDate, todayIso, validateLetterDetails } from './details';
import { TemplateError, fillText } from './template';

const details = { deceasedName: 'Test Name Markerone', writerName: 'Writer Markertwo', date: '2026-11-27' };
const values = { deceasedName: 'A', writerName: 'B', date: 'C', institution: 'D', subject: 'E', reference: 'F' };
const bank = letters.find((l) => l.id === 'bank-covering-letter')!;
const vi = letters.find((l) => l.id === 'vi-transfer-letter')!;

describe('fillText', () => {
  it('fills every known placeholder', () => {
    expect(fillText('{{deceasedName}} / {{writerName}} / {{date}} / {{institution}}', values)).toBe('A / B / C / D');
  });

  it('fails on an unknown token', () => {
    expect(() => fillText('Hello {{accountNumber}}', values)).toThrow(TemplateError);
    expect(() => fillText('Hello {{constructor}}', values)).toThrow(TemplateError);
    expect(() => fillText('Hello {{__proto__}}', values)).toThrow(TemplateError);
  });

  it('fails when a placeholder is left broken or unfilled', () => {
    expect(() => fillText('Hello {{deceasedName}', values)).toThrow(TemplateError);
    expect(() => fillText('Hello {{ }}', values)).toThrow(TemplateError);
  });

  it('never reads a value as a template', () => {
    expect(fillText('{{writerName}}', { ...values, writerName: '${1+1} <b>' })).toBe('${1+1} <b>');
  });
});

describe('letter content', () => {
  it('has three letters, all unverified; form letters have official sources', () => {
    expect(letters.map((l) => l.id).sort()).toEqual(['bank-covering-letter', 'general-intimation-letter', 'vi-transfer-letter']);
    for (const l of letters) {
      expect(l.verifiedBy).toBeNull();
      if (l.kind === 'with-form') expect(l.sources.length).toBeGreaterThan(0);
      else expect(l.sourceType).toBe('general intimation, no process claimed');
    }
  });

  it('offers at most one letter per checklist item', () => {
    const items = letters.flatMap((l) => l.appliesTo.map((a) => a.item));
    expect(new Set(items).size).toBe(items.length);
  });

  it('only offers letters for checklist items that exist', () => {
    const ids = new Set(checklistItems.map((i) => i.id));
    for (const l of letters) for (const a of l.appliesTo) expect(ids.has(a.item)).toBe(true);
    expect(letterForItem('bank-sbi')?.institution).toBe('State Bank of India');
    expect(letterForItem('sim-vi')?.letter.id).toBe('vi-transfer-letter');
    expect(letterForItem('sim-jio')?.letter.id).toBe('general-intimation-letter');
    expect(letterForItem('epfo-claim')).toBeNull();
    expect(letterForItem('sub-netflix')).toBeNull();
    expect(letterForItem('family-pension')).toBeNull();
  });

  it('rejects content with an unknown placeholder', () => {
    const bad = { ...bank, letter: [{ type: 'text', text: 'Account {{accountNumber}}' }] };
    expect(letterSchema.safeParse(bad).success).toBe(false);
  });
});

describe('composeLetter', () => {
  it('puts the names, date and bank in the letter and fills every placeholder', () => {
    const doc = composeLetter(bank, details, 'State Bank of India', null);
    const text = toPlainText(doc.letter);
    expect(text).toContain('Subject: Death of account holder Test Name Markerone');
    expect(text).toContain('Name: Writer Markertwo');
    expect(text).toContain('Date: 27 November 2026');
    expect(text).toContain('State Bank of India');
    expect(text).toContain('[ ] nominee   [ ] legal heir   [ ] other');
    expect(text).not.toMatch(/\{\{|\}\}/);
    expect(doc.fileName).toBe('eyesclose-bank-letter.pdf');
  });

  it('leaves a blank line for the bank name when the bank is not known', () => {
    expect(toPlainText(composeLetter(bank, details, null, null).letter)).toMatch(/^_{10,}$/m);
  });

  it('never types account numbers, phone numbers or addresses', () => {
    for (const letter of [bank, vi]) {
      const text = toPlainText(composeLetter(letter, details, 'X', null).letter);
      for (const label of ['Phone', 'Address', 'Date of death']) expect(text).toMatch(new RegExp(`^${label}: _+$`, 'm'));
    }
  });

  it('keeps the "not checked" label and the steps on the cover page only', () => {
    const doc = composeLetter(vi, details, 'Vi (Vodafone Idea Limited)', null);
    const cover = toPlainText(doc.cover);
    expect(cover).toContain('Before you print');
    expect(cover).toContain('Not yet checked by a professional.');
    expect(cover).toContain("Take it with Vi's own Transfer of Ownership Request form.");
    expect(toPlainText(doc.letter)).not.toContain('Not yet checked');
  });
});

describe('letter details', () => {
  it('requires both names and a real date', () => {
    const r = validateLetterDetails({});
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.deceasedName).toBe(NAME_REQUIRED);
      expect(r.errors.writerName).toBe(NAME_REQUIRED);
      expect(r.errors.date).toBeDefined();
    }
    expect(validateLetterDetails({ ...details, date: '2026-02-30' }).ok).toBe(false);
    expect(validateLetterDetails(details).ok).toBe(true);
  });

  it.each([
    ['<script>alert(1)</script>', NAME_ERROR],
    ['. . .', NAME_ERROR],
    ['  ..  ', NAME_ERROR],
    ['Sunita'.repeat(20), NAME_TOO_LONG],
  ])('rejects %j with a friendly message', (name, message) => {
    const r = validateLetterDetails({ ...details, writerName: name });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.writerName).toBe(message);
  });

  it('formats dates in plain English', () => {
    expect(formatDate('2026-01-05')).toBe('5 January 2026');
    expect(todayIso(new Date(2026, 10, 27))).toBe('2026-11-27');
  });
});

describe('where to get the form', () => {
  const coverFor = (itemId: string) => {
    const choice = letterForItem(itemId)!;
    return toPlainText(composeLetter(choice.letter, details, choice.institution, choice.formUrl).cover);
  };
  const sourceOf = (id: string) => checklistItems.find((i) => i.id === id)!.source!;

  it('uses the official link from the checked checklist item', () => {
    expect(coverFor('bank-sbi')).toContain(
      `For the bank's own claim form, see the official page: ${sourceOf('bank-sbi')} or ask at the branch.`,
    );
    expect(coverFor('sim-vi')).toContain(
      `For Vi's own Transfer of Ownership Request form, see the official page: ${sourceOf('sim-vi')} or ask at a Vi store.`,
    );
  });

  it('says to ask at the branch when the bank is not known', () => {
    const cover = coverFor('bank-other');
    expect(cover).toContain("For the bank's own claim form, ask at the branch.");
    expect(cover).not.toContain('http');
  });

  it('only ever links to the URL already in the checklist item', () => {
    for (const letter of letters)
      for (const { item } of letter.appliesTo) {
        const url = letterForItem(item)!.formUrl;
        if (url) expect(url).toBe(sourceOf(item));
      }
  });
});
