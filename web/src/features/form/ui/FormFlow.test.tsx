import { fireEvent, render, screen, within } from '@testing-library/react';
import { answerAll, expectNoAxeViolations, next } from '../../../test/walk';
import { NAME_ERROR } from '../answers';
import { QUESTIONS } from '../questions';
import { FormFlow } from './FormFlow';

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
    expect(screen.getAllByText('From the official page').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Our suggestion').length).toBeGreaterThan(0);
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
