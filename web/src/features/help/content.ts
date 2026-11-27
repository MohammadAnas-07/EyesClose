import type { Answers } from '../form/answers';
import { parseHelpPages, type HelpPage } from './schema';

// Bundled at build time, so opening the checklist makes no request for these.
const files = import.meta.glob('../../../../content/help/*.json', { eager: true, import: 'default' });

export const helpPages = parseHelpPages(Object.values(files));

/** Pages that the form answers make clearly relevant. Only existing questions are used. */
const RELEVANT: Record<string, (a: Answers) => boolean> = {
  'no-death-certificate': (a) => a.deathCertificate === 'waiting' || a.deathCertificate === 'not-yet',
  'no-nominee': (a) => a.nominee === 'no',
  'legal-heir-and-succession': (a) => a.will === 'no',
  'joint-account': (a) => a.jointAccount === 'yes',
};

/** Every help page, the relevant ones first, each group in content order. */
export function helpRowsFor(answers: Answers, pages: readonly HelpPage[] = helpPages): { page: HelpPage; relevant: boolean }[] {
  const rows = pages.map((page) => ({ page, relevant: RELEVANT[page.slug]?.(answers) ?? false }));
  return [...rows.filter((r) => r.relevant), ...rows.filter((r) => !r.relevant)];
}
