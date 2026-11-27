import { useEffect, useRef, type Dispatch, type FormEvent } from 'react';
import { Button } from '../../../shared/ui/Button';
import { toggleMulti, type AnswerKey } from '../answers';
import type { FlowAction, FlowState } from '../flow';
import { QUESTIONS, TRI_OPTIONS, type Option, type Question } from '../questions';
import { ErrorText } from './ErrorText';
import { BackIcon } from './icons';

interface Props {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
}

const headingClass = 'block text-[clamp(1.5rem,1.25rem+1.2vw,2rem)] text-balance outline-none';

export function QuestionScreen({ state, dispatch }: Props) {
  const question = QUESTIONS[state.step];
  const form = useRef<HTMLFormElement>(null);
  const errorCount = Object.values(state.errors).filter(Boolean).length;

  // After a failed "Next", move focus to the first field that needs an answer.
  useEffect(() => {
    if (errorCount > 0 && document.activeElement?.tagName !== 'INPUT') {
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [errorCount]);

  if (!question) return null;
  const last = state.step === QUESTIONS.length - 1;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'next' });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="quiet" onClick={() => dispatch({ type: 'back' })}>
          <BackIcon className="size-5" />
          Back
        </Button>
        <p className="text-sm text-ink-soft">
          Question {state.step + 1} of {QUESTIONS.length}
        </p>
      </div>

      <form ref={form} onSubmit={submit} noValidate className="flex flex-1 flex-col gap-8">
        <QuestionBody question={question} state={state} dispatch={dispatch} />
        <div className="mt-auto pt-2">
          <Button type="submit" className="w-full sm:w-auto">
            {last ? 'See my checklist' : 'Next question'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function QuestionBody({ question, state, dispatch }: { question: Question } & Props) {
  const set = (key: AnswerKey, value: unknown) => dispatch({ type: 'set', key, value });
  const hintId = `${question.id}-hint`;

  if (question.kind === 'text') {
    const error = state.errors.name;
    const errorId = 'name-error';
    return (
      <div className="flex flex-col gap-3">
        <h1 tabIndex={-1} className={headingClass}>
          <label htmlFor="name">{question.title}</label>
        </h1>
        <p id={hintId} className="text-ink-soft">
          {question.hint}
        </p>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="next"
          value={state.draft.name ?? ''}
          onChange={(e) => set('name', e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${hintId} ${errorId}`}
          className={`mt-1 min-h-13 w-full rounded-card border bg-surface px-4 text-lg transition-colors duration-150 placeholder:text-ink-soft hover:border-ink/40 ${
            error ? 'border-error' : 'border-ink/30'
          }`}
          placeholder="For example: Sunita Sharma"
        />
        <ErrorText id={errorId} message={error} />
      </div>
    );
  }

  if (question.kind === 'tri-group') {
    return (
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <h1 tabIndex={-1} className={headingClass}>
            {question.title}
          </h1>
          {question.hint && <p className="text-ink-soft">{question.hint}</p>}
        </div>
        {question.parts.map((part) => {
          const error = state.errors[part.key];
          const partHint = `${part.key}-hint`;
          const errorId = `${part.key}-error`;
          return (
            <fieldset key={part.key} aria-describedby={`${part.hint ? partHint : ''} ${errorId}`.trim()}>
              <legend className="text-lg font-medium">{part.label}</legend>
              {part.hint && (
                <p id={partHint} className="mt-1 text-ink-soft">
                  {part.hint}
                </p>
              )}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {TRI_OPTIONS.map((o) => (
                  <Choice
                    key={o.value}
                    type="radio"
                    name={part.key}
                    option={o}
                    compact
                    checked={state.draft[part.key] === o.value}
                    invalid={Boolean(error)}
                    onChange={() => set(part.key, o.value)}
                  />
                ))}
              </div>
              <ErrorText id={errorId} message={error} />
            </fieldset>
          );
        })}
      </div>
    );
  }

  const error = state.errors[question.key];
  const errorId = `${question.id}-error`;
  const current = state.draft[question.key];
  const multi = question.kind === 'multi';
  const selected = (value: string) =>
    multi ? Array.isArray(current) && (current as string[]).includes(value) : current === value;
  // A small gap sets "Not sure" and "None" apart from the real options.
  const firstExclusive = multi ? question.options.findIndex((o) => question.exclusive.includes(o.value)) : -1;
  const choose = (value: string) =>
    set(question.key, multi ? toggleMulti(current as string[] | undefined, value, question.exclusive) : value);

  return (
    <fieldset aria-describedby={`${hintId} ${errorId}`} className="flex flex-col gap-3">
      <legend className="mb-3">
        <h1 tabIndex={-1} className={headingClass}>
          {question.title}
        </h1>
      </legend>
      <p id={hintId} className="text-ink-soft">
        {question.hint}
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {question.options.map((o, i) => (
          <div key={o.value} className={i > 0 && i === firstExclusive ? 'mt-3' : ''}>
            <Choice
              type={multi ? 'checkbox' : 'radio'}
              name={question.key}
              option={o}
              checked={selected(o.value)}
              invalid={Boolean(error)}
              onChange={() => choose(o.value)}
            />
          </div>
        ))}
      </div>
      <ErrorText id={errorId} message={error} />
    </fieldset>
  );
}

interface ChoiceProps {
  type: 'radio' | 'checkbox';
  name: string;
  option: Option;
  checked: boolean;
  invalid: boolean;
  compact?: boolean;
  onChange: () => void;
}

/** One big, tappable answer. The real input stays in the page so keyboards and screen readers work as usual. */
function Choice({ type, name, option, checked, invalid, compact, onChange }: ChoiceProps) {
  const id = `${name}-${option.value}`;
  return (
    <label
      htmlFor={id}
      className={`flex min-h-13 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink items-center gap-3 rounded-card border px-4 py-3 transition-[background-color,border-color,transform] duration-150 ease-out-expo active:scale-[0.99] ${
        compact ? 'justify-center px-2 text-center' : ''
      } ${checked ? 'border-ink bg-selected' : invalid ? 'border-error/60 bg-surface' : 'border-line-strong bg-surface hover:border-ink/40'}`}
    >
      <input
        id={id}
        type={type}
        name={name}
        value={option.value}
        checked={checked}
        onChange={onChange}
        aria-invalid={invalid ? true : undefined}
        className={`size-5 shrink-0 cursor-pointer appearance-none border-2 border-ink/55 bg-surface transition-colors duration-150 checked:border-ink checked:bg-ink ${
          type === 'radio' ? 'rounded-full checked:shadow-[inset_0_0_0_3px_var(--color-surface)]' : 'tick rounded-md'
        } ${compact ? 'sr-only' : ''}`}
      />
      <span className={checked ? 'font-medium' : ''}>{option.label}</span>
    </label>
  );
}
