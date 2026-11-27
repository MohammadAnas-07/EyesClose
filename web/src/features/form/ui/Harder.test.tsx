import { render, screen, within } from '@testing-library/react';
import type { Answers } from '../answers';
import { checklistItems } from '../content';
import { ResultScreen } from './ResultScreen';
import { FormFlow } from './FormFlow';

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

function rows(over: Partial<Answers>) {
  const { unmount } = render(<ResultScreen answers={{ ...base, ...over }} items={checklistItems} checked={[]} dispatch={vi.fn()} />);
  const links = within(screen.getByRole('region', { name: 'If your situation is harder' })).getAllByRole('link');
  const result = links.map((a) => ({
    href: a.getAttribute('href'),
    target: a.getAttribute('target'),
    match: a.textContent?.includes('Matches your answers') ?? false,
  }));
  unmount();
  return result;
}

describe('If your situation is harder', () => {
  it('nothing relevant: six rows in order, none marked, each opening in a new tab', () => {
    const r = rows({});
    expect(r.map((x) => x.href)).toEqual([
      '/help/no-death-certificate',
      '/help/no-nominee',
      '/help/legal-heir-and-succession',
      '/help/joint-account',
      '/help/death-abroad',
      '/help/police-case',
    ]);
    expect(r.every((x) => x.target === '_blank' && !x.match)).toBe(true);
  });

  it('no death certificate yet: that row first and marked', () => {
    expect(rows({ deathCertificate: 'not-yet' })[0]).toEqual({ href: '/help/no-death-certificate', target: '_blank', match: true });
  });

  it('joint account: that row first and marked', () => {
    const r = rows({ jointAccount: 'yes' });
    expect(r[0]).toEqual({ href: '/help/joint-account', target: '_blank', match: true });
    expect(r.filter((x) => x.match)).toHaveLength(1);
  });

  it('the app footer links to the harder situations index in a new tab', () => {
    render(<FormFlow />);
    const link = screen.getByRole('link', { name: /^Harder situations/ });
    expect(link).toHaveAttribute('href', '/help');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
