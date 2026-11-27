// Runs node-pg-migrate with DATABASE_URL taken from the environment, or from the
// repo root .env file. Uses Node's built-in env parser, so no dotenv dependency.
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_ENV_FILE = path.resolve(here, '../../.env');

/** A real environment variable wins over the .env file. Returns null if not found. */
export function resolveDatabaseUrl({ env = process.env, envFile = ROOT_ENV_FILE } = {}) {
  if (env.DATABASE_URL) return env.DATABASE_URL;
  if (envFile && existsSync(envFile)) {
    const parsed = parseEnv(readFileSync(envFile, 'utf8'));
    if (parsed.DATABASE_URL) return parsed.DATABASE_URL;
  }
  return null;
}

function main(args) {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    console.error(
      'DATABASE_URL is not set. Copy .env.example to .env in the repo root, or export DATABASE_URL, then try again.',
    );
    return 1;
  }
  const require = createRequire(import.meta.url);
  const pkgPath = require.resolve('node-pg-migrate/package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin['node-pg-migrate'];
  const bin = path.resolve(path.dirname(pkgPath), binRel);
  const result = spawnSync(
    process.execPath,
    [bin, '-m', path.resolve(here, '../migrations'), '-j', 'sql', ...args],
    { stdio: 'inherit', env: { ...process.env, DATABASE_URL: databaseUrl } },
  );
  return result.status ?? 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
