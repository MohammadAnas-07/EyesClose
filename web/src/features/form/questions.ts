import type { AnswerKey } from './answers';

export interface Option {
  value: string;
  label: string;
}

interface Base {
  id: string;
  title: string;
  hint?: string;
}

export interface TextQuestion extends Base {
  kind: 'text';
  key: 'name';
  label: string;
}

export interface SingleQuestion extends Base {
  kind: 'single';
  key: AnswerKey;
  options: Option[];
}

export interface MultiQuestion extends Base {
  kind: 'multi';
  key: AnswerKey;
  options: Option[];
  /** Options that cannot be combined with others, such as "None" and "Not sure". */
  exclusive: string[];
}

/** Several small yes / no / not sure parts shown together on one screen. */
export interface TriGroupQuestion extends Base {
  kind: 'tri-group';
  parts: { key: AnswerKey; label: string; hint?: string }[];
}

export type Question = TextQuestion | SingleQuestion | MultiQuestion | TriGroupQuestion;

export const NOT_SURE: Option = { value: 'not-sure', label: 'Not sure' };

export const TRI_OPTIONS: Option[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  NOT_SURE,
];

export const QUESTIONS: Question[] = [
  {
    id: 'name',
    kind: 'text',
    key: 'name',
    title: 'What was their full name?',
    label: 'Full name of the person who died',
    hint: 'Use English letters (A to Z). This name will be used later in letters. You can leave it blank and write it by hand later.',
  },
  {
    id: 'relationship',
    kind: 'single',
    key: 'relationship',
    title: 'How were you related to them?',
    hint: 'I was their...',
    options: [
      { value: 'son', label: 'Son' },
      { value: 'daughter', label: 'Daughter' },
      { value: 'husband', label: 'Husband' },
      { value: 'wife', label: 'Wife' },
      { value: 'parent', label: 'Parent' },
      { value: 'sibling', label: 'Brother or sister' },
      { value: 'other', label: 'Other' },
      { value: 'not-sure', label: 'Not sure, or I would rather not say' },
    ],
  },
  {
    id: 'deathCertificate',
    kind: 'single',
    key: 'deathCertificate',
    title: 'Do you have the death certificate?',
    hint: 'This is the official paper from the local registrar that records the death.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'waiting', label: 'We applied and are waiting' },
      { value: 'not-yet', label: 'Not yet' },
      NOT_SURE,
    ],
  },
  {
    id: 'banks',
    kind: 'multi',
    key: 'banks',
    title: 'Which banks did they have accounts with?',
    hint: 'Choose all that apply.',
    options: [
      { value: 'sbi', label: 'SBI' },
      { value: 'hdfc', label: 'HDFC Bank' },
      { value: 'icici', label: 'ICICI Bank' },
      { value: 'axis', label: 'Axis Bank' },
      { value: 'pnb', label: 'Punjab National Bank' },
      { value: 'bob', label: 'Bank of Baroda' },
      { value: 'kotak', label: 'Kotak Mahindra Bank' },
      { value: 'canara', label: 'Canara Bank' },
      { value: 'other', label: 'Another bank' },
      NOT_SURE,
      { value: 'none', label: 'They had no bank account' },
    ],
    exclusive: ['not-sure', 'none'],
  },
  {
    id: 'bankDetails',
    kind: 'tri-group',
    title: 'A few more things about their money',
    hint: 'These can change the steps. It is fine to answer "Not sure".',
    parts: [
      { key: 'jointAccount', label: 'Was any bank account joint?', hint: 'A joint account is shared by two or more people.' },
      { key: 'nominee', label: 'Did they name a nominee?', hint: 'A nominee is the person they chose to receive the money.' },
      { key: 'will', label: 'Did they leave a will?', hint: 'A will is a written paper that says who gets what.' },
    ],
  },
  {
    id: 'mobile',
    kind: 'multi',
    key: 'mobile',
    title: 'Which mobile networks did they use?',
    hint: 'Choose all that apply. The network name is often on the SIM card.',
    options: [
      { value: 'jio', label: 'Jio' },
      { value: 'airtel', label: 'Airtel' },
      { value: 'vi', label: 'Vi (Vodafone Idea)' },
      { value: 'bsnl', label: 'BSNL' },
      { value: 'other', label: 'Another network' },
      NOT_SURE,
    ],
    exclusive: ['not-sure'],
  },
  {
    id: 'upi',
    kind: 'multi',
    key: 'upi',
    title: 'Which payment apps did they use?',
    hint: 'These are UPI or wallet apps used to pay from a phone. Choose all that apply.',
    options: [
      { value: 'phonepe', label: 'PhonePe' },
      { value: 'gpay', label: 'Google Pay' },
      { value: 'paytm', label: 'Paytm' },
      { value: 'other', label: 'Another app' },
      NOT_SURE,
      { value: 'none', label: 'They did not use one' },
    ],
    exclusive: ['not-sure', 'none'],
  },
  {
    id: 'work',
    kind: 'multi',
    key: 'work',
    title: 'Did they have a job or pension?',
    hint: 'EPFO is the provident fund for people in private jobs. Choose all that apply. State pensions may differ, so for those contact the pension office.',
    options: [
      { value: 'epfo', label: 'Private job with provident fund (EPFO)' },
      { value: 'pension', label: 'Central government pension' },
      { value: 'neither', label: 'Neither' },
      NOT_SURE,
    ],
    exclusive: ['neither', 'not-sure'],
  },
  {
    id: 'money',
    kind: 'tri-group',
    title: 'Did they have insurance or loans?',
    parts: [
      { key: 'lifeInsurance', label: 'Life insurance' },
      { key: 'healthInsurance', label: 'Health insurance' },
      { key: 'vehicleInsurance', label: 'A vehicle and its insurance' },
      { key: 'loans', label: 'Any loan or credit card' },
    ],
  },
  {
    id: 'online',
    kind: 'tri-group',
    title: 'Did they have any of these online?',
    parts: [
      { key: 'emailSocial', label: 'Email or social media accounts' },
      { key: 'subscriptions', label: 'Paid subscriptions', hint: 'For example Netflix or Amazon.' },
      { key: 'crypto', label: 'Crypto or online investments' },
    ],
  },
];

/** The answer keys a question fills in. */
export function keysOf(q: Question): AnswerKey[] {
  return q.kind === 'tri-group' ? q.parts.map((p) => p.key) : [q.key];
}
