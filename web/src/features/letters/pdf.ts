import { FOOTER, type LetterDocument, type Line } from './compose';

// A4 in points, 20mm margins (architecture.md), 12pt body text.
const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = 56.69;
const SIZE = 12;
const LEADING = 17;
const TITLE_SIZE = 18;
const FOOTER_SIZE = 9;

/**
 * Builds the PDF on this device. pdf-lib is loaded here, only when the user asks for a PDF,
 * and uses its built-in Helvetica, so no font file is downloaded.
 */
export async function renderPdf(doc: LetterDocument): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  // No names in the file's metadata.
  pdf.setTitle('Letter prepared with EyesClose');
  pdf.setCreator('EyesClose');
  pdf.setProducer('EyesClose');
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0, 0, 0);
  const right = PAGE.width - MARGIN;
  const maxWidth = right - MARGIN;

  type Font = typeof regular;
  const wrap = (text: string, font: Font, size: number, width: number): string[] => {
    const out: string[] = [];
    let current = '';
    for (const word of text.split(' ')) {
      const next = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > width && current) {
        out.push(current);
        current = word;
      } else current = next;
    }
    out.push(current);
    return out;
  };

  const drawPage = (lines: Line[]) => {
    let page = pdf.addPage([PAGE.width, PAGE.height]);
    let y = PAGE.height - MARGIN;
    const footer = () =>
      page.drawText(FOOTER, { x: MARGIN, y: MARGIN / 2, size: FOOTER_SIZE, font: regular, color: black });
    footer();
    const need = (h: number) => {
      if (y - h < MARGIN) {
        page = pdf.addPage([PAGE.width, PAGE.height]);
        y = PAGE.height - MARGIN;
        footer();
      }
    };
    const text = (s: string, x: number, font: Font = regular, size = SIZE) =>
      page.drawText(s, { x, y, size, font, color: black });
    const rule = (x: number) =>
      page.drawLine({ start: { x, y: y - 2 }, end: { x: right, y: y - 2 }, thickness: 0.6, color: black });

    for (const line of lines) {
      switch (line.kind) {
        case 'title':
          need(TITLE_SIZE + LEADING);
          y -= TITLE_SIZE - SIZE;
          text(line.text, MARGIN, bold, TITLE_SIZE);
          y -= LEADING + 8;
          break;
        case 'text':
          for (const part of wrap(line.text, line.bold ? bold : regular, SIZE, maxWidth)) {
            need(LEADING);
            text(part, MARGIN, line.bold ? bold : regular);
            y -= LEADING;
          }
          break;
        case 'item': {
          const indent = 18;
          wrap(line.text, regular, SIZE, maxWidth - indent).forEach((part, i) => {
            need(LEADING);
            if (i === 0) text(`${line.number}.`, MARGIN);
            text(part, MARGIN + indent);
            y -= LEADING;
          });
          break;
        }
        case 'field': {
          // A blank line to write on by hand, with a little more room than normal text.
          need(LEADING + 8);
          y -= 6;
          const label = line.label ? `${line.label}:` : '';
          text(label, MARGIN);
          rule(MARGIN + (label ? regular.widthOfTextAtSize(label, SIZE) + 6 : 0));
          y -= LEADING + 2;
          break;
        }
        case 'ticks': {
          need(LEADING * 2);
          text(`${line.label}:`, MARGIN);
          y -= LEADING + 2;
          let x = MARGIN;
          for (const option of line.options) {
            page.drawRectangle({ x, y: y - 1, width: 10, height: 10, borderColor: black, borderWidth: 0.8 });
            text(option, x + 16);
            x += 16 + regular.widthOfTextAtSize(option, SIZE) + 28;
          }
          // Room to write what "other" means.
          page.drawLine({ start: { x: x - 20, y: y - 2 }, end: { x: right, y: y - 2 }, thickness: 0.6, color: black });
          y -= LEADING;
          break;
        }
        case 'gap':
          y -= LEADING * 0.6;
          break;
      }
    }
  };

  drawPage(doc.cover);
  drawPage(doc.letter);
  return pdf.save();
}
