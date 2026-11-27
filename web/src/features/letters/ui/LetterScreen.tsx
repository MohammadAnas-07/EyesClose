import { useEffect, useRef, useState, type Dispatch, type FormEvent } from 'react';
import { Button } from '../../../shared/ui/Button';
import type { FlowAction, FlowState } from '../../form/flow';
import { ErrorText } from '../../form/ui/ErrorText';
import { BackIcon, ExternalIcon, LockIcon } from '../../form/ui/icons';
import { COVER_FOOTER, LETTER_FOOTER, NOT_CHECKED, composeLetter, previewLetter, toPlainText, type LetterDocument, type Line } from '../compose';
import { letterForItem } from '../content';
import { formatDate, validateLetterDetails, type LetterDetailKey } from '../details';
import { saveFile } from '../download';
import { renderPdf } from '../pdf';

type Status = 'idle' | 'loading' | 'done' | 'error';

interface Props {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
}

export function LetterScreen({ state, dispatch }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const busy = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const errorCount = Object.values(state.letterErrors).filter(Boolean).length;

  // After a failed Download or Print, move focus to the first field that needs fixing.
  useEffect(() => {
    if (errorCount > 0 && document.activeElement?.tagName !== 'INPUT') {
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [errorCount]);

  const choice = state.letterItem ? letterForItem(state.letterItem) : null;
  if (!choice) return null;
  const { letter, institution, formUrl } = choice;
  const draft = state.letterDraft;
  const checked = validateLetterDetails(draft);
  const printable: LetterDocument | null = checked.ok ? composeLetter(letter, checked.details, institution, formUrl) : null;

  const set = (key: LetterDetailKey, value: string) => dispatch({ type: 'set-letter', key, value });

  /** Returns the checked details, or shows the errors and returns null. */
  const checkDetails = () => {
    if (checked.ok) return checked.details;
    dispatch({ type: 'letter-errors', errors: checked.errors });
    return null;
  };

  const download = async (e: FormEvent) => {
    e.preventDefault();
    if (busy.current) return;
    const details = checkDetails();
    if (!details) return;
    busy.current = true;
    setStatus('loading');
    try {
      saveFile(await renderPdf(composeLetter(letter, details, institution, formUrl)), letter.fileName);
      setStatus('done');
    } catch {
      // Keep everything the user typed; printing still works without the PDF library.
      setStatus('error');
    } finally {
      busy.current = false;
    }
  };

  const print = () => {
    if (checkDetails()) window.print();
  };

  return (
    <>
      <div className="no-print flex flex-col gap-8">
        <div className="flex items-center">
          <Button variant="quiet" onClick={() => dispatch({ type: 'back' })}>
            <BackIcon className="size-5" />
            Back to my checklist
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <h1 tabIndex={-1} className="text-[clamp(1.5rem,1.25rem+1.2vw,2rem)] text-balance outline-none">
            {letter.title}
          </h1>
          {institution && <p className="text-lg">For {institution}</p>}
          <p className="text-ink-soft">{letter.about}</p>
          <p className="self-start rounded-pill bg-tint px-3 py-1 text-sm">{NOT_CHECKED.replace(/\.$/, '')}</p>
        </div>

        <form ref={form} onSubmit={download} noValidate className="flex flex-col gap-6">
          <NameField
            id="deceasedName"
            label="Name of the person who died"
            hint="Type the full name, as it appears on the death certificate. English letters (A to Z) only."
            value={draft.deceasedName ?? ''}
            error={state.letterErrors.deceasedName}
            onChange={(v) => set('deceasedName', v)}
          />
          <NameField
            id="writerName"
            label="Your full name"
            hint="Type your full name. English letters (A to Z) only."
            value={draft.writerName ?? ''}
            error={state.letterErrors.writerName}
            onChange={(v) => set('writerName', v)}
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="letterDate" className="text-lg font-medium">
              Date on the letter
            </label>
            <input
              id="letterDate"
              type="date"
              value={draft.date ?? ''}
              onChange={(e) => set('date', e.target.value)}
              aria-invalid={state.letterErrors.date ? true : undefined}
              aria-describedby="letterDate-error"
              className={`min-h-13 w-full rounded-card border bg-surface px-4 text-lg hover:border-ink/40 ${
                state.letterErrors.date ? 'border-error' : 'border-ink/30'
              }`}
            />
            <ErrorText id="letterDate-error" message={state.letterErrors.date} />
          </div>

          <p className="flex gap-3 rounded-card bg-tint p-4">
            <LockIcon className="mt-0.5 size-5 shrink-0" />
            <span>
              Do not type account numbers, phone numbers or addresses here. The letter has blank lines for them, to fill
              in by hand after printing.
            </span>
          </p>

          <section aria-labelledby="preview-heading" className="flex flex-col gap-3">
            <h2 id="preview-heading" className="text-xl">
              Preview
            </h2>
            {/* Plain text only. React escapes it, so nothing typed can become HTML. */}
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-card border border-line-strong bg-surface p-4 font-sans text-base leading-relaxed">
              {toPlainText(previewLetter(letter, draft, institution).letter)}
            </pre>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'} className="min-w-56">
              {status === 'loading' ? (
                <>
                  <Spinner />
                  Making your PDF
                </>
              ) : (
                'Download PDF'
              )}
            </Button>
            <Button variant="secondary" onClick={print}>
              Print instead
            </Button>
          </div>

          <div aria-live="polite" className="empty:hidden">
            {status === 'done' && (
              <p className="rounded-card bg-tint p-4">
                Your PDF is ready. Look for {letter.fileName} in your downloads. The first page explains what to do.
              </p>
            )}
            {status === 'error' && (
              <p className="rounded-card border border-note-line bg-note p-4">
                We could not make the PDF on this phone. Your details are still here. Please use Print instead; on the
                print screen you can also choose Save as PDF.
              </p>
            )}
          </div>
        </form>

        <section aria-labelledby="sources-heading" className="flex flex-col gap-2 border-t border-line-strong pt-6 text-sm">
          <h2 id="sources-heading" className="text-base tracking-normal">
            Where this comes from
          </h2>
          {letter.sources.map((s) => (
            <p key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 font-medium underline decoration-ink/30 hover:decoration-ink"
              >
                Official page
                <ExternalIcon className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <span className="block text-ink-soft">Checked on {formatDate(letter.lastChecked)}.</span>
            </p>
          ))}
        </section>
      </div>

      {printable && <PrintView doc={printable} />}
    </>
  );
}

function NameField(props: {
  id: string;
  label: string;
  hint: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const errorId = `${props.id}-error`;
  const hintId = `${props.id}-hint`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="text-lg font-medium">
        {props.label}
      </label>
      <p id={hintId} className="text-ink-soft">
        {props.hint}
      </p>
      <input
        id={props.id}
        type="text"
        autoComplete="off"
        autoCapitalize="words"
        spellCheck={false}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={`${hintId} ${errorId}`}
        className={`min-h-13 w-full rounded-card border bg-surface px-4 text-lg hover:border-ink/40 ${
          props.error ? 'border-error' : 'border-ink/30'
        }`}
      />
      <ErrorText id={errorId} message={props.error} />
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 animate-spin" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Shown only when printing: the same two pages as the PDF, as plain text in the page. */
function PrintView({ doc }: { doc: LetterDocument }) {
  return (
    <div className="print-only text-black" aria-hidden="true">
      {[doc.cover, doc.letter].map((lines, i) => (
        <section key={i} className="print-page">
          {lines.map((line, j) => (
            <PrintLine key={j} line={line} />
          ))}
          <p className="print-footer">{i === 0 ? COVER_FOOTER : LETTER_FOOTER}</p>
        </section>
      ))}
    </div>
  );
}

function PrintLine({ line }: { line: Line }) {
  switch (line.kind) {
    case 'title':
      return <h2 className="mb-4 text-2xl">{line.text}</h2>;
    case 'text':
      return <p className={line.bold ? 'font-semibold' : ''}>{line.text}</p>;
    case 'item':
      return (
        <p className="pl-6 -indent-6">
          {line.number}. {line.text}
        </p>
      );
    case 'field':
      return <p className="mt-3">{line.label ? `${line.label}: ` : ''}________________________________________</p>;
    case 'ticks':
      return (
        <p>
          {line.label}:{' '}
          {line.options.map((o) => (
            <span key={o} className="mr-6 inline-flex items-center gap-2">
              <span className="inline-block size-3.5 border border-black" />
              {o}
            </span>
          ))}
          ____________
        </p>
      );
    case 'gap':
      return <div className="h-3" />;
  }
}
