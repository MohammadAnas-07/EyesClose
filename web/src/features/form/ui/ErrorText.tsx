import { InfoIcon } from './icons';

/** A field's error, linked by id. Always rendered so screen readers announce the message when it appears. */
export function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} aria-live="polite" className="text-error empty:hidden">
      {message && (
        <span className="mt-2 flex gap-2">
          <InfoIcon className="mt-0.5 size-5 shrink-0" />
          {message}
        </span>
      )}
    </p>
  );
}
