# AI AGENT OPERATIONAL PROTOCOL (AGENTS.md)

This document contains mandatory guidelines for every AI Agent operating on the **Skillens** repository (`D:\projects\JHIC-rev`). These instructions are **strictly enforced** to preserve code integrity, design standards, and cross-session state continuity.

---

## 🚨 PRIME DIRECTIVE: MANDATORY POST-TASK LOGGING

Whenever you complete a task, feature, bug fix, or investigation, you **MUST ALWAYS update [`WORKLOG.md`](./WORKLOG.md) BEFORE ending your turn**.

### Rationale
LLM context windows are bounded. When context runs out or the user opens a new session, incoming AI agents read `WORKLOG.md` to restore full situational awareness without wasteful rediscovery or repeating solved mistakes.

### Required Log Entry Format in `WORKLOG.md`:
Append a new entry under section **6. Recent Work History** using this exact template:

```markdown
### Session: [YYYY-MM-DD HH:MM WIB] — [Brief Task Title]
- **Goal / User Request**: [Concise summary of user intent]
- **Changes Made**:
  - [Component / Service X]: [Technical details of modifications]
  - [Component / Service Y]: [Technical details of modifications]
- **Affected Files**:
  - `[MODIFY/NEW/DELETE]` `path/to/file`
- **Verification & Testing**:
  - [Verification commands executed, e.g. `npx tsc --noEmit`, build status, or API test]
  - [Result: Passed / warnings / known notes]
- **Handoff Notes for Next Session**: [Pending items or context for incoming agents]
```

---

## 🎨 DESIGN DISCIPLINE — BOARDUI ONLY (STRICT)

Skillens uses **BoardUI** as its sole design system (source-owned components under `frontend/src/components/`, tokens in `frontend/src/styles/`). The old Sharp/Editorial green system (`#4B7B51`, rounded-none, hard shadows) is RETIRED — never use it for new work, never reintroduce it.

### Mandatory BoardUI rules (from `.agents/skills/boardui/`):
1. **Semantic tokens only**: `text-text-primary/secondary/tertiary`, `bg-background-primary/secondary/tertiary-default`, `bg-background-full` page ground, `border-border-button-default`, `border-separator-border` hairlines, `accent-*` ramp (Skillens orange `#F26522`), status pairs (`status-lime/rose/blue/yellow/orange/purple`). Never raw palette classes or hex literals.
2. **Composite type only**: `text-title-1/2-medium`, `text-body-medium/regular`, `text-caption-1-*`, `text-display-*`. Never hand-stacked `text-sm font-*`.
3. **Shape**: cards/panels `rounded-3xl` + `border-border-button-default`; stat tiles `rounded-2xl`; inputs/menu rows `rounded-md/xl`; pills `rounded-full`. Grid `gap`, never per-card margins.
4. **Components, not lookalikes**: Button/Input/Chip/Avatar/Table/Select/SegmentedControl/Switch/StatCards/etc. from `@/components/**`; icons `@remixicon/react` as refs; classes merged with `cx()`; `active:` press color steps; `prefers-reduced-motion` guards on keyframes.
5. **Copy**: BoardUI voice — literal names, functional verbs, one-line descriptions, concrete numbers, zero superlatives, zero exclamation marks.

### Still forbidden (genuine slop, any system):
1. Pulsing dot pill badges, rainbow bullet dots, middle dot (`·`) in copy.
2. Neon glow blobs, gratuitous glassmorphism on buttons.
3. Excessive em-dashes in Indonesian copy — use periods/commas.

---

## 🛠️ MONOREPO STRUCTURE & SHELL CONVENTIONS

This repository is a **Monorepo** rooted at `D:\projects\JHIC-rev`:

```text
D:\projects\JHIC-rev/          <- Git Root Repository
├── frontend/                  <- Next.js App (Run npm/npx here)
├── backend/                   <- FastAPI Backend (Run python/uvicorn here)
├── WORKLOG.md                 <- Single source of truth for project state
└── AGENTS.md                  <- Agent operational rules (this file)
```

1. **Git Root Execution**:
   - Always run `git` commands from the root directory (`D:\projects\JHIC-rev`).
   - Never initialize separate git repositories in subfolders.
2. **Branch Management**:
   - Check active branch before making commits (`git status` / `git branch`).
   - Do not overwrite or force-push recklessly to `main` or `preview`.
3. **Verification Before Task Completion**:
   - If frontend code is modified: verify TypeScript compilation with `npx tsc --noEmit` in `frontend/`.
   - If backend code is modified: verify Python syntax and import integrity.

---

## 🧰 MANDATORY SKILLS & MCP PROTOCOL (STRICT)

Every agent session MUST load and obey the following skills/MCP servers for the matching task type. This section exists so context survives across sessions: **read it, load the skill via the `skill` tool (`skill: <name>`), and follow it — do not rely on memory.**

