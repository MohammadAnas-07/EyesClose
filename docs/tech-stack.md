# Tech stack

Last updated 2026-11-27.

## Product code

| Choice | Why |
| --- | --- |
| React + TypeScript | Common, well supported, strict types catch mistakes in content-driven code. |
| Vite | Fast builds, small output, simple config. |
| Tailwind CSS v4 | Tokens from design.md live in one `@theme` block in `web/src/index.css`. Unused CSS is dropped, so pages stay light. |
| Inter, self-hosted (`@fontsource-variable/inter`) | The font design.md uses. Self-hosted so no font CDN is contacted, the CSP stays `'self'`, and it works offline. |
| motion | Animation library. Used sparingly, for calm fades only. Not imported yet, so it adds nothing to the bundle. |
| dialkit (dev only) | A tuning panel to adjust motion values while building. Dev dependency only; never shipped. |
| pdf-lib (planned) | Makes PDFs in the browser. Built-in Helvetica, so no font download. Lazy loaded. See prd.md open question 4. |
| Vitest + Testing Library | Unit and component tests, same config as Vite. |
| ESLint (typescript-eslint, react-hooks) | Lint. Also enforces "no network calls" in form, letter and help code, and in `web/public/menu.js`. |
| `web/public/menu.js` (our own, about 20 lines) | The only script on the plain HTML pages. Closes the home page's phone menu after a link is tapped, or on Escape. It reads nothing and sends nothing. The menu is a `<details>`, so it still works if the file does not load. Served from our own origin, so the CSP stays `script-src 'self'`. |
| `scripts/review-packet.mjs` | Builds `docs/REVIEW_PACKET.md` from `content/` (`npm run review-packet`). A test fails if the packet is out of date. |
| Node.js + TypeScript (`server/`) | Only for the waitlist, feedback and counters. Plain functions, deployed as Vercel functions. |
| node-pg-migrate | Plain SQL migrations for the small database. |
| Postgres 17 in Docker | Local database. Mirrors production. |
| Supabase (Mumbai, ap-south-1) | Recommended production database, used only as plain Postgres. Neon had no India region on 2026-11-27. See prd.md open question 7. |
| Resend | Waitlist confirmation email only. |
| Vercel | Hosting. Security headers (CSP) are set in `vercel.json`. |
| GitHub Actions | CI: lint, type check, tests, build. |

## Developer tools (not shipped in the app)

Installed for Claude Code on 2026-11-27. Project-level skills live in `.claude/skills/` (ignored by git;
`skills-lock.json` is committed so they can be restored with `npx skills install`).
Plugins are installed at "local" scope for this project.

| Tool | Source | What it is for here |
| --- | --- | --- |
| transitions-dev skill | github.com/Jakubantalik/transitions.dev | Ready CSS transitions. Use only calm ones. |
| impeccable | github.com/pbakaus/impeccable | Design quality skill and agents. The design hook is on (`.impeccable/config.json`): it checks UI files after each edit. |
| superpowers | github.com/obra/superpowers (via claude-plugins-official) | Planning, TDD and debugging workflow skills. |
| diagram-design skill | github.com/cathrynlavery/diagram-design | Architecture and flow diagrams for docs. |
| design-taste-frontend skill | github.com/Leonxlnx/taste-skill | Frontend design review. |
| unslop plugin | github.com/heydamir/unslop | Removes generic "AI-looking" UI patterns. |
| hallmark skill (global) | github.com/Nutlope/hallmark | Design skill for new pages. |
| mattpocock-skills | github.com/mattpocock/skills (via claude-plugins-official) | Engineering skills (TypeScript, testing). |
| ponytail plugin | github.com/DietrichGebert/ponytail | Keeps code minimal; shows cost band. |
| security-audit skill | github.com/cloudflare/security-audit-skill | Security reviews of server, CSP and form code. |
| caveman plugin | github.com/JuliusBrussee/caveman | Short chat replies to save tokens. The plugin only; the CLI "layer" was not used. |
| emilkowalski skills (3 of 20) | github.com/emilkowalski/skills | emil-design-eng, review-animations, animation-performance. |
| Trail of Bits (4 plugins) | github.com/trailofbits/skills | insecure-defaults, supply-chain-risk-auditor, differential-review, agentic-actions-auditor. |
| agent-browser | github.com/vercel-labs/agent-browser | Browser automation for the network test and small-screen checks. |
| rtk | github.com/rtk-ai/rtk | Shortens command output for the agent. Global Bash hook. |
| /security-review | Built into Claude Code | Security review of the current branch's changes. |

### Turned off for now (2026-11-27)

mattpocock-skills, design-taste-frontend, transitions-dev, unslop and hallmark are installed but off, to save
context. plan.md says when and how to turn each back on. gstack and the caveman CLI are not used (decided).

### Installed outside this repo, and how to remove each

| What | Where | Remove with |
| --- | --- | --- |
| rtk binary | winget package `rtk-ai.rtk` | `winget uninstall rtk-ai.rtk` |
| rtk Bash hook | `~/.claude/settings.json` (PreToolUse), `~/.claude/RTK.md`, `@RTK.md` line in `~/.claude/CLAUDE.md` | `rtk init -g --uninstall` (run before removing the binary) |
| hallmark skill (global, now off) | `~/.claude/skills-disabled/hallmark` | `rm -rf ~/.claude/skills-disabled/hallmark` |
| agent-browser CLI | global npm package | `npm uninstall -g agent-browser` |
| agent-browser Chrome | `~/.agent-browser/browsers` | `rm -rf ~/.agent-browser` |
| impeccable engine | `~/.impeccable/bin` | `rm -rf ~/.impeccable` |
| Plugin marketplaces | user settings: heydamir, ponytail, trailofbits, caveman | `claude plugin marketplace remove <name>` |
| Plugins (local scope, this project) | superpowers, mattpocock-skills, unslop, ponytail, caveman, 4 Trail of Bits | `claude plugin uninstall <name>@<marketplace> --scope local` |
| Plugin hooks | caveman and superpowers add a SessionStart hook each | removed with their plugin |
| Project skills | `.claude/skills/`, `.claude/skills-disabled/`, `.claude/agents/` (impeccable) | `npx skills remove <name>`, or delete the folder |
