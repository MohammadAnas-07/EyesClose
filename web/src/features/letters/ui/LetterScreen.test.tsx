import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { NAME_ERROR, NAME_REQUIRED } from '../../form/answers';
import { FormFlow } from '../../form/ui/FormFlow';
import { answerAll, expectNoAxeViolations } from '../../../test/walk';
import { renderPdf } from '../pdf';

// Real PDF code by default; single tests can make it fail.
vi.mock('../pdf', async (importOriginal) => {
  const real = await importOriginal<typeof import('../pdf')>();
  return { renderPdf: vi.fn(real.renderPdf) };
});

function openSbiLetter() {
  render(<FormFlow />);
  answerAll();
  const sbi = screen.getByText('SBI accounts').closest('li')!;
  fireEvent.click(within(sbi).getByRole('button', { name: 'Make this letter' }));
}

const type = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const preview = () => screen.getByRole('region', { name: 'Preview' }).querySelector('pre')!.textContent ?? '';

describe('LetterScreen', () => {
  let createUrl: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    createUrl = vi.fn(() => 'blob:local-test');
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: vi.fn() }));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(renderPdf).mockClear();
  });

  it('opens from a checklist item with the name filled in and a live plain-text preview', () => {
    openSbiLetter();
    expect(screen.getByRole('heading', { level: 1, name: 'Covering letter for the bank' })).toBeInTheDocument();
    expect(screen.getByText('For State Bank of India')).toBeInTheDocument();
    expect(screen.getByLabelText('Name of the person who died')).toHaveValue('Test Name Markerone');
    expect(screen.getByText('Not yet checked by a professional')).toBeInTheDocument();
    expect(screen.getByLabelText('Name of the person who died')).toHaveAccessibleDescription(
      /Type the full name, as it appears on the death certificate./,
    );
    type('Your full name', 'Writer Markertwo');
    expect(preview()).toContain('Subject: Death of account holder Test Name Markerone');
    expect(preview()).toContain('Name: Writer Markertwo');
  });

  it('rejects a script in a name, shows it nowhere as HTML, and keeps it out of the preview', () => {
    openSbiLetter();
    type('Your full name', '<script>alert(1)</script><img src=x onerror=alert(2)>');
    expect(screen.getByText(NAME_ERROR)).toBeInTheDocument();
    expect(preview()).not.toContain('<script>');
    expect(document.querySelector('pre script, pre img, main script, main img')).toBeNull();
  });

  it('asks for missing details before making the PDF, and keeps them when going back', async () => {
    openSbiLetter();
    type('Name of the person who died', '');
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }));
    expect(screen.getAllByText(NAME_REQUIRED)).toHaveLength(2);
    expect(screen.getByLabelText('Your full name')).toHaveAttribute('aria-invalid', 'true');
    expect(renderPdf).not.toHaveBeenCalled();

    type('Your full name', 'Writer Markertwo');
    fireEvent.click(screen.getByRole('button', { name: 'Back to my checklist' }));
    const sbi = screen.getByText('SBI accounts').closest('li')!;
    fireEvent.click(within(sbi).getByRole('button', { name: 'Make this letter' }));
    expect(screen.getByLabelText('Your full name')).toHaveValue('Writer Markertwo');
  });

  it('builds the PDF on the device, names the file without personal details, and sends nothing', async () => {
    const fetchSpy = vi.fn();
    const beaconSpy = vi.fn();
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open');
    vi.stubGlobal('fetch', fetchSpy);
    vi.stubGlobal('WebSocket', vi.fn());
    Object.defineProperty(navigator, 'sendBeacon', { value: beaconSpy, configurable: true });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe('eyesclose-bank-letter.pdf');
      expect(this.href).toBe('blob:local-test');
    });

    openSbiLetter();
    type('Your full name', 'Writer Markertwo');
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }));
    expect(screen.getByRole('button', { name: /Making your PDF/ })).toBeDisabled();
    await screen.findByText(/Your PDF is ready/, {}, { timeout: 5000 });

    expect(renderPdf).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    const blob = createUrl.mock.calls[0]![0] as Blob;
    expect(blob.type).toBe('application/pdf');
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(beaconSpy).not.toHaveBeenCalled();
    expect(xhrOpen).not.toHaveBeenCalled();
    click.mockRestore();
    xhrOpen.mockRestore();
  });

  it('shows a calm message and offers printing when the PDF cannot be made', async () => {
    vi.mocked(renderPdf).mockRejectedValueOnce(new Error('broken'));
    const print = vi.fn();
    vi.stubGlobal('print', print);
    openSbiLetter();
    type('Your full name', 'Writer Markertwo');
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }));
    await screen.findByText(/We could not make the PDF on this phone/);
    expect(screen.getByLabelText('Your full name')).toHaveValue('Writer Markertwo');
    fireEvent.click(screen.getByRole('button', { name: 'Print instead' }));
    expect(print).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    openSbiLetter();
    await expectNoAxeViolations();
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }));
    await waitFor(() => expect(screen.getByLabelText('Your full name')).toHaveAttribute('aria-invalid', 'true'));
    await expectNoAxeViolations();
  });
});
