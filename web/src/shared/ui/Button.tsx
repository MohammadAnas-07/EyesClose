import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'quiet';

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-control text-base font-medium ' +
  'transition-[background-color,color,border-color,transform] duration-fast ease-out-expo ' +
  'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 cursor-pointer';

const variants: Record<Variant, string> = {
  primary: 'px-6 bg-ink text-surface hover:bg-ink/85',
  secondary: 'px-6 border border-line-strong bg-surface text-ink hover:border-ink hover:bg-tint',
  quiet: 'px-3 -ml-3 text-ink-soft hover:bg-tint hover:text-ink',
};

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