### Installed global skills (verified in `C:/Users/rfkl/.agents/skills/`)
> **Antigravity mirror**: all 26 global skills are junctioned (mklink /J) into `C:/Users/rfkl/.gemini/antigravity/skills/` so Antigravity sees the same set. Junctions auto-sync — but after `npx skills update` or adding a new skill, re-run the linker (`link_skills.py` logic) for the new folder. Workspace skills in this repo's `.agents/skills/` are picked up by Antigravity automatically when the folder is open.
| Skill | Load when... |
|---|---|
| `code-review` | BEFORE every `git commit`/`push` — review the full diff as a push gate. |
| `security-review` | AFTER any auth/crypto/DB-access/upload change, and before closing a security fix. |
| `fastapi` (official) | BEFORE touching `backend/` — lifespan, BackgroundTasks, security patterns. |
| `fastapi-patterns` | Companion for backend refactors and service-layer work. |
| `nextjs-best-practices` | BEFORE touching `frontend/` App Router code — proxy auth, server components. |
| `better-auth-security-best-practices` | For session/cookie/JWT work on the frontend. |
| `find-skills` | When a task needs a capability no skill above covers — search skills.sh first. |

### Repo-local skills (`.agents/skills/`)
| Skill | Load when... |
|---|---|
| `hallmark`, `anti-slop` | BEFORE writing/editing ANY UI for generic quality gates — in addition to NeedMCP craft below. (The retired `skillens-design-system` green skill was deleted; never re-add it.) |
| `ui-ux-pro-max`, `design-system` | For layout/typography/color decisions and component specs. |

### Connected MCP servers (already configured — use them, do not re-add)
> **Antigravity mirror**: the same servers (5× cloudflare, needmcp, context7, playwright, figma) are merged into `C:/Users/rfkl/.gemini/config/mcp_config.json` (pre-existing entries untouched; context7 was already there). OAuth servers (cloudflare-*, figma) will prompt for auth inside Antigravity on first use. After editing MCP config, use *Manage MCP Servers → Refresh* in the IDE.
| MCP | Mandatory usage |
|---|---|
| `needmcp` → `design-craft` (`fetch-ui {resource: "craft"}`) | MUST be called BEFORE generating/writing/editing any UI code. The Refuse list is binding. |
| `context7` (`resolve-library-id` → `query-docs`) | MUST be used when touching any library/framework API (FastAPI, Next.js, SQLAlchemy, Tailwind, etc.) — docs beat training data. |
| Playwright MCP / `e2e/` specs | EVERY behavior change must be proven by a Playwright run (`presentation-check.spec.ts`, `demo-buttons.spec.ts`, or a new spec) before push. NOTE (verified 2026-09-23): this agent env exposes NO Playwright-MCP browser tools — `npx playwright` CLI is the sanctioned substitute (same Chromium engine). Auth follows the official setup-project pattern (`tests/auth.setup.ts`, `--project=setup`); never auto-wire setup as a dependency (5/min login limit). `video: on-first-retry` is on. |
| `cloudflare` skills | For tunnel/deploy/WAF work only. NOTE: `cloudflare_execute` token is INVALID in this env (error 1000) — use `cloudflared`/Wrangler CLI + `cloudflare_docs` instead. Quick tunnels (`--url`) for demos; named tunnels need account+zone. |
| `cloudflare-docs` / `cloudflare` skills | For tunnel/deploy/WAF work only. |

### Explicitly NOT used (documented so future agents don't re-add)
- Third-party security-scanner MCP servers (weak reputation; one had CVE-2026-7446). Use **Semgrep CLI** instead: `pip install semgrep && semgrep scan --config auto`.
- Neon/GitHub MCP servers — `DATABASE_URL` direct access and `gh` CLI already cover these.

### Standard fix workflow (follow in order)
1. Load the matching skill(s) from the tables above.
2. Baseline: `semgrep scan --config auto` (security) + relevant Playwright spec (behavior).
3. Implement the fix (Context7 first if a library API is involved).
4. Verify: `security-review` skill pass (security fixes) + Playwright green + `npm run build` (frontend) / import check (backend).
5. Gate: `code-review` skill pass on the diff, then commit + push to `preview`.
6. Log the session in `WORKLOG.md` (Prime Directive).

---

## 📋 AGENT COMPLETION CHECKLIST

Before submitting your final response:
- [ ] Code changes verified without syntax or type errors?
- [ ] Matching skill(s) from §🧰 loaded and followed (name them in the worklog)?
- [ ] `design-craft` consulted for any UI change?
- [ ] Playwright proof green for any behavior change?
- [ ] `code-review` gate passed before push?
- [ ] UI changes strictly follow **BoardUI** standards (§🎨)?
- [ ] Temporary debug scripts or scratch files cleaned up?
- [ ] **HAS `WORKLOG.md` BEEN UPDATED WITH YOUR ACTIVITY LOG?**

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
