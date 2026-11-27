import { ArrowIcon } from './icons';

/** The quiet second way in, for families whose case does not fit the usual steps. A card, never the main button. */
export function HarderEntry({ className = '' }: { className?: string }) {
  return (
    <a
      href="/help"
      className={`group flex min-h-14 cursor-pointer items-center gap-4 rounded-card border border-line-strong bg-surface px-4 py-3 text-ink transition-[background-color,border-color,transform] duration-150 ease-out-expo hover:border-ink/35 hover:bg-tint active:scale-[0.99] ${className}`}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-medium">My situation is harder</span>
        <span className="text-sm text-ink-soft">No death certificate yet, a joint account, a death abroad, or a police case</span>
      </span>
      <ArrowIcon className="size-5 shrink-0 transition-transform duration-150 ease-out-expo group-hover:translate-x-0.5" />
    </a>
  );
}
