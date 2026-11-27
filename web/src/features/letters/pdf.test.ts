// @vitest-environment node
import { PDFDocument } from 'pdf-lib';
import { composeLetter } from './compose';
import { letters } from './content';
import { renderPdf } from './pdf';

const details = { deceasedName: 'Test Name Markerone', writerName: 'Writer Markertwo', date: '2026-11-27' };

describe('renderPdf', () => {
  it.each(letters.map((l) => [l.id, l] as const))('%s is a valid A4 PDF: cover page plus one letter page', async (_, letter) => {
    const bytes = await renderPdf(composeLetter(letter, details, letter.appliesTo[0]!.institution));
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(2);
    const { width, height } = pdf.getPage(0).getSize();
    expect([Math.round(width), Math.round(height)]).toEqual([595, 842]);
    // No names in the file metadata.
    expect(pdf.getTitle()).toBe('Letter prepared with EyesClose');
    expect(pdf.getAuthor()).toBeUndefined();
  });
});
