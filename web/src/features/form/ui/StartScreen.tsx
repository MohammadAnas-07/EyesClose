import { Button } from '../../../shared/ui/Button';
import { QUESTIONS } from '../questions';
import { HarderEntry } from './HarderEntry';
import { LockIcon } from './icons';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <p className="text-ink-soft">We are sorry for your loss.</p>
      <h1 tabIndex={-1} className="text-title text-balance outline-none">
        Know what to close, and in what order
      </h1>
      <p className="text-lg">
        Answer {QUESTIONS.length} short questions about the person who died. You will get a checklist of what to close
        first, and who to contact.
      </p>
      <div className="flex gap-3 rounded-card bg-tint p-4">
        <LockIcon className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-medium">Your answers stay in this browser and disappear when you close this page.</p>
          <p className="mt-1 text-ink-soft">Nothing is sent to us. Refreshing the page also clears your answers.</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <Button onClick={onStart} className="w-full sm:w-auto sm:self-start">
          Start the questions
        </Button>
        <p className="text-sm text-ink-soft">You can choose "Not sure" for any question.</p>
      </div>
      {/* Same tab: nothing has been typed yet, so nothing is lost. */}
      <HarderEntry className="mt-2" />
    </div>
  );
}
