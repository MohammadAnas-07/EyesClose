import { fireEvent, render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { NAME_ERROR } from '../answers';
import { QUESTIONS } from '../questions';
import { FormFlow } from './FormFlow';

// jsdom cannot compute colours, so contrast is checked in a real browser instead (see the PR).
async function expectNoAxeViolations() {
  const result = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } });
  expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
}

const next = () => fireEvent.click(screen.getByRole('button', { name: /Next question|See my checklist/ }));
const pick = (label: string) => fireEvent.click(screen.getByLabelText(label));
const pickIn = (group: string, label: string) =>
  fireEvent.click(within(screen.getByRole('group', { name: group })).getByLabelText(label));

/** Answers all 10 questions with a fixed, fake case. */
function answerAll() {
  fireEvent.click(screen.getByRole('button', { name: 'Start the questions' }));
  fireEvent.change(screen.getByLabelText('What was their full name?'), { target: { value: 'Test Name Markerone' } });
  next();
  pick('Daughter');
  next();
  pick('Not yet');
  next();
  pick('SBI');
  pick('Another bank');
  next();
  pickIn('Was any bank account joint?', 'Yes');
  pickIn('Did they name a nominee?', 'No');
  pickIn('Did they leave a will?', 'Not sure');
  next();
  pick('Jio');
  next();
  pick('PhonePe');
  next();
  pick('Private job with provident fund (EPFO)');
  next();
  for (const g of ['Life insurance', 'Health insurance', 'A vehicle and its insurance', 'Any loan or credit card'])
    pickIn(g, 'No');
  next();
  pickIn('Email or social media accounts', 'Yes');
  pickIn('Paid subscriptions', 'No');
  pickIn('Crypto or online investments', 'Not sure');
  next();
}

describe('FormFlow', () => {
  it('offers "Not sure" on every choice question', () => {
    for (const q of QUESTIONS) {
      if (q.kind === 'single' || q.kind === 'multi') expect(q.options.map((o) => o.value)).toContain('not-sure');
    }
  });

  it('walks from the start screen to a grouped checklist', () => {
    render(<FormFlow />);
    answerAll();
    expect(screen.getByRole('heading', { level: 1, name: 'Your checklist' })).toBeInTheDocument();
    expect(screen.getByText('For Test Name Markerone')).toBeInTheDocument();
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(['Good to know', 'First 7 days', 'Weeks 2 to 4', 'Later']);
    const first = within(screen.getByRole('region', { name: 'First 7 days' })).getAllByRole('heading', { level: 3 });
    expect(first.map((h) => h.textContent)).toEqual([
      'Get the death certificate',
      'Jio mobile number',
      'PhonePe',
      'SBI accounts',
      'Other bank accounts',
    ]);
    expect(screen.getByText('A joint account, a nominee or a will')).toBeInTheDocument();
    // Notes start collapsed; only their titles show.
    const family = screen.getByText('If family members disagree').closest('details');
    expect(family).not.toBeNull();
    expect(family).not.toHaveAttribute('open');
    expect(screen.getAllByText('Not yet checked by a professional').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByLabelText('Jio mobile number'));
    expect(screen.getByText(/^1 of \d+ steps ticked$/)).toBeInTheDocument();
  });

  it('asks kindly for an answer and keeps the user on the same question', () => {
    render(<FormFlow />);
    fireEvent.click(screen.getByRole('button', { name: 'Start the questions' }));
    next(); // a blank name is allowed
    next(); // no relationship chosen
    expect(screen.getByText('Question 2 of 10')).toBeInTheDocument();
    expect(screen.getByText(/Please choose an answer/)).toBeInTheDocument();
    expect(screen.getByLabelText('Son')).toHaveAttribute('aria-invalid', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
  });

  it('rejects a script in the name, keeps the typed text, and never runs it', () => {
    render(<FormFlow />);
    fireEvent.click(screen.getByRole('button', { name: 'Start the questions' }));
    const input = screen.getByLabelText('What was their full name?');
    const evil = '<script>alert(1)</script><img src=x onerror=alert(2)>';
    fireEvent.change(input, { target: { value: evil } });
    expect(screen.getByText(NAME_ERROR)).toBeInTheDocument();
    expect(input).toHaveValue(evil);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain('name-error');
    next();
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    expect(document.querySelector('script, img')).toBeNull();
  });

  it('makes no network request while filling the form and showing the checklist', () => {
    const fetchSpy = vi.fn();
    const beaconSpy = vi.fn();
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open');
    const xhrSend = vi.spyOn(XMLHttpRequest.prototype, 'send');
    const socketSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    vi.stubGlobal('WebSocket', socketSpy);
    vi.stubGlobal('EventSource', socketSpy);
    Object.defineProperty(navigator, 'sendBeacon', { value: beaconSpy, configurable: true });
    try {
      render(<FormFlow />);
      answerAll();
      fireEvent.click(screen.getAllByRole('checkbox')[0]!);
      fireEvent.click(screen.getAllByRole('button', { name: 'Read more about this' })[0]!);
      fireEvent.click(screen.getByRole('button', { name: 'Back to my checklist' }));
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(beaconSpy).not.toHaveBeenCalled();
      expect(xhrOpen).not.toHaveBeenCalled();
      expect(xhrSend).not.toHaveBeenCalled();
      expect(socketSpy).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    }
  });

  it('has no axe violations on the start, question, result and guide screens', async () => {
    render(<FormFlow />);
    await expectNoAxeViolations();
    fireEvent.click(screen.getByRole('button', { name: 'Start the questions' }));
    await expectNoAxeViolations();
    next();
    next(); // shows an error state
    await expectNoAxeViolations();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    answerAll();
    await expectNoAxeViolations();
    fireEvent.click(screen.getAllByRole('button', { name: 'Read more about this' })[0]!);
    await expectNoAxeViolations();
  });
});
