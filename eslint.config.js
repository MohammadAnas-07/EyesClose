import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist', '**/coverage', '**/node_modules', 'docs/**', '.claude/**', '.agents/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['web/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    files: ['server/**/*.{ts,mjs}', '*.js', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    // Privacy rule: form and letter code must never make network calls.
    files: ['web/src/features/form/**', 'web/src/features/letters/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'Form and letter code must not make network calls.' },
        { name: 'XMLHttpRequest', message: 'Form and letter code must not make network calls.' },
        { name: 'WebSocket', message: 'Form and letter code must not make network calls.' },
        { name: 'EventSource', message: 'Form and letter code must not make network calls.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'navigator', property: 'sendBeacon', message: 'Form and letter code must not make network calls.' },
        { object: 'window', property: 'fetch', message: 'Form and letter code must not make network calls.' },
        { object: 'globalThis', property: 'fetch', message: 'Form and letter code must not make network calls.' },
      ],
    },
  },
);
