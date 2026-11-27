/** The only placeholders a letter may use. Anything else in {{ }} is an error. */
export const TOKENS = ['deceasedName', 'writerName', 'date', 'institution'] as const;
export type Token = (typeof TOKENS)[number];
export type TokenValues = Readonly<Record<Token, string>>;

const TOKEN_PATTERN = /\{\{([^{}]*)\}\}/g;

export class TemplateError extends Error {}

const isToken = (name: string): name is Token => (TOKENS as readonly string[]).includes(name);

/** Names of all tokens used in a text, so content can be checked before anyone fills it. */
export function tokensIn(text: string): string[] {
  return [...text.matchAll(TOKEN_PATTERN)].map((m) => m[1] ?? '');
}

/**
 * Fills {{token}} placeholders in one pass. Values are inserted as plain text and never read again,
 * so a value cannot add a placeholder of its own. No eval, no Function, no template engine.
 */
export function fillText(text: string, values: TokenValues): string {
  const filled = text.replace(TOKEN_PATTERN, (_, name: string) => {
    if (!isToken(name)) throw new TemplateError(`Unknown placeholder: ${name}`);
    return values[name];
  });
  if (filled.includes('{{') || filled.includes('}}')) throw new TemplateError('A placeholder was left unfilled.');
  return filled;
}
