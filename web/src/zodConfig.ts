import { z } from 'zod';

// Zod checks for eval with `new Function`. The CSP blocks it and Chrome logs an error, so turn the check off.
// Imported first in main.tsx, before any schema is parsed.
z.config({ jitless: true });
