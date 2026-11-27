import { NAME_ERROR, NAME_REQUIRED, NAME_TOO_LONG } from '../form/answers';
import { composeLetter, toPlainText } from './compose';
import { letters } from './content';
import { validateLetterDetails } from './details';

const general = letters.find((l) => l.id === 'general-intimation-letter')!;
const details = { deceasedName: 'Test Name Markerone', writerName: 'Writer Markertwo', date: '2026-11-27' };
const typed = { ...details, institution: 'Airtel', subject: 'mobile' as const };
const letterText = (d = typed) => toPlainText(composeLetter(general, d, null, null).letter);

describe('general intimation letter', () => {
  it('puts the names, date, institution and subject in the letter and fills every placeholder', () => {
    const doc = composeLetter(general, typed, 'Jio', null);
    const text = toPlainText(doc.letter);
    expect(text).toContain('The Customer Care Team\nAirtel');
    expect(text).toContain('Date: 27 November 2026');
    expect(text).toContain('Subject: Death of your customer Test Name Markerone');
    expect(text).toContain('This letter is about their mobile number.');
    expect(text).toMatch(/^Mobile number: _+$/m);
    expect(text).toContain('Name: Writer Markertwo');
    expect(text).not.toMatch(/\{\{|\}\}/);
    expect(doc.fileName).toBe('eyesclose-intimation-letter.pdf');
  });

  it('uses the right reference line for each subject', () => {
    expect(letterText({ ...typed, subject: 'wallet' as never })).toMatch(/^Registered mobile number or UPI ID: _+$/m);
    expect(letterText({ ...typed, subject: 'policy' as never })).toMatch(/^Policy number: _+$/m);
    expect(letterText({ ...typed, subject: 'card' as never })).toContain('This letter is about their card or loan account.');
    expect(letterText({ ...typed, subject: 'other' as never })).toMatch(/^Account or reference number: _+$/m);
  });

  it('claims no process and asks for no transfer or closure', () => {
    const text = letterText().toLowerCase();
    for (const word of ['transfer', 'close', 'closure', 'form', 'within', 'days', 'rule', 'enclosed']) {
      expect(text, word).not.toMatch(new RegExp(`\\b${word}\\b`));
    }
    expect(text).toContain('please tell me in writing what your process is');
    expect(text).toContain('acknowledge');
  });

  it('tells the user to ask for an acknowledgement and keep a copy, on the cover page only', () => {
    const doc = composeLetter(general, typed, null, null);
    const cover = toPlainText(doc.cover);
    expect(cover).toContain('Take or send it to the customer care of Airtel.');
    expect(cover).toContain('Ask for a stamped copy or a written acknowledgement that they received it.');
    expect(cover).toContain('Keep a copy for yourself.');
    expect(cover).toContain('Not yet checked by a professional.');
    expect(toPlainText(doc.letter)).not.toContain('Not yet checked');
  });

  it('records that it claims no process', () => {
    expect(general.kind).toBe('intimation');
    if (general.kind === 'intimation') {
      expect(general.sourceType).toBe('general intimation, no process claimed');
      expect(general.written).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(general.verifiedBy).toBeNull();
  });

  it('requires the company name and the subject, and checks the name like any other', () => {
    const r = validateLetterDetails(details, true);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.institution).toBe(NAME_REQUIRED);
      expect(r.errors.subject).toBeDefined();
    }
    for (const [bad, message] of [
      ['<script>alert(1)</script>', NAME_ERROR],
      ['. . .', NAME_ERROR],
      ['A'.repeat(200), NAME_TOO_LONG],
    ]) {
      const v = validateLetterDetails({ ...typed, institution: bad }, true);
      expect(v.ok).toBe(false);
      if (!v.ok) expect(v.errors.institution).toBe(message);
    }
    expect(validateLetterDetails(typed, true).ok).toBe(true);
  });
});
