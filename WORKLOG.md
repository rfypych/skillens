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

### Session: 2026-09-23 — BoardUI Adoption (tokens + ranking table + stat-cards)
- **Goal / User Request**: Apply BoardUI style (boardui.com) using MCP/skills maximally; hallmark `study` → DNA diagnosis → scoped adoption (tokens + data-table + stat-cards, NO button gradients per committed flat world).
- **Changes Made**:
  - Vendored via `boardui add theme typography data-table stat-cards` (source-owned); deps: react-aria-components, @remixicon/react, @tanstack/react-table (pinned v8 — v9 broke getCoreRowModel API).
  - `styles/accent.css`: orange 50–950 ramp anchored #F26522 overriding BoardUI blue accent; `boardui-table.css`: extracted `.bui-table` subset (BoardUI globals NOT imported).
  - New `components/RankingTable.tsx`: BoardUI Table primitives + TanStack sorting/search/pagination, stable score-desc rank, our pills/buttons kept; wired into job detail (old table removed).
  - Metrics KPIs via BoardUI `StatCards` with honest WoW deltas; fixed pre-existing inflated average (142!) by counting only scored apps.
  - E2E config: official setup-project pattern + video on-first-retry.
- **Affected Files**:
  - `[NEW]` `frontend/src/components/RankingTable.tsx`, `frontend/src/styles/accent.css`, `frontend/src/styles/boardui-table.css` + ~30 vendored BoardUI files, `e2e/tests/deployed.spec.ts`
  - `[MODIFY]` `frontend/src/app/recruiter/jobs/[id]/page.tsx`, `frontend/src/app/recruiter/metrics/page.tsx`, `frontend/src/app/globals.css`, `frontend/package.json`, `e2e/playwright.config.ts`
- **Verification & Testing**:
  - `npx tsc --noEmit` clean; `npm run build` green; Playwright 7/7; ranking sort/search + metrics screenshots verified.
  - Code-review 2-axis gate: standards pass; fixed rank semantics + avg bug found via screenshots.
  - Incidents: `pip install semgrep` upgraded starlette 1.6.0 breaking fastapi 0.115 (fixed: pin starlette<0.47); backend background processes die between shell sessions (restart before demos).
- **Handoff Notes for Next Session**: Unused BoardUI kit parts (dropdown/select/avatar/etc.) kept vendored (tree-shaken); Pro HR template needs paid license. Quick tunnels expire on restart.
- **Commits**: `8779ab6` on `preview`.

