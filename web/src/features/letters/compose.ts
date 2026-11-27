import type { Letter } from './content';
import { formatDate, validateLetterField, type LetterDetails } from './details';
import { fillText, type TokenValues } from './template';

/** One line of a printed page. The PDF, the print view and the preview all draw from these. */
export type Line =
  | { kind: 'title'; text: string }
  | { kind: 'text'; text: string; bold?: boolean }
  | { kind: 'field'; label: string }
  | { kind: 'ticks'; label: string; options: string[] }
  | { kind: 'item'; number: number; text: string }
  | { kind: 'gap' };

export interface LetterDocument {
  fileName: string;
  /** Page 1 is "Before you print", for the user only. Page 2 is the letter. */
  cover: Line[];
  letter: Line[];
}

export const NOT_CHECKED = 'Not yet checked by a professional.';
/** The disclaimer belongs on the user's own page; the letter handed in only says who prepared it. */
export const COVER_FOOTER = 'Prepared with EyesClose. General information, not legal advice.';
export const LETTER_FOOTER = 'Prepared with EyesClose';
const BLANK_INSTITUTION = '______________________________';

function coverPage(letter: Letter, formUrl: string | null): Line[] {
  const { takeWith, askAt } = letter;
  const steps = [
    'Print the letter on the next page.',
    'Fill in the blank lines by hand.',
    'Tick the box that describes you.',
    'Sign the letter.',
    'Attach photocopies of the papers listed in the letter.',
    'Keep a copy for yourself.',
    `Take it with ${takeWith}.`,
  ];
  return [
    { kind: 'title', text: 'Before you print' },
    { kind: 'text', text: 'This page is for you. Please do not hand it in.' },
    { kind: 'gap' },
    { kind: 'text', text: `${NOT_CHECKED} This letter is general information, not legal advice.`, bold: true },
    { kind: 'gap' },
    { kind: 'text', text: 'What to do:' },
    ...steps.map((text, i): Line => ({ kind: 'item', number: i + 1, text })),
    { kind: 'gap' },
    {
      kind: 'text',
      text: formUrl
        ? `For ${takeWith}, see the official page: ${formUrl} or ask at ${askAt}.`
        : `For ${takeWith}, ask at ${askAt}.`,
    },
    { kind: 'gap' },
    {
      kind: 'text',
      text: 'Account numbers, phone numbers and addresses are not typed into the app. Write them by hand on the printed letter.',
    },
  ];
}

/** Turns letter content plus the checked details into the lines of both pages. */
export function composeLetter(
  letter: Letter,
  details: LetterDetails,
  institution: string | null,
  formUrl: string | null,
): LetterDocument {
  return compose(letter, formUrl, {
    deceasedName: details.deceasedName,
    writerName: details.writerName,
    date: formatDate(details.date),
    institution: institution ?? BLANK_INSTITUTION,
  });
}

/** For the on-screen preview only: anything not valid yet shows as a blank line. */
export function previewLetter(
  letter: Letter,
  draft: Partial<Record<keyof LetterDetails, string>>,
  institution: string | null,
): LetterDocument {
  const ok = (key: keyof LetterDetails) => (draft[key] ?? '') !== '' && validateLetterField(key, draft[key]) === null;
  const blank = '____________';
  return compose(letter, null, {
    deceasedName: ok('deceasedName') ? draft.deceasedName!.trim() : blank,
    writerName: ok('writerName') ? draft.writerName!.trim() : blank,
    date: ok('date') ? formatDate(draft.date!) : blank,
    institution: institution ?? BLANK_INSTITUTION,
  });
}

function compose(letter: Letter, formUrl: string | null, values: TokenValues): LetterDocument {
  const lines: Line[] = [];
  for (const block of letter.letter) {
    switch (block.type) {
      case 'text':
        lines.push({ kind: 'text', text: fillText(block.text, values), bold: block.bold });
        break;
      case 'field':
        lines.push({ kind: 'field', label: block.label });
        break;
      case 'ticks':
        lines.push({ kind: 'ticks', label: block.label, options: block.options });
        break;
      case 'list':
        lines.push({ kind: 'text', text: block.title });
        block.items.forEach((t, i) => lines.push({ kind: 'item', number: i + 1, text: fillText(t, values) }));
        break;
      case 'gap':
        lines.push({ kind: 'gap' });
        break;
      case 'signature':
        lines.push(
          { kind: 'gap' },
          { kind: 'field', label: 'Signature' },
          { kind: 'text', text: fillText('Name: {{writerName}}', values) },
          { kind: 'field', label: 'Phone' },
          { kind: 'field', label: 'Address' },
          { kind: 'field', label: '' },
        );
        break;
    }
  }
  return { fileName: letter.fileName, cover: coverPage(letter, formUrl), letter: lines };
}

/** Plain text of a page, for the on-screen preview and tests. Never HTML. */
export function toPlainText(lines: Line[]): string {
  return lines
    .map((line) => {
      switch (line.kind) {
        case 'title':
        case 'text':
          return line.text;
        case 'field':
          return `${line.label ? `${line.label}: ` : ''}______________________________`;
        case 'ticks':
          return `${line.label}:  ${line.options.map((o) => `[ ] ${o}`).join('   ')} ________`;
        case 'item':
          return `${line.number}. ${line.text}`;
        case 'gap':
          return '';
      }
    })
    .join('\n');
}
