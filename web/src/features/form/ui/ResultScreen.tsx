import type { Dispatch } from 'react';
import { Button } from '../../../shared/ui/Button';
import type { Answers } from '../answers';
import { buildChecklist, type ChecklistItem } from '../checklist';
import type { FlowAction } from '../flow';
import { notesFor } from '../notes';
import { letterForItem, type LetterChoice } from '../../letters/content';
import { todayIso } from '../../letters/details';
import { helpPages, helpRowsFor } from '../../help/content';
import { ChevronIcon, ExternalIcon, InfoIcon, LetterIcon, LockIcon } from './icons';

interface Props {
  answers: Answers;
  items: readonly ChecklistItem[];
  checked: string[];
  dispatch: Dispatch<FlowAction>;
}

export function ResultScreen({ answers, items, checked, dispatch }: Props) {
  const groups = buildChecklist(answers, items);
  const notes = notesFor(answers);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const done = groups.reduce((n, g) => n + g.items.filter((i) => checked.includes(i.id)).length, 0);
  // One row per checklist item that has a letter, in checklist order (so several banks give several rows).
  const letterRows = groups
    .flatMap((g) => g.items)
    .flatMap((item) => {
      const choice = letterForItem(item.id);
      return choice ? [{ item, choice }] : [];
    });
  const openLetter = (itemId: string, choice: LetterChoice) =>
    dispatch({ type: 'open-letter', itemId, today: todayIso(), institution: choice.institution, subject: choice.subject });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 tabIndex={-1} className="text-title text-balance outline-none">
          Your checklist
        </h1>
        {answers.name && <p className="text-lg">For {answers.name}</p>}
        <p className="text-ink-soft">
          Start with the first group, and take one step at a time. Ticks stay only while this page is
          open.
        </p>
      </div>

      <section aria-labelledby="letters-heading" className="flex flex-col gap-3">
        <h2 id="letters-heading" className="text-xl">
          Your letters
        </h2>
        {letterRows.length === 0 ? (
          <p className="text-ink-soft">None of the steps in your checklist has a letter yet.</p>
        ) : (
          <>
            <p className="text-ink-soft">Each letter opens with a short form and a preview. You print it and sign it.</p>
            <ul className="overflow-hidden rounded-card border border-line-strong bg-surface">
              {letterRows.map(({ item, choice }) => {
                const name = choice.institution ?? item.title;
                return (
                  <li key={item.id} className="flex items-center gap-3 border-line-strong px-4 py-3 [&+&]:border-t">
                    <LetterIcon className="size-5 shrink-0 text-ink-soft" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-ink-soft">{choice.letter.title}</p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => openLetter(item.id, choice)}
                      aria-label={`Make letter for ${name}`}
                      className="shrink-0 px-4!"
                    >
                      Make letter
                    </Button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {notes.length > 0 && (
        <section aria-labelledby="notes-heading" className="flex flex-col gap-3">
          <h2 id="notes-heading" className="text-xl">
            Good to know
          </h2>
          <ul className="overflow-hidden rounded-card border border-note-line bg-note">
            {notes.map((n) => (
              <li key={n.id} className="border-note-line [&+&]:border-t">
                {/* Short titles first; the detail opens on tap, so the checklist stays near the top. */}
                <details className="group">
                  <summary className="flex min-h-13 cursor-pointer list-none items-center gap-3 px-4 py-3 font-medium hover:bg-note-line/30 [&::-webkit-details-marker]:hidden">
                    <InfoIcon className="size-5 shrink-0 text-note-ink" />
                    <span className="flex-1">{n.title}</span>
                    <ChevronIcon className="size-5 shrink-0 text-note-ink transition-transform duration-fast group-open:rotate-180" />
                  </summary>
                  <div className="flex flex-col gap-1 px-4 pb-4 pl-12">
                    <p>{n.text}</p>
                    {helpPages.some((p) => p.slug === n.guide) ? (
                      <a
                        href={`/help/${n.guide}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-ml-1 mt-1 inline-flex min-h-11 items-center gap-1 self-start rounded-control px-1 font-medium underline decoration-note-ink/50 underline-offset-4 hover:decoration-note-ink"
                      >
                        Read more about this
                        <ExternalIcon className="size-4" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'open-guide', guide: n.guide })}
                        className="-ml-1 mt-1 min-h-11 cursor-pointer self-start rounded-control px-1 text-left font-medium underline decoration-note-ink/50 underline-offset-4 hover:decoration-note-ink"
                      >
                        Read more about this
                      </button>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}

      {total === 0 ? (
        <section className="flex flex-col items-start gap-3 rounded-card bg-tint p-5">
          <h2 className="text-xl">Nothing to close from these answers</h2>
          <p>If something was missed, you can go back and change your answers.</p>
        </section>
      ) : (
        <>
          <p aria-live="polite" className="-mb-6 text-sm text-ink-soft">
            {done} of {total} steps ticked
          </p>
          {groups.map((g) => (
            <section key={g.id} aria-labelledby={`${g.id}-heading`} className="flex flex-col gap-3">
              <h2 id={`${g.id}-heading`} className="text-xl">
                {g.title}
              </h2>
              <ol className="flex flex-col gap-3">
                {g.items.map((item) => (
                  <Item
                    key={item.id}
                    item={item}
                    checked={checked.includes(item.id)}
                    onToggle={() => dispatch({ type: 'toggle-item', id: item.id })}
                    onLetter={(() => {
                      const choice = letterForItem(item.id);
                      return choice ? () => openLetter(item.id, choice) : undefined;
                    })()}
                  />
                ))}
              </ol>
            </section>
          ))}
        </>
      )}

      <section aria-labelledby="harder-heading" className="flex flex-col gap-3">
        <h2 id="harder-heading" className="text-xl">
          If your situation is harder
        </h2>
        <p className="text-ink-soft">What official sources say, and when a lawyer can help. Each page opens in a new tab, so this checklist stays open.</p>
        <ul className="overflow-hidden rounded-card border border-line-strong bg-surface">
          {helpRowsFor(answers).map(({ page, relevant }) => (
            <li key={page.slug} className="border-line-strong [&+&]:border-t">
              <a
                href={`/help/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-13 items-start gap-3 px-4 py-3 hover:bg-tint"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-medium underline decoration-ink/30 underline-offset-4">{page.title}</span>
                  <span className="text-sm text-ink-soft">{page.description}</span>
                  {relevant && <span className="self-start rounded-control bg-note px-3 py-0.5 text-sm text-note-ink">Matches your answers</span>}
                </span>
                <ExternalIcon className="mt-1 size-4 shrink-0 text-ink-soft" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-4 border-t border-line-strong pt-6">
        <Button variant="secondary" onClick={() => dispatch({ type: 'edit' })} className="w-full sm:w-auto sm:self-start">
          Change my answers
        </Button>
        <p className="flex gap-2 text-sm text-ink-soft">
          <LockIcon className="size-4 shrink-0 translate-y-0.5" />
          Your answers stay in this browser and disappear when you close this page.
        </p>
      </div>
    </div>
  );
}

function Item({
  item,
  checked,
  onToggle,
  onLetter,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
  onLetter?: () => void;
}) {
  const id = `item-${item.id}`;
  return (
    <li
      className={`rounded-card border p-4 transition-colors duration-fast ${
        checked ? 'border-line-strong bg-tint' : 'border-line-strong bg-surface'
      }`}
    >
      <div className="flex gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          aria-describedby={[item.official && `${id}-official`, item.suggestion && `${id}-suggestion`]
            .filter(Boolean)
            .join(' ')}
          className="tick mt-0.5 size-6 shrink-0 cursor-pointer appearance-none rounded-control border-2 border-line-control bg-surface transition-colors duration-fast checked:border-ink checked:bg-ink"
        />
        <div className="flex min-w-0 flex-col gap-2">
          <h3
            className={`text-lg tracking-normal transition-colors duration-fast ${
              checked ? 'text-ink-soft line-through decoration-ink/40' : ''
            }`}
          >
            <label htmlFor={id} className="cursor-pointer">
              {item.title}
            </label>
          </h3>
          {item.official && (
            <div id={`${id}-official`}>
              <p className="text-sm font-medium text-ink-soft">From the official page</p>
              <p>{item.official}</p>
            </div>
          )}
          {item.suggestion && (
            <div id={`${id}-suggestion`}>
              <p className="text-sm font-medium text-ink-soft">Our suggestion</p>
              <p>{item.suggestion}</p>
            </div>
          )}
          {item.contact && (
            <p>
              <span className="text-ink-soft">Who to contact: </span>
              {item.contact}
            </p>
          )}
          {onLetter && (
            <Button variant="secondary" onClick={onLetter} className="mt-1 self-start">
              <LetterIcon className="size-5" />
              Make this letter
            </Button>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {item.verifiedBy === null && <span className="rounded-control bg-tint px-3 py-1">Not yet checked by a professional</span>}
            {item.source ? (
              <a
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 font-medium underline decoration-ink/30 hover:decoration-ink"
              >
                Official page
                <ExternalIcon className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <span className="rounded-control bg-note px-3 py-1 text-note-ink">Source needed</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
