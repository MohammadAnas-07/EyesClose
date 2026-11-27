import type { Answers } from './answers';

export interface Note {
  id: string;
  title: string;
  text: string;
  /** Slug of the guidance page for this case. Pages come in a later chunk. */
  guide: string;
}

const unsure = (v: string) => v === 'yes' || v === 'not-sure';
const has = (list: readonly string[], ...values: string[]) => values.some((v) => list.includes(v));

const NOTES: { note: Note; applies: (a: Answers) => boolean }[] = [
  {
    note: {
      id: 'no-certificate',
      title: 'The death certificate is not ready yet',
      text: 'Many steps need the death certificate. It is fine to start with the steps that do not, and come back to the rest.',
      guide: 'no-death-certificate',
    },
    applies: (a) => a.deathCertificate !== 'yes',
  },
  {
    note: {
      id: 'joint-nominee-will',
      title: 'A joint account, a nominee or a will',
      text: 'These can change the steps, and each family is different. A lawyer can help you understand your case.',
      guide: 'joint-account-nominee-will',
    },
    applies: (a) => unsure(a.jointAccount) || unsure(a.nominee) || unsure(a.will),
  },
  {
    note: {
      id: 'locked-phone',
      title: 'If their phone is locked',
      text: 'You may not be able to get OTP messages. Do not try to guess their PIN or password. Tell the bank and the app company instead.',
      guide: 'locked-phone',
    },
    applies: (a) => has(a.upi, 'phonepe', 'gpay', 'paytm', 'other', 'not-sure'),
  },
  {
    note: {
      id: 'family-agreement',
      title: 'If the family does not agree',
      text: 'When brothers and sisters or other family members disagree about who should claim, banks may ask for legal papers. A lawyer can help.',
      guide: 'family-claims',
    },
    applies: (a) => ['son', 'daughter', 'sibling'].includes(a.relationship),
  },
  {
    note: {
      id: 'missing-id',
      title: 'If you cannot find their Aadhaar or PAN',
      text: 'Many places accept other papers. Ask each place which other documents they accept.',
      guide: 'missing-aadhaar-pan',
    },
    applies: (a) => !(a.banks.length === 1 && a.banks[0] === 'none'),
  },
  {
    note: {
      id: 'crypto',
      title: 'Crypto and other online money',
      text: 'Do not log in to their accounts. Write down what you find, and talk to a professional before anything is moved.',
      guide: 'crypto',
    },
    applies: (a) => unsure(a.crypto),
  },
];

/** The calm notes for hard cases that these answers bring up. */
export function notesFor(answers: Answers): Note[] {
  return NOTES.filter((n) => n.applies(answers)).map((n) => n.note);
}
