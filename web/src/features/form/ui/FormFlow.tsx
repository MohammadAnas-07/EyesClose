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
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pb-12 pt-5 sm:px-8">
      <header className="no-print mb-8">
        <a href="/" className="rounded-md text-base font-semibold tracking-heading">
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
      <footer className="no-print mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-line-strong pt-6 text-sm text-ink-soft">
        {/* New tab: leaving this page would clear the answers, which live only in memory. */}
        <a href="/help" target="_blank" rel="noopener noreferrer" className="footer-link">
          Harder situations<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <p>General information, not legal advice.</p>
      </footer>
    </div>
  );
}
