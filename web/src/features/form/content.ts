import { z } from 'zod';
import { checklistItemSchema } from './checklist';

// Bundled at build time, so no request ever reveals which items a user sees.
const files = import.meta.glob('../../../../content/checklist/*.json', { eager: true, import: 'default' });

export const checklistItems = z.array(checklistItemSchema).parse(Object.values(files));
