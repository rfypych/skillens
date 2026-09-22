# SKILLENS WORKLOG & PROJECT STATE

> **Single Source of Truth** for project state, credentials, architectural decisions, and cross-session AI agent handoffs.  
> **MANDATORY FOR INCOMING AGENTS**: Read this file thoroughly before altering any code. After completing any task, append your activity log in Section 6 per [`AGENTS.md`](./AGENTS.md).

---

## 1. Product Identity & Value Proposition

- **Product Name**: Skillens
- **Tagline**: *Recruitment Runs on Evidence* / Merekrut tanpa tebakan
- **Git Remote**: `https://github.com/rfypych/skillens.git` (Local root: `D:\projects\JHIC-rev`)
- **Live Production URL**: [https://skillens-app.vercel.app](https://skillens-app.vercel.app)
- **Core Positioning**: Evidence-based technical candidate evaluation and ATS platform featuring AI Blind Hiring to eliminate HR pedigree bias and detect external AI assistance / prompt injection.

### The 3 Evidence Layers
1. **Layer 1 — Micro-Simulation Assessment**: Interactive multi-turn case study simulation (not simple multiple-choice questions). AI evaluates 5 competency dimensions: Problem Comprehension, Solution & Trade-offs, Logical Execution, Communication, and Integrity.
2. **Layer 2 — Forensic Telemetry & Anti-Cheat**: Real-time non-invasive integrity analysis without webcam proctoring. Analyzes 13 behavioral signals (keystroke dynamics, burst WPM > 360, backspace ratio < 2%, copy-paste injection, Chameleon Semantic Injection trap-word detection).
3. **Layer 3 — Talent Intelligence & Cognitive Fingerprint**: Machine Learning (`scikit-learn` GradientBoosting) predicting long-term candidate success, Team DNA compatibility, and highlighting overlooked "Hidden Gems".

---

## 2. Current Git State & Branches

- **Root Directory**: `D:\projects\JHIC-rev` (Monorepo)
- **Active Branch**: `preview`
- **Main Branch**: `main` (synced with remote origin `https://github.com/rfypych/skillens.git`)
- **Branch Deltas**:
  - `preview` contains 5 demo-hardening commits ahead of `main`:
    - `b31e0ec`: test: stage demo video script + tunnel check + backup recording
    - `bf0e293`: fix(login): simplify demo accounts to 2 roles (Recruiter + Candidate)
    - `5e60cbc`: fix(ui): unify job-edit page with app design language + test-page error state
    - `8fb4ac7`: feat(auth): seed admin/user demo accounts + one-click login buttons
    - `be69c70`: feat: end-to-end flow hardening + live AI evaluation (qwen3.8/fallback gpt-oss-120b)
  - `main` contains the landing page anti-slop overhaul (`eb37537`).

---

## 3. Demo Accounts & Test Credentials

Use these seeded accounts for end-to-end verification, demo recording, and evaluation:

| Role | Email | Password | Scope / Capabilities |
|---|---|---|---|
| **Recruiter / HR** | `recruiter@skillens.com` | `password123` | ATS Dashboard, job postings, KKM threshold, telemetry audit report, Cognitive Fingerprint radar, interview scheduler |
| **Candidate** | `kandidat@skillens.com` | `password123` | Assessment test runner, candidate profile, CV auto-attach, application status |

> **Seeding Scripts**: Run `backend/seed_credentials.py` or `backend/seed_demo.py` to populate realistic candidate datasets and forensic telemetry events.

---

## 4. Technical Architecture & Stack

### Frontend
- **Path**: `frontend/`
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Lucide Icons, custom SVG watermarks
- **Design System**: *Sharp Minimalist / Editorial* (Anti-AI-Slop). Flat hierarchy, crisp borders (`border-gray-200/60`), zero decorative blur halos, no pulsing dot pill badges.
- **Default Port**: `3000`

### Backend
- **Path**: `backend/`
- **Framework**: FastAPI (Python 3.11 / UV)
- **Database**: SQLite (SQLAlchemy ORM) — active database: `backend/jhic.db` / `app.db`
- **Default Port**: `8000`
- **LLM Pipeline**:
  - Primary Model: `qwen/qwen3.8-27b` (via Groq / OpenAI-compatible endpoint)
  - Fallback Model: `openai/gpt-oss-120b` or local fallback
  - Execution Mode: Inline daemon thread (`USE_CELERY=False`) ensuring evaluation completes reliably without Redis service dependencies.
- **Machine Learning**:
  - Model Artifact: `backend/ml/fingerprint_model.joblib` (Scikit-Learn GradientBoosting)
  - Features: Keystroke cadence, latency variability, semantic consistency, and pattern scoring.
  - Resume Processing: `backend/services/pdf_extractor.py` with OCR fallback for scanned PDF documents.

---

## 5. Repository Layout

```text
D:\projects\JHIC-rev\
├── frontend\
│   ├── src\app\
│   │   ├── page.tsx                      # Anti-slop Editorial Landing Page
│   │   ├── login\page.tsx                # One-click demo login interface
│   │   ├── signup\page.tsx               # Registration flow
│   │   ├── recruiter\                    # ATS Dashboard
│   │   │   ├── candidates\               # Candidate list & KKM ranking
│   │   │   │   └── [app_id]\page.tsx     # Keystroke replay, radar, forensic breakdown
│   │   │   ├── jobs\                     # Job creation & KKM pass-mark setup
│   │   │   ├── interviews\               # AI Copilot interview scheduling
│   │   │   └── metrics\                  # Hiring analytics & funnel metrics
│   │   └── candidate\                    # Candidate Portal
│   │       ├── dashboard\                # Status & assessment outcomes
│   │       ├── profile\                  # Profile details & CV visibility
│   │       └── test\[app_id]\            # Interactive multi-turn chat test
│   └── src\components\
│       ├── landing\                      # HeroSection, FeaturesSection, MetricsSection, CTASection
│       ├── CognitiveFingerprintRadar.tsx # Multi-dimensional competency radar
│       ├── TeamDNAGraph.tsx              # Team dynamic & culture-fit graph
│       └── BiosphereSimulationPanel.tsx  # Predictive performance panel
│
├── backend\
│   ├── main.py                           # FastAPI entrypoint & CORS config
│   ├── config.py                         # Pydantic configuration & env parsing
│   ├── database.py                       # SQLAlchemy session & SQLite connection
│   ├── models.py                         # Core ORM models (User, Job, Application, Assessment, Telemetry)
│   ├── schemas.py                        # Request / Response schemas
│   ├── routers\
│   │   ├── auth.py                       # JWT authentication & session routes
│   │   ├── assessment.py                 # Chat endpoints, AI grading, telemetry ingestion
│   │   ├── candidates.py                 # Candidate profile endpoints
│   │   ├── jobs.py                       # Job management endpoints
│   │   └── seed.py                       # Demo data injection endpoint
│   ├── services\
│   │   ├── assessment_service.py         # Test logic & telemetry penalty rules
│   │   ├── ai_evaluator.py               # LLM prompts & regex-based JSON extraction
│   │   └── pdf_extractor.py              # Resume extraction with OCR fallback
│   └── ml\                               # Fingerprint training scripts & models
│
├── e2e\                                  # Playwright E2E test suite & visual artifacts
├── INOVASI_SKILLENS.md                   # Competition strategy & innovation whitepaper
├── WORKLOG.md                            # State tracker & work log (this file)
└── AGENTS.md                             # Agent operational rules & design protocol
```

---

## 6. Recent Work History

### Session: 2026-09-22 16:30 WIB — English Documentation Optimization
- **Goal / User Request**: Transition `WORKLOG.md` and `AGENTS.md` to technical English for token efficiency and high LLM instruction-following precision.
- **Changes Made**:
  - `AGENTS.md`: Rewritten in compact, imperative technical English. Solidified the post-task logging mandate, anti-AI-slop design directives, monorepo execution standards, and completion checklist.
  - `WORKLOG.md`: Rewritten in high-density technical English covering complete architecture, 3 evidence layers, demo accounts, git branch status (`preview` vs `main`), and project layout.
- **Affected Files**:
  - `[MODIFY]` `AGENTS.md`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Checked git tracking status: both files intact and readable in root repository.
- **Handoff Notes for Next Session**: Both documentation files are now fully aligned with operational requirements. Incoming agents will parse these files with maximum token efficiency.

### Session: 2026-08-10 — Landing Page Anti-Slop Redesign
- **Goal / User Request**: Eliminate generic AI slop indicators from landing page components and restore true *Evidence-Based Hiring* brand positioning.
- **Changes Made**:
  - `HeroSection.tsx`: Removed artificial "Biosphere Intelligence" pill badge, restored authentic headline (*"Merekrut tanpa tebakan."*), routed CTAs cleanly.
  - `FeaturesSection.tsx`: Replaced glowing dot pills with clean `Lapisan 1/2/3` typography; eliminated grid background and neon orange corner blob; replaced rainbow bullet points with editorial numbered codes (`D1`–`D5`); removed excessive em-dashes.
  - `CTASection.tsx`: Removed glassmorphism blur button; streamlined to clean editorial link.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/components/landing/HeroSection.tsx`
  - `[MODIFY]` `frontend/src/components/landing/FeaturesSection.tsx`
  - `[MODIFY]` `frontend/src/components/landing/CTASection.tsx`
- **Commit**: `eb37537` on `main`.

### Session: Demo Flow Hardening & Login Simplification
- **Goal / User Request**: Streamline demo presentation for national competition judges with one-click role-based login, unified job editing UI, and robust AI evaluation fallback.
- **Commits**: `b31e0ec`, `bf0e293`, `5e60cbc`, `8fb4ac7`, `be69c70` on branch `preview`.

### Session: 2026-09-23 — Archetype Engines + CV-Grounded AI + Full MCP/Skill Arsenal
- **Goal / User Request**: (1) Prove CV is really processed by AI; (2) build role-archetype system (Teknis/Lapangan/Kreatif) answering jury feedback on field/creative jobs without leaving the evidence-based theme; (3) research + install MCP/skills arsenal; (4) mirror skills+MCP to Antigravity; (5) use all MCPs maximally.
- **Changes Made**:
  - Backend `jobs.archetype` column (Neon ALTER + model + schemas + create flow).
  - `tasks.py`: archetype-branched scenario generator (SJT+K3 hazards, portfolio interrogation); prompts compacted to fit 900-token LLM cap.
  - `assessment_service.chat_assessment`: CV claims (1500ch) injected into interviewer prompt + archetype personas; LLM config via `config.settings` (was `os.getenv`).
  - `ai_evaluator`: archetype-adapted rubric + replay-derived decision telemetry (deliberation span, revision count).
  - Frontend: archetype picker cards in jobs/new wizard; LAPANGAN pill on job detail; `Job` type extended.
  - Demo data (Neon, live): job 39 "Teknisi Lapangan" + 3 evaluated candidates (86.25 Highly Validated / 7.75 Mismatch / 0.0 Likely Fabricated via trap word).
  - E2E `playwright.config.ts`: official setup-project pattern (`tests/auth.setup.ts`, `--project=setup`), `video: on-first-retry`. Setup NOT auto-wired (5/min login limit).
  - Skills installed global (6): code-review, security-review, fastapi, fastapi-patterns, nextjs-best-practices, better-auth-security-best-practices. Junctioned (mklink /J) to Antigravity `~/.gemini/antigravity/skills/`.
  - MCP mirrored to Antigravity `~/.gemini/config/mcp_config.json` (7 added, context7 kept, pre-existing untouched).
  - AGENTS.md: §🧰 skills/MCP protocol + Antigravity mirrors + honest env notes (no Playwright-MCP browser tools here → CLI sanctioned; `cloudflare_execute` token invalid → CLI+docs).
- **Affected Files**:
  - `[MODIFY]` `backend/models.py`, `backend/schemas.py`, `backend/services/job_service.py`, `backend/tasks.py`, `backend/services/assessment_service.py`, `backend/services/ai_evaluator.py`
  - `[MODIFY]` `frontend/src/app/recruiter/jobs/new/page.tsx`, `frontend/src/app/recruiter/jobs/[id]/page.tsx`, `frontend/src/types/api.ts`, `e2e/playwright.config.ts`
  - `[NEW]` `e2e/tests/auth.setup.ts` (renamed from visual-setup.spec.ts)
  - `[MODIFY]` `AGENTS.md`, `WORKLOG.md`
- **Verification & Testing**:
  - Lapangan E2E live: apply w/ CV PDF → chat follow-ups quoted CV ("sertifikat K3 Ketinggian kamu", "500+ instalasi FTTH") → submit → evaluated <60s.
  - Semgrep scan on 6 backend files: 0 findings. Code-review 2-axis gate passed (1 real gap fixed: decision telemetry).
  - Playwright 7/7 green; `npm run build` green; archetype picker + LAPANGAN pill screenshot-verified.
  - MCP usage log: needmcp design-craft ×4 (craft, layout, polish), discover-ui, user-info (Free, 498/day left); context7 FastAPI/Next.js/Playwright/Tailwind docs; cloudflare_docs (tunnel guide); cloudflare_search+execute attempted (token invalid, error 1000 — documented). Playwright/Cloudflare executed via CLI (no MCP browser/execute tools in this env).
- **Handoff Notes for Next Session**: Railway backend still dead (platform 404) — public Vercel login blocked; local prod-mode + tunnel + demo video are the working demo paths. Next: Kreatif demo job + proxy.ts httpOnly-cookie auth (audit fix #4). Re-run `link_skills.py`/`merge_mcp.py` logic after adding new skills/servers.
- **Commits**: `5ea8815` (archetype), `1f64131`, `e91926c`, `83cce5e`, `67dc7fe`, `8014107` on `preview`.

### Session: 2026-09-23 — Frontend Code Quality Audit (read-only)
- **Goal / User Request**: Strict senior review of Next.js 16 frontend: config, api interceptor, auth, guards, proxy, state, i18n, styling, perf, secrets.
- **Changes Made**:
  - No code changes. Produced structured audit report (10 areas, verdicts, top-5 risks, 5/10 score).
- **Affected Files**:
  - `[READ]` `frontend/next.config.ts`, `src/lib/api.ts`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/recruiter/layout.tsx`, `src/app/candidate/layout.tsx`, `src/proxy.ts`, `src/i18n/*`, `src/app/recruiter/jobs/edit/[id]/page.tsx`
- **Verification & Testing**:
  - Grep/read-only inspection. No build/test run.
  - Result: key findings proxy no-op, localStorage JWT, dual mobile/desktop auth duplication, i18n ~31 keys only, legacy rounded-none/brand-* debris, full-client rendering + WebGL stack.
- **Handoff Notes for Next Session**: Top fixes: server-side guard in proxy.ts (httpOnly cookie verify), centralize auth store + clear token on logout, unify i18n coverage, delete dead Header/Sidebar brand tokens, add per-route error.tsx + next/image.

---

## 7. Critical Implementation Gotchas

1. **Monorepo Execution Scope**:
   - Always verify current working directory (`cwd`).
   - Run `git` exclusively from `D:\projects\JHIC-rev`.
   - Run Next.js commands from `D:\projects\JHIC-rev\frontend`.
   - Run Python commands from `D:\projects\JHIC-rev\backend`.
2. **Vercel Monorepo Settings**:
   - Vercel dashboard project setting maps `rootDirectory` to `frontend`.
   - Pushing to remote GitHub triggers automated cloud preview/production builds.
3. **Telemetry Heuristics**:
   - `keydown`, `paste`, and `tab_switch` events are aggregated during test submission.
   - Typing speed > 360 WPM combined with backspace ratio < 2% triggers automated transcription penalties.
4. **Resilient LLM Parsing**:
   - `ai_evaluator.py` utilizes regex pattern extraction to parse JSON responses from models, preventing markdown block wrapper parsing failures.

---

## 8. Immediate Next Steps & Priorities

1. **Branch Merge & Reconciliation**:
   - Review and merge validated `preview` hardening commits (one-click login, job edit fixes, model fallbacks) into `main` when ready for production rollout.
2. **Automated E2E Verification**:
   - Execute Playwright test suites in `e2e/` to validate full user lifecycles (guest application -> AI assessment chat -> automated grading -> recruiter audit review).
3. **Blind Hiring Toggle Verification**:
   - Verify that recruiter dashboard candidate views strictly redact PII when the Blind Hiring toggle is enabled, upholding objective merit-based selection.
