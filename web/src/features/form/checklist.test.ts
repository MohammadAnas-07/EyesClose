import type { Answers } from './answers';
import { CATEGORY_ORDER, buildChecklist, type ChecklistGroup } from './checklist';
import { checklistItems } from './content';
import { notesFor } from './notes';

/** A family with the death certificate, no banks, Jio only and nothing else. */
const base: Answers = {
  name: 'TEST-NAME',
  relationship: 'wife',
  deathCertificate: 'yes',
  banks: ['none'],
  jointAccount: 'no',
  nominee: 'no',
  will: 'no',
  mobile: ['jio'],
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

const build = (over: Partial<Answers>) => buildChecklist({ ...base, ...over }, checklistItems);
const ids = (groups: ChecklistGroup[]) => groups.flatMap((g) => g.items.map((i) => i.id));
const group = (groups: ChecklistGroup[], id: string) => groups.find((g) => g.id === id)?.items.map((i) => i.id) ?? [];
const noteIds = (over: Partial<Answers>) => notesFor({ ...base, ...over }).map((n) => n.id);

describe('content', () => {
  it('has unique ids and every item is unverified until a professional checks it', () => {
    const all = checklistItems.map((i) => i.id);
    expect(new Set(all).size).toBe(all.length);
    expect(checklistItems.every((i) => i.verifiedBy === null)).toBe(true);
  });
});

describe('buildChecklist', () => {
  it('only Jio: one SIM step in the first 7 days and nothing else', () => {
    const groups = build({});
    expect(groups.map((g) => g.id)).toEqual(['first-7-days']);
    expect(ids(groups)).toEqual(['sim-jio']);
    expect(noteIds({})).toEqual([]);
  });

  it('no death certificate yet: adds the certificate step and a calm note', () => {
    for (const deathCertificate of ['not-yet', 'waiting', 'not-sure'] as const) {
      expect(group(build({ deathCertificate }), 'first-7-days')).toContain('death-certificate-register');
      expect(noteIds({ deathCertificate })).toContain('no-certificate');
    }
    expect(ids(build({}))).not.toContain('death-certificate-register');
  });

  it('no bank: no bank steps and no Aadhaar or PAN note', () => {
    expect(ids(build({ banks: ['none'] })).some((id) => id.startsWith('bank-'))).toBe(false);
    expect(noteIds({ banks: ['none'] })).not.toContain('missing-id');
  });

  it('joint account plus will: bank steps and the lawyer note', () => {
    const groups = build({ banks: ['sbi', 'hdfc'], jointAccount: 'yes', will: 'yes' });
    expect(group(groups, 'first-7-days')).toEqual(['sim-jio', 'bank-hdfc', 'bank-sbi']);
    expect(noteIds({ jointAccount: 'yes', will: 'yes' })).toContain('joint-nominee-will');
    expect(noteIds({ nominee: 'not-sure' })).toContain('joint-nominee-will');
  });

  it('crypto yes: a later step and the crypto note', () => {
    expect(group(build({ crypto: 'yes' }), 'later')).toEqual(['crypto-online']);
    expect(noteIds({ crypto: 'yes' })).toContain('crypto');
  });

  it('everything "not sure": shows the catch-all steps in every group, in order', () => {
    const groups = build({
      relationship: 'not-sure',
      deathCertificate: 'not-sure',
      banks: ['not-sure'],
      jointAccount: 'not-sure',
      nominee: 'not-sure',
      will: 'not-sure',
      mobile: ['not-sure'],
      upi: ['not-sure'],
      work: ['not-sure'],
      lifeInsurance: 'not-sure',
      healthInsurance: 'not-sure',
      vehicleInsurance: 'not-sure',
      loans: 'not-sure',
      emailSocial: 'not-sure',
      subscriptions: 'not-sure',
      crypto: 'not-sure',
    });
    expect(groups.map((g) => g.id)).toEqual(['first-7-days', 'weeks-2-4', 'later']);
    expect(group(groups, 'first-7-days')).toEqual(['sim-other', 'upi-other', 'bank-find', 'death-certificate-register']);
    expect(group(groups, 'weeks-2-4')).toEqual([
      'epfo-claim',
      'family-pension',
      'health-insurance',
      'life-insurance',
      'vehicle',
      'loans-cards',
    ]);
    const later = group(groups, 'later');
    expect(later.slice(-3)).toEqual(['sub-amazon', 'sub-netflix', 'sub-other']);
    expect(later).toContain('crypto-online');
  });

  it('sorts SIM, UPI and bank first and subscriptions last inside a group', () => {
    const groups = build({ banks: ['sbi', 'other'], mobile: ['airtel', 'jio'], upi: ['gpay'], subscriptions: 'yes', emailSocial: 'yes' });
    expect(group(groups, 'first-7-days')).toEqual(['sim-airtel', 'sim-jio', 'upi-gpay', 'bank-sbi', 'bank-other']);
    for (const g of groups) {
      const ranks = g.items.map((i) => CATEGORY_ORDER.indexOf(i.category));
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    }
    expect(group(groups, 'later').at(-1)).toBe('sub-other');
  });
});
