import { ArrowIcon } from './icons';

/**
 * The quiet second way in, for families whose case does not fit the usual steps.
 * It looks like a card, never like the main button. newTab: answers may exist, and leaving would clear them.
 */
export function HarderEntry({ dark = false, newTab = false, className = '' }: { dark?: boolean; newTab?: boolean; className?: string }) {
  const tone = dark
    ? 'border-line-dark text-surface hover:border-white/40 hover:bg-white/5'
    : 'border-line-strong bg-surface text-ink hover:border-ink/35 hover:bg-tint';
  return (
    <a
      href="/help"
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group flex min-h-14 cursor-pointer items-center gap-4 rounded-card border px-4 py-3 transition-[background-color,border-color,transform] duration-150 ease-out-expo active:scale-[0.99] ${tone} ${className}`}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-medium">My situation is harder</span>
        <span className={`text-sm ${dark ? 'text-ink-on-dark-soft' : 'text-ink-soft'}`}>
          No death certificate yet, a joint account, a death abroad, or a police case
        </span>
      </span>
      <ArrowIcon className="size-5 shrink-0 transition-transform duration-150 ease-out-expo group-hover:translate-x-0.5" />
      {newTab && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
