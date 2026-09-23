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

## 🎨 DESIGN DISCIPLINE & ANTI-AI-SLOP (STRICT)

Skillens adopts a **Sharp Minimalist / Editorial** aesthetic for high-stakes national recruitment. Do NOT generate generic "AI SaaS template" styling.

### ❌ STRICTLY FORBIDDEN (AI Slop Tells):
1. **Pulsing Dot Pill Badges**: Never render badges like `● LAYER 1 — CORE INNOVATION` with pulsing dots or excessive all-caps. Use plain typographic labels with wide tracking (e.g., `Lapisan 1` semibold).
2. **Grid Backgrounds + Neon Glow Blobs**: Avoid dark cards with repeating grid lines and neon orange/purple blur circles in corners. Use flat backgrounds with high contrast or subtle typographic watermarks (e.g., ghost text `01`).
3. **Rainbow Checklist Dots**: Never create feature lists with rainbow bullet dots (orange, purple, cyan, green stacked). Use subtle hairline dividers or monospaced index tags (`D1`, `D2`, `01`, `02`).
4. **Excessive Em-Dashes (`—`)**: Do not litter Indonesian copy with em-dashes. Use natural periods (`.`) or commas.
5. **Gratuitous Glassmorphism**: Avoid `backdrop-blur-md` with transparent borders on interactive buttons unless explicitly specified.
6. **Soft Drop Shadows & Nested Cards**: Never stack gray cards inside gray cards with thick soft shadows. Use whitespace, clean 1px borders (`border-gray-200/60`), and clear contrast.
7. **Middle Dot (`·`)**: Never use `·` anywhere in UI copy or docs. Use `/` or `-` as separators.

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
| `skillens-design-system`, `hallmark`, `anti-slop` | BEFORE writing/editing ANY UI — in addition to NeedMCP craft below. |
| `ui-ux-pro-max`, `design-system` | For layout/typography/color decisions and component specs. |

### Connected MCP servers (already configured — use them, do not re-add)
> **Antigravity mirror**: the same 8 servers (5× cloudflare, needmcp, context7, playwright) are merged into `C:/Users/rfkl/.gemini/config/mcp_config.json` (pre-existing entries untouched; context7 was already there). OAuth servers (cloudflare-*) will prompt for auth inside Antigravity on first use. After editing MCP config, use *Manage MCP Servers → Refresh* in the IDE.
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
- [ ] UI changes strictly follow **Anti-AI-Slop** editorial standards?
- [ ] Temporary debug scripts or scratch files cleaned up?
- [ ] **HAS `WORKLOG.md` BEEN UPDATED WITH YOUR ACTIVITY LOG?**
