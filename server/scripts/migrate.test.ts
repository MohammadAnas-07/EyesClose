import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs script without type declarations
import { resolveDatabaseUrl } from './migrate.mjs';

function envFileWith(content: string): string {
  const file = path.join(mkdtempSync(path.join(tmpdir(), 'eyesclose-env-')), '.env');
  writeFileSync(file, content);
  return file;
}

describe('resolveDatabaseUrl', () => {
  it('reads DATABASE_URL from the .env file', () => {
    const envFile = envFileWith('DATABASE_URL=postgres://fake:fake@localhost:5432/fake\n');
    expect(resolveDatabaseUrl({ env: {}, envFile })).toBe('postgres://fake:fake@localhost:5432/fake');
  });

  it('prefers a real environment variable over the file', () => {
    const envFile = envFileWith('DATABASE_URL=postgres://from-file\n');
    expect(resolveDatabaseUrl({ env: { DATABASE_URL: 'postgres://from-env' }, envFile })).toBe('postgres://from-env');
  });

  it('returns null when nothing is set', () => {
    expect(resolveDatabaseUrl({ env: {}, envFile: path.join(tmpdir(), 'missing-eyesclose.env') })).toBeNull();
  });
});
