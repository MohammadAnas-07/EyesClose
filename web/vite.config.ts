/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `vite preview` sends the same security headers as production (vercel.json), so the CSP is tested locally.
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as {
  headers: { headers: { key: string; value: string }[] }[];
};
const productionHeaders = Object.fromEntries(vercel.headers[0]!.headers.map((h) => [h.key, h.value]));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { target: 'es2020', sourcemap: false },
  // Checklist and letter content lives in ../content and is bundled at build time.
  server: { fs: { allow: ['..'] } },
  preview: { headers: productionHeaders },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
