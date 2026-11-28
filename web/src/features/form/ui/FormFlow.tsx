import { useEffect, useReducer, useRef } from 'react';
import { checklistItems } from '../content';
import { flowReducer, initialState } from '../flow';
import { LetterScreen } from '../../letters/ui/LetterScreen';
import { GuideScreen } from './GuideScreen';
import { QuestionScreen } from './QuestionScreen';
import { ResultScreen } from './ResultScreen';
import { StartScreen } from './StartScreen';

export function FormFlow() {
  const [state, dispatch] = useReducer(flowReducer, initialState);
  const main = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Each new screen moves focus to its heading, so screen readers and keyboards start at the top.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    main.current?.querySelector<HTMLElement>('h1')?.focus();
    window.scrollTo({ top: 0 });
  }, [state.screen, state.step]);

  return (
    <>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gutter pb-12 pt-5">
        <header className="no-print mb-8">
          <a href="/" className="inline-flex min-h-11 items-center rounded-control text-base font-medium tracking-heading">
            EyesClose
          </a>
        </header>
        <main ref={main} key={`${state.screen}-${state.step}`} className="flex flex-1 animate-fade-in flex-col">
          {state.screen === 'start' && <StartScreen onStart={() => dispatch({ type: 'start' })} />}
          {state.screen === 'question' && <QuestionScreen state={state} dispatch={dispatch} />}
          {state.screen === 'result' && state.answers && (
            <ResultScreen answers={state.answers} items={checklistItems} checked={state.checked} dispatch={dispatch} />
          )}
          {state.screen === 'guide' && state.guide && <GuideScreen onBack={() => dispatch({ type: 'back' })} />}
          {state.screen === 'letter' && <LetterScreen state={state} dispatch={dispatch} />}
        </main>
      </div>
      {/* Slim footer, so the form stays the focus. Links open in a new tab: leaving would clear the answers. */}
      <footer className="app-footer no-print bg-paper-dark gutter py-10 text-sm text-surface">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
          <div className="flex flex-col gap-1 text-ink-on-dark-soft sm:flex-row sm:items-center sm:justify-between">
            <a href="/data" target="_blank" rel="noopener noreferrer" className="footer-dark-link self-start">
              How we handle your data<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p>General information, not legal advice.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
