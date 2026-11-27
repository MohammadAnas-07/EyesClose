import { Button } from '../../../shared/ui/Button';
import { BackIcon } from './icons';

/** Placeholder until the guidance pages are written in a later chunk. */
export function GuideScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      <h1 tabIndex={-1} className="text-[clamp(1.75rem,1.4rem+1.6vw,2.25rem)] text-balance outline-none">
        This guide is not ready yet
      </h1>
      <p className="text-lg">
        We are still writing it. It will explain this case in plain words. It will be general information, not legal
        advice.
      </p>
      <p className="text-ink-soft">For now, the note on your checklist is a good place to start.</p>
      <Button variant="secondary" onClick={onBack} className="w-full sm:w-auto sm:self-start">
        <BackIcon className="size-5" />
        Back to my checklist
      </Button>
    </div>
  );
}
