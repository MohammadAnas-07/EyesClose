/** What a general letter is about. Fixed text only, so nothing typed reaches these words. */
export const SUBJECTS = {
  mobile: { label: 'Mobile number', phrase: 'mobile number', reference: 'Mobile number' },
  wallet: { label: 'Wallet or UPI account', phrase: 'wallet or UPI account', reference: 'Registered mobile number or UPI ID' },
  policy: { label: 'Insurance policy', phrase: 'insurance policy', reference: 'Policy number' },
  card: { label: 'Card or loan', phrase: 'card or loan account', reference: 'Card or loan account number' },
  other: { label: 'Something else', phrase: 'account with you', reference: 'Account or reference number' },
} as const;

export type Subject = keyof typeof SUBJECTS;
export const SUBJECT_KEYS = Object.keys(SUBJECTS) as [Subject, ...Subject[]];
