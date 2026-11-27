import { fireEvent, render, screen, within } from '@testing-library/react';
import type { Answers } from '../../form/answers';
import { checklistItems } from '../../form/content';
import { ResultScreen } from '../../form/ui/ResultScreen';

// "Their other mobile number" comes from mobile: ['other'], which every case below avoids unless it says so.
const base: Answers = {
  name: '',
  relationship: 'son',
  deathCertificate: 'yes',
  banks: ['none'],
  jointAccount: 'no',
  nominee: 'no',
  will: 'no',
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

function renderResult(over: Partial<Answers>, dispatch = vi.fn()) {
  return render(<ResultScreen answers={{ ...base, ...over }} items={checklistItems} checked={[]} dispatch={dispatch} />);
}

/** The institution names shown in "Your letters", in order, or the calm empty sentence. */
function rows(over: Partial<Answers>): string[] {
  const { unmount } = renderResult(over);
  const section = screen.getByRole('region', { name: 'Your letters' });
  const items = within(section).queryAllByRole('listitem');
  const result = items.length ? items.map((li) => li.querySelector('p')!.textContent ?? '') : [section.querySelector('p')!.textContent ?? ''];
  unmount();
  return result;
}

describe('Your letters', () => {
  it('one bank: a row for the bank', () => {
    expect(rows({ banks: ['sbi'], mobile: ['airtel'] })).toEqual(['Airtel', 'State Bank of India']);
  });

  it('three banks: one row per bank', () => {
    expect(rows({ banks: ['sbi', 'hdfc', 'canara'], mobile: ['airtel'] })).toEqual([
      'Airtel',
      'Canara Bank',
      'HDFC Bank',
      'State Bank of India',
    ]);
  });

  it('only Airtel: one general letter row', () => {
    expect(rows({ mobile: ['airtel'] })).toEqual(['Airtel']);
  });

  it('Vi plus Airtel: the general letter for Airtel and the transfer letter for Vi', () => {
    renderResult({ mobile: ['airtel', 'vi'] });
    const items = within(screen.getByRole('region', { name: 'Your letters' })).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual([
      'AirtelLetter to tell them about the deathMake letter',
      'Vi (Vodafone Idea Limited)Request letter for ViMake letter',
    ]);
    expect(items.map((li) => within(li).getByRole('button').getAttribute('aria-label'))).toEqual([
      'Make letter for Airtel',
      'Make letter for Vi (Vodafone Idea Limited)',
    ]);
  });

  it('nothing that needs a letter: one calm sentence', () => {
    // Only subscription, EPFO and pension steps: they have their own official processes, so no letter.
    expect(rows({ mobile: [] as never, banks: ['none'], work: ['epfo', 'pension'], subscriptions: 'yes' })).toEqual([
      'None of the steps in your checklist has a letter yet.',
    ]);
  });

  it('puts the general letter on networks, payment apps, insurance and loans, and not on EPFO, pension or subscriptions', () => {
    const shown = rows({
      mobile: ['jio', 'airtel', 'bsnl', 'other'],
      upi: ['phonepe', 'gpay', 'paytm', 'other'],
      lifeInsurance: 'yes',
      healthInsurance: 'yes',
      vehicleInsurance: 'yes',
      loans: 'yes',
      work: ['epfo', 'pension'],
      subscriptions: 'yes',
    });
    expect(shown).toEqual([
      'Airtel',
      'BSNL',
      'Jio',
      'Their other mobile number',
      'Google Pay',
      'Paytm',
      'PhonePe',
      'Other UPI or wallet apps',
      'Health insurance',
      'Life insurance',
      'Vehicle and its insurance',
      'Loans and credit cards',
    ]);
  });

  it('offers the bank letter for every bank, on the list and on the item', () => {
    const named = {
      sbi: 'SBI',
      hdfc: 'HDFC Bank',
      icici: 'ICICI Bank',
      axis: 'Axis Bank',
      pnb: 'Punjab National Bank',
      bob: 'Bank of Baroda',
      kotak: 'Kotak Mahindra Bank',
      canara: 'Canara Bank',
      other: 'Other bank',
    } as const;
    for (const [bank, title] of Object.entries(named)) {
      const dispatch = vi.fn();
      const { unmount } = renderResult({ banks: [bank] as Answers['banks'], mobile: [] as never }, dispatch);
      const card = screen.getByRole('heading', { level: 3, name: `${title} accounts` }).closest('li')!;
      fireEvent.click(within(card).getByRole('button', { name: 'Make this letter' }));
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'open-letter', itemId: `bank-${bank}` }));
      expect(within(screen.getByRole('region', { name: 'Your letters' })).getAllByRole('listitem')).toHaveLength(1);
      unmount();
    }
    // "Not sure" and "no bank account" have no bank letter.
    expect(rows({ banks: ['not-sure'], mobile: [] as never })[0]).toBe('None of the steps in your checklist has a letter yet.');
    expect(rows({ banks: ['none'], mobile: [] as never })[0]).toBe('None of the steps in your checklist has a letter yet.');
  });
});
