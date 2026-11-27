// @vitest-environment node
import { readFileSync } from 'node:fs';

// Guards the "nothing leaves your phone" promise: a change that loosens the CSP fails here.
const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8')) as {
  headers: { headers: { key: string; value: string }[] }[];
};
const csp = vercel.headers[0]!.headers.find((h) => h.key === 'Content-Security-Policy')!.value;
const directives = new Map(
  csp.split(';').map((d) => {
    const [name, ...values] = d.trim().split(/\s+/);
    return [name!, values] as const;
  }),
);

describe('Content-Security-Policy', () => {
  it('blocks everything by default and allows only our own origin', () => {
    expect(directives.get('default-src')).toEqual(["'none'"]);
    for (const name of ['script-src', 'style-src', 'font-src', 'connect-src']) expect(directives.get(name)).toEqual(["'self'"]);
    expect(directives.get('img-src')).toEqual(["'self'", 'data:']);
  });

  it('has no unsafe keywords and no third-party origins', () => {
    expect(csp).not.toMatch(/unsafe-|https?:|\*/);
  });

  it('keeps framing, forms, plugins and string-to-HTML sinks locked', () => {
    expect(directives.get('frame-ancestors')).toEqual(["'none'"]);
    expect(directives.get('form-action')).toEqual(["'none'"]);
    expect(directives.get('object-src')).toEqual(["'none'"]);
    expect(directives.get('require-trusted-types-for')).toEqual(["'script'"]);
  });
});