### Session: 2026-09-23 16:05 WIB — Figma MCP Status & OAuth Error Diagnosis
- **Goal / User Request**: Check Figma MCP status and diagnose "OAuth app with client id WPjiIBOlI6Snc0EeAjsit7 doesn't exist" error.
- **Findings & Diagnostic**:
  - Root Cause: Official Figma remote MCP endpoint (`https://mcp.figma.com/mcp`) requires Dynamic Client Registration (DCR), which Figma restricts to whitelisted IDEs. Antigravity is rejected (403), falling back to a hardcoded client ID (`WPjiIBOlI6Snc0EeAjsit7`) that Figma developer portal marks as non-existent (tracked in `google-antigravity/antigravity-cli` issue #496).
  - Verdict: Remote OAuth via `https://mcp.figma.com/mcp` is currently impossible in Antigravity until Google/Figma resolves the app allowlist.
  - Solution / Workaround: Switch to a token-based local MCP server (e.g. `@scalably-io/figma-mcp` or `@tothienbao6a0/figma-mcp-server`) using a Figma Personal Access Token (PAT) generated from `Figma Settings > Account > Personal access tokens`.
- **Affected Files**:
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Verified upstream bug reports and tested npm CLI availability for `@scalably-io/figma-mcp` and `@tothienbao6a0/figma-mcp-server`.

### Session: 2026-09-23 16:11 WIB — Figma MCP Token-Based Activation
- **Goal / User Request**: Activate Figma MCP using user-provided Personal Access Token.
- **Changes Made**:
  - Replaced broken remote OAuth Figma server in `C:\Users\rfkl\.gemini\config\mcp_config.json` with `@tothienbao6a0/figma-mcp-server` running via `npx` with `--figma-api-key=figd_...` and `--stdio`.
  - Mirrored configuration to `C:\Users\rfkl\.gemini\antigravity\mcp_config.json`.
  - Removed defunct `figma-dev-mode-mcp-server` OAuth endpoint.
- **Affected Files**:
  - `[MODIFY]` `C:\Users\rfkl\.gemini\config\mcp_config.json`
  - `[MODIFY]` `C:\Users\rfkl\.gemini\antigravity\mcp_config.json`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Ran stdio JSON-RPC handshake (`initialize` + `tools/list`) with the token: verified 11 tools returned (`get_figma_data`, `generate_design_tokens`, `generate_design_system_doc`, `download_figma_images`, `check_accessibility`, etc.).
  - Validated JSON configuration files.
- **Handoff Notes for Next Session**: Figma MCP is now configured. To load tools into the active session, user should click *Manage MCP Servers → Refresh* in the IDE.

### Session: 2026-09-23 16:17 WIB — Anti-Slop Site Architecture & Figma MCP Mapping
- **Goal / User Request**: Analyze and build an exhaustive, accurate sitemap of the Skillens platform using MCP (NeedMCP `design-craft` + Figma MCP) and anti-slop guidelines.
- **Changes Made**:
  - Called `needmcp` -> `fetch-ui` (`craft`) to align with strict anti-slop visual hierarchy and information design standards.
  - Inspected all 21 Next.js App Router routes (`frontend/src/app`), layouts (`recruiter/layout.tsx`, `candidate/layout.tsx`), middleware proxies (`src/proxy.ts`), and modal dialogs.
  - Verified local Figma MCP tool registry (11 tools available in `~/.gemini/antigravity/mcp/figma`).
  - Structured 100% accurate ground-truth sitemap mapping 3 distinct security/role domains (Public Guest Funnel, Candidate Portal, Recruiter ATS).
- **Affected Files**:
  - `[MODIFY]` `sitemap-skillens.svg`
  - `[NEW]` `generate_clean_sitemap.py`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Re-architected sitemap into a clean 3-Pillar Information Architecture Tree (01 Public Domain, 02 Candidate Experience, 03 Recruiter ATS OS) on a 2960x1960 editorial canvas.
  - Eliminated diagonal/crossing lines: all lines now follow orthogonal highways (dedicated horizontal channels and vertical spines) with zero card collisions and exact port-to-port connections.
  - Removed all remaining AI slop tells: no pulsing dot pill badges (`●`), no em-dashes (`—`), no middle dots (`·`), strictly clean editorial typography matching landing page aesthetics.
  - Validated with Python ElementTree parser and PowerShell `[xml]` cast (0 syntax errors).
  - Copied sanitized vector directly to Windows Clipboard.
- **Handoff Notes for Next Session**: User can paste directly into Figma canvas with `Ctrl+V`.

### Session: 2026-09-24 — Portfolio Photo Evidence Pipeline (vision verdict: honest human-loop)
- **Goal / User Request**: "Gas adakan semuanya" — implement the one missing piece (portfolio photo analysis). Provider check: Groq key exposes NO vision model (11 text/audio models; llama-4-scout/maverick 404); free fallback (pollinations) hallucinated an office from a panel sketch. Verdict: pixel interpretation NOT shippable; photo-presence evidence pipeline instead.
- **Changes Made**:
  - `pdf_extractor.extract_pdf_images` (PyMuPDF, max 6, min 200px, CMYK-safe); `applications.resume_images` JSON column (Neon ALTER + model + schemas).
  - `apply_for_job` saves evidence PNGs to uploads/; chat + evaluator prompts receive photo COUNT with explicit honesty note (pixels not machine-readable).
  - Recruiter detail gallery "Dokumentasi Visual Portofolio" with thumbnails + honest caption.
  - NOTE: commit also swept in user's parallel uncommitted redesign of `candidates/[app_id]` (their BoardUI-token rewrite); integration verified, no conflicts.
- **Affected Files**:
  - `[MODIFY]` `backend/services/pdf_extractor.py`, `backend/services/assessment_service.py`, `backend/services/ai_evaluator.py`, `backend/models.py`, `backend/schemas.py`
  - `[MODIFY]` `frontend/src/app/recruiter/candidates/[app_id]/page.tsx`, `frontend/src/types/api.ts`
- **Verification & Testing**:
  - Live: photo PDF apply → 1 photo extracted, served 200, gallery screenshot-verified.
  - Semgrep 0 findings; tsc clean; build green; Playwright 6/6.
  - Incidents: PyMuPDF missing (graceful fallback worked as designed); backend restarted to load new code; starlette pin held.
- **Handoff Notes for Next Session**: True vision needs a provider with vision models (Groq key upgrade or OpenAI key) — then wire `resume_images` into a vision call inside analyze path. Tunnel dead (needs restart for public URL).
- **Commits**: `f443e6e` on `preview`.

### Session: 2026-09-23 — Frontend Code Quality Audit (read-only)
- **Goal / User Request**: Strict senior review of Next.js 16 frontend: config, api interceptor, auth, guards, proxy, state, i18n, styling, perf, secrets.
- **Changes Made**:
  - No code changes. Produced structured audit report (10 areas, verdicts, top-5 risks, 5/10 score).
- **Affected Files**:
  - `[READ]` `frontend/next.config.ts`, `src/lib/api.ts`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/recruiter/layout.tsx`, `src/app/candidate/layout.tsx`, `src/proxy.ts`, `src/i18n/*`, `src/app/recruiter/jobs/edit/[id]/page.tsx`
- **Verification & Testing**:
  - Grep/read-only inspection. No build/test run.
  - Result: key findings proxy no-op, localStorage JWT, dual mobile/desktop auth duplication, i18n ~31 keys only, legacy rounded-none/brand-* debris, full-client rendering + WebGL stack.
### Session: 2026-09-23 16:51 WIB — Living BoardUI Component Sitemap Overhaul (Anti-Flat & Rich Micro-Widgets)
- **Goal / User Request**: Eliminate flat/soulless wireframe aesthetics and text overlaps. Transform the sitemap into rich, living BoardUI component mockups inspired by BoardUI's hero showcase, featuring depth (soft drop shadows, subtle surface elevation), tangible UI controls, and cohesive typography without serif fragmentation.
- **Changes Made**:
  - Re-engineered `generate_clean_sitemap.py` into a Living BoardUI Component generator:
    - **Depth & Dimension**: Added SVG `<filter id="card-shadow">` (multi-tier soft drop shadow) and glow filters (`glow-orange`, `glow-teal`) lifting cards off the slate-50 canvas.
    - **Living Component Anatomy**:
      - `Landing`: Mini hero showcase with pill badge, editorial headline, and orange CTA button.
      - `Login`: BoardUI segmented role tab (`Rekruter HR` vs `Kandidat`), email input with mail glyph, and one-click bypass demo button.
      - `Signup`: Form input fields with 4-bar password strength meter.
      - `Job Detail`: Job card with archetype badge (`TEKNIS`), salary band, KKM tag, and direct apply action.
      - `Apply`: PDF dropzone with file icon, 100% progress bar, and RapidOCR extraction tag.
      - `Instructions`: Three-point verification checklist with green checkmark circles and consent button.
      - `Interactive Test`: Deep obsidian live chat interface with AI Interviewer bubble, candidate response bubble with blinking cursor, live typing telemetry chips (`WPM: 84`, `Backspace: 4.1%`, `Paste: 0`), and dynamic Keystroke Flux waveform bars.
      - `Candidate Dashboard`: Competency progress bars (Problem Solving 92%, Backend 86%, Speed 78%) and KKM status banner.
      - `Candidate Profile`: User avatar circle with initials (`BP`), contact meta, and verified skill chips.
      - `Candidate Interviews`: Calendar date badge (`SEP 25`), Google Meet direct join button, and prep briefing.
      - `Command Center`: 4 BoardUI StatCards with bold metrics, deltas (+18.4%), and contextual subtext.
      - `Jobs Catalog`: Interactive job table with active positions, applicants count, and wizard button.
      - `Jobs New`: 3-step visual stepper with interactive-style KKM slider (ambang 80/100) and armed trap-word toggle.
      - `Ranking Table`: BoardUI Data Table with column headers, candidate initials avatars, scores (94, 88, 71 flagged), status chips, and copyable magic link.
      - `Candidate Forensic Audit`: Flagship obsidian audit suite with candidate header strip, 5-D cognitive bars, behavior replay scrubber player with timeline bar (`08:14 / 14:30`), blind hiring anti-bias toggle, and AI Copilot recommendation card.
      - `Recruiter Metrics`: Selection funnel conversion bar chart (Applied 142 -> Tested 94 -> Passed 38 -> Offer 6).
      - `Team Settings`: Multi-seat permission cards (Owner, Recruiter).
    - **Port-to-Port Orthogonal Highways**:
      - All 23 connector flows mathematically pinned to exact card ports (`(x + w/2, y)`, `(x + w, y + h/2)`, etc.).
      - Gutter conduits (`x = 580`, `x = 1140`, `x = 2230`, `x = 2790`), Top Auth Highway (`y = 160`), and Bottom AI Telemetry Highway (`y = 1680`) ensure zero wire collisions.
    - **Typography Integrity**: Unified to `Inter` (sans-serif) and `JetBrains Mono` (code/routes). Eliminated hardcoded Y-drift to guarantee zero overlapping text.
  - Generated and validated `sitemap-skillens.svg` (78,691 bytes).
  - Automatically copied SVG XML to Windows clipboard via PowerShell (`Set-Clipboard`).
- **Affected Files**:
  - `[MODIFY]` `generate_clean_sitemap.py`
  - `[MODIFY]` `sitemap-skillens.svg`
  - `[MODIFY]` `WORKLOG.md`
### Session: 2026-09-23 17:03 WIB — Anti-Slop Purification & Layout Fixes
- **Goal / User Request**: Purge all hyperbolic AI-slop metadata cards, remove vendor name references ("BoardUI") from Skillens product titles, fix all text overlaps, avatar box misalignments, and connector label collisions highlighted in user screenshots. Installed `.agents/skills/anti-slop/`.
- **Changes Made**:
  - Installed and loaded `anti-slop` skill from `C:\Users\rfkl\.agents\skills\anti-slop` into `.agents/skills/anti-slop`.
  - **Purged All Hyperbole & AI Meta-Commentary**:
    - Removed entire "CAKUPAN SISTEM", "STANDAR VEKTOR Figma Direct Paste", "ARSITEKTUR INFORMASI DAN TOPOLOGI RESMI" header card block.
    - Removed meta-commentary subtitle mentioning "BoardUI Design Language, Living Component Anatomy, dan Konektor Highway".
    - Removed "BOARDUI LIVING COMPONENT SPECIFICATION" footer text.
    - Simplified header to clean, professional editorial typography: "Skillens Platform — Peta Navigasi & Arsitektur Antarmuka".
  - **Removed Vendor Names from Product Copy**:
    - Changed "BoardUI Ranking Table & Magic Link" to natural product title: "Peringkat Pelamar & Magic Link" (`RANKING`).
    - Changed "Command Center // ATS Operating System" to "Pusat Kendali Rekruter" (`PUSAT KENDALI`).
  - **Fixed Visual Overlaps & Collisions (Verified against screenshots)**:
    - Fixed `Route-Candidate-Test` AI avatar icon: correctly centered text `AI` (`x = 14`, `y = 18` inside `width = 28` box).
    - Fixed chat text width so it never clips or overflows the card boundary.
    - Eliminated `Hasil &amp; Skor Selesai` collision: expanded Sub 2A/2B gutter to 80px and replaced oversized pill with clean `Selesai` (width 64px). No `&amp;` display artifacts.
    - Eliminated `Klik Baris Pelamar` collision on ranking table: expanded Sub 3A/3B gutter to 80px and replaced label with `Buka Detail` (width 72px).
    - Fixed Blind Hiring row overlap: separated `BLIND HIRING:` (`x = 12`), `PII Nama dan Foto diredaksi` (`x = 105`), and `AKTIF` badge (`x = 410`) with a 130px safety gap.
  - Re-generated and validated `sitemap-skillens.svg` (73,130 bytes).
  - Automatically copied clean vector code to Windows clipboard via PowerShell (`Set-Clipboard`).
- **Affected Files**:
  - `[NEW]` `.agents/skills/anti-slop/`
  - `[MODIFY]` `generate_clean_sitemap.py`
  - `[MODIFY]` `sitemap-skillens.svg`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - XML syntax validation: passed with 0 errors (`xml.etree.ElementTree`).
  - Clipboard length: 73,130 bytes verified loaded in Windows clipboard.
- **Handoff Notes for Next Session**: User can paste directly into Figma with `Ctrl + V`.

### Session: 2026-09-23 17:30 WIB — Eliminasi Total Unsur Mock, Bypass, & Karakter AI Slop pada Peta Navigasi Vektor
- **Goal / User Request**: Hapus seluruh indikasi "masuk instan", "bypass", tombol demo, dan istilah mock di seluruh sitemap diagram. Pastikan platform tampil otentik sebagai enterprise platform nyata dengan tipografi editorial bersih, bebas overlapping, dan bebas karakter AI slop (seperti bullet dots `•`).
- **Changes Made**:
  - **Eliminasi Copy Mock & Demo**:
    - `Route-Login`: Form input realistis dengan email korporat `hr@perusahaan.co.id`, field kata sandi terproteksi, dan tombol `Masuk ke Akun →` (tanpa bypass demo/admin).
    - `Route-Candidate-Apply`: Mengubah `14 Entitas Terdeteksi Instan` menjadi `14 Entitas Keahlian Terdeteksi → Lanjut`.
    - `Route-Recruiter-Jobs-Detail`: Menghapus tombol `Muat 5 Data Demo Pelamar Sekaligus` dan menggantinya dengan fitur aksi ATS nyata: `Unduh Rekapitulasi Pelamar (.CSV) →`.
    - Menghapus label `Magic Link` menjadi `Tautan Publik: skillens.ai/apply/job-39`.
  - **Penghapusan Karakter AI Slop & Typographic Polish**:
    - Mengganti seluruh separator bullet point (`•`) menjadi pemisah natural slash (`/`) atau tanda minus (`-`) sesuai standar `anti-slop` pada kartu lowongan, profil kandidat, jadwal wawancara, audit forensik, pengaturan tim, dan footer.
  - **Re-kompilasi & Validasi Vektor**:
    - Script `generate_clean_sitemap.py` berhasil dieksekusi: XML valid tanpa error entity atau syntax.
    - File `sitemap-skillens.svg` (73.258 bytes) otomatis disalin ke Windows Clipboard via PowerShell `Set-Clipboard`.
- **Affected Files**:
  - `[MODIFY]` `generate_clean_sitemap.py`
  - `[MODIFY]` `sitemap-skillens.svg`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Script audit Python: 0 temuan forbidden words (`bypass`, `demo`, `dummy`, `mock`, `instan`, `•` non-password).
  - XML `ElementTree.fromstring`: Passed.
  - Windows Clipboard: 74.202 karakter SVG siap `Ctrl + V` langsung ke Figma.
- **Handoff Notes for Next Session**: Desain sitemap siap ditempel ke Figma canvas.

### Session: 2026-09-23 17:46 WIB — Pembersihan Istilah "Kuda Troya" ke "Trap-Word" & Koreksi Total Rute Sistem (21 + 3)
- **Goal / User Request**: Ganti istilah hiperbolis "Kuda Troya Prompt" menjadi "trap-word" tanpa dramatisasi. Koreksi perhitungan rute pada header dan footer diagram sitemap agar mencakup 21 route aplikasi + 3 halaman sistem (404/error/loading).
- **Changes Made**:
  - **Eliminasi Istilah Hiperbolis**:
    - `Route-Recruiter-Jobs-New`: Mengubah `ARMED TRAP-WORD: "Kuda Troya Prompt" (Aktif)` menjadi label profesional `Deteksi Trap-Word: Aktif` yang konsisten dengan indikator telemetri kandidat (`trap-word terpicu`).
  - **Koreksi & Kelengkapan Hitungan Rute**:
    - Header Diagram (baris 52 SVG): Mengubah dari "21 rute" menjadi `Struktur 21 rute aplikasi + 3 halaman sistem (404/error/loading), alur pengujian kandidat, dan modul ATS rekruter.`
    - Menambahkan visual badges untuk 3 halaman sistem pada header: `404 not-found`, `500 global-error`, dan `loading-suspense`.
    - Footer Diagram: Memperbarui ringkasan menjadi `21 Rute Aplikasi + 3 Halaman Sistem (404/Error/Loading) / 3 Domain Akses`.
  - **Re-kompilasi & Sinkronisasi Clipboard**:
    - Menjalankan `python generate_clean_sitemap.py`.
    - Validasi XML lolos 100% (74.037 bytes).
    - Memperbarui Windows Clipboard (74.992 karakter) via PowerShell `Set-Clipboard`.
- **Affected Files**:
  - `[MODIFY]` `generate_clean_sitemap.py`
  - `[MODIFY]` `sitemap-skillens.svg`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Validasi sintaks `ElementTree.fromstring`: Passed.
  - Verifikasi konten SVG: 0 kata "Kuda Troya", teks rute akurat 21 + 3.
  - Clipboard length: 74.992 karakter terisi.
- **Handoff Notes for Next Session**: Vektor sitemap terkini siap di-paste langsung ke Figma canvas (`Ctrl + V`).

### Session: 2026-09-23 17:58 WIB — Implementasi Penuh Pilar 4: Status & Sistem Global (4 Domain Fungsional)
- **Goal / User Request**: Memperluas peta navigasi dari 3 domain menjadi 4 domain arsitektur lengkap dengan menambahkan pilar ke-4 (`04. Status & Sistem Global`). Membuat kartu nyata untuk 3 halaman sistem (`not-found.tsx`, `error.tsx`, `loading.tsx`) sesuai referensi visual sitemap dengan thumbnail, badge rute, dan deskripsi, bukan hanya teks badge sederhana.
- **Changes Made**:
  - **Ekspansi Dimensi Kanvas**:
    - Memperluas lebar kanvas dari `WIDTH = 3280` menjadi `WIDTH = 3780` untuk menampung pilar ke-4 dengan simetri padding 60px kiri dan kanan.
  - **Konstruksi Pilar 4 (`Pillar-4-System`)**:
    - Ditempatkan pada `x = 3260, y = 200, w = 460, h = 1460` dengan header `04. Status & Sistem Global`.
    - `Route-System-404`: Kartu rute `/… (404)` dengan thumbnail ilustrasi `404` dan strip oranye, judul `Tidak Ditemukan`, dan deskripsi `Kartu 404 + navigasi kembali.`
    - `Route-System-Error`: Kartu rute `error boundary` dengan thumbnail strip pink/abu/oranye, judul `Kesalahan`, dan deskripsi `Pesan + coba lagi.`
    - `Route-System-Loading`: Kartu rute `loading` dengan thumbnail skeleton bar dan indikator pulsa oranye, judul `Memuat…`, dan deskripsi `Indikator thinking.`
    - `Route-System-Protocol`: Kartu spesifikasi arsitektur App Router Next.js 16 (`not-found.tsx`, `global-error.tsx`, `loading.tsx`).
  - **Konektor Ortogonal Highway Presisi**:
    - Menambahkan percabangan trunk bus highway oranye dari `(2430, 150)` ke `x = 3250` dengan chip label `Fallback Sistem`.
    - Menghubungkan 3 stub panah horizontal langsung ke sisi kiri masing-masing kartu sistem sesuai referensi visual.
  - **Sinkronisasi Header & Footer**:
    - Header: `Struktur 24 rute dan halaman sistem terverifikasi dalam 4 domain operasional, alur asesmen kandidat, dan portal ATS rekruter.`
    - Footer: `24 Halaman Terverifikasi (21 Rute Aplikasi + 3 Sistem Global) / 4 Domain Arsitektur`.
- **Affected Files**:
  - `[MODIFY]` `generate_clean_sitemap.py`
  - `[MODIFY]` `sitemap-skillens.svg`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Validasi sintaks `ElementTree.fromstring`: Passed (80.244 bytes).
  - Audit anti-slop: 0 temuan forbidden words.
  - Windows Clipboard: 81.282 karakter terisi dan siap `Ctrl + V`.
- **Handoff Notes for Next Session**: Vektor sitemap 4 domain siap ditempel ke Figma canvas.

### Session: 2026-09-23 — Klon Halaman Rekruiter Semirip BoardUI (floating sidebar + dashboard)
- **Goal / User Request**: Klon halaman rekruiter menggunakan desain https://github.com/BoardUI/boardui DENGAN SANGAT MIRIP.
- **Changes Made**:
  - `recruiter/layout.tsx`: diganti total ke pola BoardUI AppShell (floating `DashboardSidebar` 260px rounded-3xl shadow-sidebar, mobile drawer, breadcrumb Skillens/user/halaman, header actions NotificationBell + Filter + Buat Lowongan). Nav: Pusat Kendali / Lowongan Aktif / Kandidat / Wawancara / Analitik.
  - `recruiter/page.tsx`: diganti ke pola dashboard BoardUI (StatCards plain 4 KPI, tabel Evaluasi Terbaru via BoardUI Table + Avatar + Chip, grid Alur Seleksi + Integritas). Hapus hero ShaderBackground.
  - Vendored via `boardui add sidebar app-shell breadcrumb avatar announcement dropdown button chip notification-center` (+ transitif: settings-modal, revenue/orders-chart, date-picker, docs previews).
  - Fix build: pin `@internationalized/date@3.12.4` (was 3.12.1 vs 3.12.4 nested, type mismatch #private di date-picker/docs previews).
- **Affected Files**:
  - `[MODIFY]` `frontend/src/app/recruiter/layout.tsx`
  - `[MODIFY]` `frontend/src/app/recruiter/page.tsx`
  - `[MODIFY]` `frontend/package.json` (pin @internationalized/date)
  - `[NEW]` ~70 vendored BoardUI files (sidebar/shell/breadcrumb/avatar/chart-cards/docs previews)
- **Verification & Testing**:
  - `npx tsc --noEmit` clean (0 error, termasuk 0 di recruiter/*).
  - `npm run build` green (semua route recruiter ter-render).
  - Playwright visual: BELUM dijalankan (gap jujur).
- **Handoff Notes for Next Session**: HR Management Template BoardUI adalah Pro (berbayar) jadi ini rekonstruksi faithful dari tier gratis (floating sidebar + stat-cards + data-table), bukan copy 1:1 Pro. Konflik desain: instruksi user (BoardUI: rounded-3xl, soft shadow, gradient selected) menang atas Skillens flat/sharp per precedence craft floor. Sub-halaman recruiter lain (jobs/candidates/interviews/metrics) ikut shell baru tanpa refactor isi.

### Session: 2026-09-23 — Identitas Skillens di Sidebar + Preview Terverifikasi
- **Goal / User Request**: User mau lihat hasil kloningan. Screenshot pertama menemukan sisa identitas demo BoardUI (nama "Mertcan Esmergul", tim "Board team") dan tabel kosong karena timing.
- **Changes Made**:
  - `dashboard-user-menu.tsx`: prop baru `displayName`/`displayInitials` (default tetap demo BoardUI).
  - `dashboard-sidebar.tsx`: teruskan `displayName`/`displayInitials` ke user menu.
  - `dashboard-team-menu.tsx`: default tim diganti ke Skillens (`Skillens` / `hire@skillens.ai`, avatar inisial S, tanpa logo BoardUI).
  - `recruiter/layout.tsx`: teruskan nama/inisial user login ke kedua sidebar (desktop + mobile drawer).
- **Affected Files**:
  - `[MODIFY]` `frontend/src/components/application/dashboard/dashboard-user-menu.tsx`
  - `[MODIFY]` `frontend/src/components/application/dashboard/dashboard-sidebar.tsx`
  - `[MODIFY]` `frontend/src/components/application/dashboard/dashboard-team-menu.tsx`
  - `[MODIFY]` `frontend/src/app/recruiter/layout.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` filter recruiter/dashboard: 0 error.
  - Playwright screenshot login recruiter@skillens.com → `/recruiter`: TERBUKTI tampil (floating sidebar orange selected, 4 StatCards 13/71/3/2, tabel 6 kandidat + chip, Alur Seleksi, Integritas). Catatan: `/applications` lambat ~2.5s (13 apps, 71KB) jadi screenshot butuh jeda 9s.
  - Temp scripts + png dihapus (`e2e/shot-recruiter.tmp.js`, `dbg-login.tmp.js`, `frontend/shot-recruiter.tmp.js`).
- **Handoff Notes for Next Session**: Dev server frontend :3000 + backend :8000 masih berjalan di background shell ini. `/applications` 2.5s layak dioptimasi (N+1?) bila dikeluhkan.

### Session: 2026-09-23 — BoardUI ke Semua Menu dan Halaman (full rollout)
- **Goal / User Request**: Terapkan BoardUI ke semua menu dan halaman, selalu baca folder project https://github.com/BoardUI/boardui sebagai acuan.
- **Changes Made**:
  - Clone shallow BoardUI ke `C:/Users/rfkl/AppData/Local/Temp/opencode/boardui-ref` (acuan permanen); baca `AGENTS.md` BoardUI (semantic tokens, composite type, spacing/shape, cx, remix icons) + `app/dashboard/page.tsx` + `app/login/page.tsx` + `auth-card.tsx` sebagai pola.
  - Sesi terputus di tengah: 4 subagen paralel sempat jalan, worktree ke-stash otomatis. Sesi ini: `git stash pop` mengembalikan 20 file (sebagian hasil subagen) + konversi manual 7 file sisa.
  - Rekruiter: layout (sudah), dashboard (sudah), jobs, jobs/new (Select BoardUI, switch + slider native ber-token, archetype cards, JD debias), jobs/[id] (subagen), jobs/edit (subagen), candidates (BoardUI Table + Avatar + Chip + Input search), candidates/[app_id] (subagen), interviews, metrics (StatCards + bar/trend ber-token, carbon→remix), settings, settings/team, loading, not-found, global-error.
  - Kandidat: layout (floating DashboardSidebar mirror recruiter), dashboard, profile, interviews, job detail (emoji/✓/→ diganti remix icons + Chip), apply (Input + Button + Avatar + dropzone ber-token), instructions (modal + rules + Checkbox BoardUI), test runner (subagen, dark chat → light BoardUI).
  - Auth: login + signup (kartu tengah ala AuthCard, Input + Button + Checkbox BoardUI, tombol demo 1-klik dipertahankan, ShaderBackground dibuang).
  - Identitas: DashboardUserMenu prop displayName/displayInitials; DashboardTeamMenu default Skillens/hire@skillens.ai.
  - Fix: `RiBulbLine` → `RiLightbulbLine`, `RiChevronLeftLine` → `RiArrowLeftLine`, Input `required` → `isRequired`, pin `@internationalized/date@3.12.4`.
  - Landing page (`/`) SENGAJA tidak diubah (brand editorial surface; tawarkan sebagai follow-up).
- **Affected Files**: 30 file di `frontend/src/app/**` (lihat git status) + `frontend/package.json` + vendored BoardUI (~73 file).
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green semua route.
  - Playwright tour 8 screenshot TERBUKTI: login, recruiter dashboard, jobs, candidates, interviews, metrics, settings, candidate dashboard (wizard onboarding muncul wajar untuk akun demo tanpa nama; ditutup via Nanti Saja).
  - Temp scripts + png dihapus.
- **Handoff Notes for Next Session**: Acuan BoardUI ada di `C:/Users/rfkl/AppData/Local/Temp/opencode/boardui-ref` (git clone depth-1). Jangan commit/push tanpa permintaan user (AGENTS.md). `OnboardingWizardModal` (shared) belum di-BoardUI-kan. Bar duplikat judul shell-vs-halaman di jobs/candidates/interviews bisa dirapikan bila diminta.

### Session: 2026-09-23 — Audit Mendalam BoardUI: Font Inter, Ikon, Crash Tabel
- **Goal / User Request**: Analisa mendalam, pastikan semuanya, font mirip BoardUI. Landing page dikecualikan.
- **Findings & Fixes**:
  - FONT (temuan utama): Inter sudah dimuat (`--font-inter`) tapi body memakai Helvetica karena `@theme --font-sans` menimpa rantai BoardUI; `--font-mono-source` tidak ada. Fix: expose JetBrains Mono kedua sebagai `--font-mono-source` di root layout + kelas `.font-boardui` (Inter stack) di 8 root (recruiter/candidate shell, login, signup, apply, instructions, job detail, test runner). Landing tidak tersentuh. Ukur browser: heading kini `Inter` (was Helvetica Regular).
  - Server basi: proses `next dev` lama (PID 16092) tidak mati oleh pkill dan menyajikan CSS/JS basi (aturan baru hilang, error tabel hantu). Fix: `taskkill //PID //F` + hapus `.next/dev` + start ulang.
  - Crash tabel: react-aria Table wajib minimal satu `TableColumn` dengan `isRowHeader` (BoardUI DataTableExample memakai `isRowHeader={id === "name"}`). Tambahkan `id="name" isRowHeader` di recruiter dashboard, candidates, RankingTable. Ukur: 6 baris render, 0 pageerror (was 6 error).
  - Shared components: `OnboardingWizardModal` ditulis ulang BoardUI penuh (remix icons, Button/Input/Checkbox/Chip, tanpa motion). `RankingTable` penuh token + Button/Input/Chip + remix sort icons.
  - Audit sapu: 0 carbon/lucide/motion/shader/TextRollButton di app pages (di luar landing). Sisa token lama hanya yang sah (scrim overlay bg-black/40-60 ala BoardUI, knob switch putih) atau source BoardUI / dataviz internal / landing.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/app/layout.tsx`, `frontend/src/app/globals.css`
  - `[MODIFY]` 8 root `font-boardui` (2 layout + login + signup + apply + instructions + job + test)
  - `[MODIFY]` `frontend/src/components/OnboardingWizardModal.tsx`, `frontend/src/components/RankingTable.tsx`
  - `[MODIFY]` `frontend/src/app/recruiter/page.tsx`, `frontend/src/app/recruiter/candidates/page.tsx` (isRowHeader)
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green.
  - Playwright ukur computed style + screenshot dashboard: font Inter, tabel 6 baris, 0 pageerror. Temp script + png dihapus.
- **Handoff Notes for Next Session**: Dev server fresh berjalan (:3000). Pola `taskkill //PID //F` untuk kill proses Windows dari bash (pkill tidak mempan).

### Session: 2026-09-23 — Copywriting ala BoardUI dalam Bahasa Indonesia
- **Goal / User Request**: Tiru style copywriting BoardUI, gunakan bahasa Indonesia. Landing dikecualikan.
- **Style BoardUI (diekstrak dari repo acuan)**: label kata-benda pendek ("Customers", "Quick Search"), kata kerja polos ("Create ticket", "Add user"), kalimat penjelas konkret ("Gross revenue across every channel this month, before refunds"), empty state ramah ("You're all caught up."), sentence case, tanpa caps-lock, tanpa hiperbola, tanpa emoji.
- **Changes Made**:
  - Shell: Quick Search→Pencarian cepat, Support→Bantuan, Settings→Pengaturan, No results→Tidak ada hasil, placeholder Cari navigasi…/Cari…, aria-label ID→Indonesia. Team menu→Indonesia (Lihat profil tim, Folder, Pesan, Anggota, Tagihan, Detail perusahaan, Integrasi, Notifikasi, Detail akun, Keluar; footer Skillens). User menu (Pengguna dengan akses, Tambah pengguna, Kelola). NotificationCenter (Notifikasi, Menyebut Anda, Belum dibaca, Sistem, Semua, Semua sudah dibaca). Notifikasi contoh→Indonesia konkret. SettingsModal (Umum, Profil, Perangkat, Penyimpanan). ThemeToggle (Mode terang/gelap).
  - Halaman: hapus judul ganda shell-vs-halaman (jobs, candidates, interviews, metrics→Ringkasan performa, settings, profile, candidate interviews, jobs/new, dashboard breadcrumb); Pusat Komando→Pusat Kendali (konsisten nav); EN→ID (job detail full ID, Telemetri AI aktif, Live Terpantau, Kirim Ujian, Lamar); hype dibuang (sakti, 1 Klik, Rilis Ujian AI Sekarang→Rilis Ujian, Program Posisi Baru→Buat Posisi, Deploy→Rilis); toast tanpa seru; ID lamaran; case chip (Di bawah KKM); label form sentence case; tab jobs (Pelamar, Rekomendasi AI, Simulasi dan KKM, Rincian); Kelola tim; empty state ramah.
  - Fix insidental: theme-toggle tag `<span>` rusak akibat replace → diperbaiki.
- **Affected Files**: sidebar/team-menu/user-menu/notification-center/starter-notifications/settings-modal/theme-toggle + 15 halaman app + id.json locale + RankingTable.
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright 0 pageerror + screenshot wizard (copy ID BoardUI-style terkonfirmasi visual). Temp dibersihkan.
- **Handoff Notes for Next Session**: Copy EN tersisa hanya yang disengaja (opsi bahasa English, istilah teknis KKM/AI/CV). Panduan wizard jobs/new sudah selaras dengan label form.

### Session: 2026-09-23 — Tombol Ganda, Nama Dasbor, Pembersihan Fitur Fiktif
- **Goal / User Request**: (1) Beberapa halaman punya tombol ganda (cth. Buat Posisi di rekruiter); (2) ganti nama "Pusat Kendali" yang aneh; (3) perbaiki Pengaturan, hapus fitur yang tidak ada.
- **Changes Made**:
  - Tombol ganda: hapus "Buat Posisi" di dashboard + "Buat Posisi Baru" di header jobs (shell sudah punya "Buat Lowongan" di semua halaman); hapus tombol mati "Filter Kandidat" (tanpa handler, duplikat Filter shell) + placeholder jadi "Cari kandidat…", "Refresh Daftar"→"Muat ulang"; hapus CTA "Edit Profil" ganda di hero dashboard kandidat (shell sudah ada); hapus "Keluar" ganda di header kandidat (pindah ke menu akun). Import ikon mati dibersihkan.
  - Nama: "Pusat Kendali"→"Dasbor" (nav + judul shell, konsisten dengan portal kandidat).
  - Fitur fiktif: audit halaman Pengaturan + Tim (semua fungsional: PUT /auth/me, language select, GET/POST /auth/sub-accounts). Yang fiktif adalah chrome sidebar BoardUI: nav "Pengaturan" membuka modal demo (Appearance/Billing/Tools/Storage palsu), nav "Bantuan" tanpa tujuan, toggle tema gelap (app light-only), kartu tim (menu demo), dropdown akun (user demo + Tambah/Kelola mati). Fix via prop baru DashboardSidebar (`settingsHref`, `showSupport`, `showTeamMenu`) + DashboardUserMenu/AccountMenuContent (`menuUsers`, `onSignOut`, label "Masuk sebagai"): Pengaturan kini link ke halaman asli (/recruiter/settings, /candidate/profile); Bantuan/tema/kartu tim disembunyikan; menu akun berisi user asli + Keluar fungsional (handleLogout ditambah di layout rekruiter).
  - Login: hapus link mati "Lupa kata sandi?" dan checkbox "Ingat saya" yang tidak terkoneksi.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/app/recruiter/page.tsx`, `jobs/page.tsx`, `candidates/page.tsx`, `layout.tsx`, `frontend/src/app/candidate/dashboard/page.tsx`, `layout.tsx`, `frontend/src/app/login/page.tsx`
  - `[MODIFY]` `frontend/src/components/application/dashboard/dashboard-sidebar.tsx`, `dashboard-user-menu.tsx`
  - `[MODIFY]` `frontend/src/i18n/locales/id.json` (Kelola tim)
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green.
  - Playwright: dashboard (nav Dasbor, tanpa tombol ganda), menu akun terbuka (Masuk sebagai + user asli + Keluar). 0 pageerror. Temp dibersihkan.
- **Handoff Notes for Next Session**: SettingsModal BoardUI masih di-vendor tapi tak terjangkau dari shell (ok). Bantuan/tema gelap disembunyikan, bukan dihapus dari source.

### Session: 2026-09-23 18:05 WIB — Pembersihan Kartu Spesifikasi Protokol pada Pilar 4 Sistem
- **Goal / User Request**: Hapus kartu `Route-System-Protocol` ("SYS App Router Architecture - Protokol Pemulihan & Streaming") dan konektornya pada Pilar 4 sesuai instruksi visual pengguna (lingkaran merah). Pilar 4 kini murni hanya memuat 3 kartu node sistem: `404`, `error boundary`, dan `loading`.
- **Changes Made**:
  - `generate_clean_sitemap.py`:
    - Menghapus registrasi dan markup untuk `Route-System-Protocol`.
    - Menghapus referensi `c_sys_proto` dan konektor `Flow-Loading-Protocol`.
  - Re-kompilasi `sitemap-skillens.svg`:
    - XML divalidasi lolos 100% tanpa error syntax/entity (77.683 bytes).
    - Windows Clipboard disinkronisasi ulang otomatis (78.690 karakter) via PowerShell `Set-Clipboard`.
- **Affected Files**:
  - `[MODIFY]` `generate_clean_sitemap.py`
  - `[MODIFY]` `sitemap-skillens.svg`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Validasi sintaks `ElementTree.fromstring`: Passed.
  - Windows Clipboard: 78.690 karakter terisi dan siap `Ctrl + V`.
- **Handoff Notes for Next Session**: Diagram Pilar 4 kini rapi, minimalis, dan hanya memuat 3 kartu sistem otentik.

### Session: 2026-09-23 18:07 WIB — Ekspor Sitemap Vektor ke Dokumen PDF Beresolusi Tinggi
- **Goal / User Request**: Mengonversi `sitemap-skillens.svg` menjadi file PDF (`sitemap-skillens.pdf`).
- **Changes Made**:
  - Dikonversi menggunakan Playwright Chromium headless engine dengan viewport `3780 × 1840 px` dan font embedding lengkap (Inter + JetBrains Mono).
  - Output dokumen PDF berhasil di-generate secara presisi tanpa margin (`margin: 0`), preserve vector linework, drop shadows, dan color accuracy.
  - Script konversi sementara dibersihkan dari direktori kerja.
- **Affected Files**:
  - `[NEW]` `sitemap-skillens.pdf` (1.258.605 bytes)
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Ukuran file: 1.258.605 bytes (~1.2 MB).
  - Render PDF: 1 halaman full-bleed `3780 × 1840 px`, 4 domain navigasi utuh.
- **Handoff Notes for Next Session**: File PDF siap didistribusikan atau dicetak.

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
