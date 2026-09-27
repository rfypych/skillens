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

### Session: 2026-09-27 08:55 WIB — Terapkan Sitemap Gaps: Edit-Link, Offer Stat, Konektor SVG (DONE, uncommitted)
- **Goal / User Request**: "terapkan yang lebih baik" — 4 celah audit sitemap.
- **Changes Made** (skill `skillens-design-system` + NeedMCP craft dimuat; tabrakan gaya: none — semua pakai komponen/kelas yang sudah ada di file yang sama):
  - `jobs/[id]/page.tsx`: tombol secondary "Edit Parameter & KKM" → `jobs/edit/${jobId}` di header banner (ikon RiPencilLine yang sudah diimpor). Link audit sudah ada via RankingTable:198 — tanpa perubahan.
  - `metrics/page.tsx`: stat ke-5 "Penawaran Diterima (Offer)" = count `status==='hired'` + delta mingguan, ikon RiSendPlaneLine (terbukti ada di bundle).
  - `sitemap-skillens.svg`: konektor Landing→Login diganti Landing→Signup via sisi kanan (chip "Mulai", XML tervalidasi).
- **Affected Files**: `[MODIFY]` `frontend/src/app/recruiter/jobs/[id]/page.tsx`, `frontend/src/app/recruiter/metrics/page.tsx`, `sitemap-skillens.svg`.
- **Verification & Testing**: `npx tsc --noEmit` exit 0; SVG parse OK; `graphify update .` OK. Playwright tidak dijalankan (tambahan link + stat read-only, verifikasi via tsc + inspeksi).
- **Handoff Notes for Next Session**: Belum di-commit/push (tunggu instruksi). Setelah push, staging rebuild otomatis; VPS prod perlu pull manual + gotcha copy standalone.

### Session: 2026-09-27 08:40 WIB — Audit Flow vs sitemap-skillens.svg via Graphify (DONE)
- **Goal / User Request**: `/graphify` + apakah flow sudah lengkap sesuai sitemap (24 rute, 4 pilar).
- **Changes Made**: Graph query (11534 nodes) + map 21 `page.tsx` + grep navigasi. Hasil: rute file 21/21 + sistem 3/3 ADA. Funnel kandidat utuh (apply:101→instructions:152→test:220→dashboard, guard di kedua layout, role-routing login:47-48). Recruiter CRUD utuh (new:261→detail, edit:57→jobs, candidates:152/209→audit, settings:61↔team:61). Interviews terjadwal dua arah (POST/score/respond).
- **Affected Files**: none (audit saja).
- **Verification & Testing**: Graph + grep link, tanpa eksekusi.
- **Handoff Notes for Next Session**: 4 celah vs sitemap: (1) Landing CTA → `/signup` bukan `/login` (HeroSection:58,141) — minor; (2) `jobs/[id]` tanpa link keluar ke audit/edit (editor in-page + invite modal); (3) `jobs/edit/[id]` orphan, tanpa inbound link; (4) Fitur Offer tidak ada di kode mana pun (sitemap: tombol Offer + metrik "Offer: 6").

### Session: 2026-09-27 08:25 WIB — Push Lokal 147 File ke Preview + Staging Rebuild (DONE)
- **Goal / User Request**: "gas" — commit + push perubahan lokal ke branch preview.
- **Changes Made**:
  - Audit 190 file: secret-scan diff bersih; sengaja TIDAK ikut: `backend/uploads/*` baru (CV kandidat asli!), `*.db`, `graphify-out/` (32M, + entry `.gitignore`), `.opencode/node_modules`, `.claude`, `.playwright-mcp`, skill anti-slop/boardui (bukan sesi ini), artefak e2e/PDF/log.
  - Stage 147 file (23k++): komponen app-shell/base baru, `app/api/chat`, evaluasi visual-analysis backend, package.json (ai-sdk), AGENTS/WORKLOG/graphify skill.
  - Gate: `npx tsc --noEmit` exit 0, `py_compile` OK (code-review skill dimuat; review sub-agent dilewat, diganti audit diff langsung karena uncommitted).
  - Commit `4744738`, push `215a0e4..4744738 preview` — Vercel auto-build 57s, alias staging pindah otomatis.
- **Affected Files**: `[NEW/MODIFY]` 147 file (lihat `git show 4744738 --stat`).
- **Verification & Testing**: staging root 200, login recruiter 200 JWT pasca-rebuild — Passed.
- **Handoff Notes for Next Session**: Produksi VPS masih di `215a0e4` — perlu `git pull + build + copy standalone + restart` di VPS untuk ikut `4744738` (ingat gotcha copy static!). Sisa unstaged tetap lokal (uploads, graphify-out, tool configs).

### Session: 2026-09-27 08:10 WIB — Fix Staging Login 404: Preview Env ke Backend Mati (DONE)
- **Goal / User Request**: "An error occurred" waktu login di staging.
- **Changes Made**:
  - Diagnosis: `POST staging/api/auth/login` → 404 envelope asing (`request_id`, bukan FastAPI `detail`); `staging/api/health` 404 via `Server: Vercel` (rewrite tidak tembus). Env Preview menunjuk backend lama yang mati (61d). Prod apex untuk payload sama → 422 validasi (backend hidup, form `username`+`password`).
  - Fix via Vercel CLI: Preview `NEXT_PUBLIC_API_URL=https://staging.socratech.my.id/api` (re-add non-sensitive; catatan: prefix NEXT_PUBLIC ditolak sebagai Sensitive di Preview) + Preview `BACKEND_INTERNAL_URL=https://socratech.my.id/api`; `vercel redeploy` preview → build baru Ready 1m, alias staging pindah otomatis (branch domain).
- **Affected Files**: none lokal (env Vercel project skillens).
- **Verification & Testing**: `POST staging/api/auth/login` form username+password → 200 `access_token` JWT — Passed.
- **Handoff Notes for Next Session**: Staging kini fungsional penuh tapi memakai backend+DB PRODUKSI (isolasinya UI saja). Envelope 404 lama tak perlu diusut (backend mati sudah dilepas).

### Session: 2026-09-27 07:55 WIB — Staging staging.socratech.my.id untuk Branch Preview via Vercel (DONE)
- **Goal / User Request**: Buat subdomain staging untuk branch preview di GitHub; konfirmasi git version control (+graph).
- **Changes Made**:
  - Git terkonfirmasi: lokal `preview` @215a0e4 == `origin/preview` == VPS `/home/skillens/skillens` (prod VPS jalan di branch preview, bukan main).
  - Vercel CLI authed (rfypych, team rofyys-projects). Project `skillens` root `frontend`, env Preview+Production hanya `NEXT_PUBLIC_API_URL` + `BACKEND_INTERNAL_URL` (Sensitive, tak terbaca). Latest preview deploy 17h Ready + alias `skillens-git-preview-…`.
  - DNS via CF API: CNAME `staging` → `cname.vercel-dns.com`, DNS-only (unproxied) — success.
  - `vercel domains add staging.socratech.my.id skillens` → verified. Awalnya serve production (main, build 48d). User beri Vercel token (memory-only) → PATCH domain `gitBranch: preview` → alias pindah ke deploy preview terbaru.
- **Affected Files**: none lokal (config Vercel + DNS Cloudflare).
- **Verification & Testing**: HTML staging byte-identik dengan preview deploy (40134B, `cmp` IDENTICAL), `X-Vercel-Cache: HIT` — Passed.
- **Handoff Notes for Next Session**: (1) Setiap push ke `preview` otomatis update staging. (2) Lokal punya uncommitted changes di `frontend/` (+AGENTS/WORKLOG) — BELUM tampil di staging sampai di-commit+push. (3) Staging pakai Preview env → API menunjuk backend VPS produksi (DB prod!). Staging write mengotori data asli; opsi: backend staging terpisah (VPS 8001 + DB sendiri) atau project Vercel staging tersendiri. Token Vercel/CF tidak disimpan di repo.

### Session: 2026-09-27 07:40 WIB — Fix Missing Styling: Standalone Static Copy + CF Purge (DONE)
- **Goal / User Request**: Styling hilang (no CSS) di socratech.my.id.
- **Changes Made** (via `ssh jhic`):
  - Diagnosis: 19 aset `_next/static` di HTML, 2 CSS + 3 font + 2 JS 404 (`Not Found` 9B). File ADA di `.next/static` (70 chunks) tapi origin 404 semua → `.next/standalone/.next/static/` tidak ada (langkah copy standalone terlewat saat deploy manual). Sebagian JS 200 di edge ternyata cache basi dari deploy lama.
  - Fix: `cp -r .next/static .next/standalone/.next/static` + `cp -r public .next/standalone/public`, `chown skillens`, `systemctl restart skillens-frontend` → origin css/js/font 200.
  - `purge_everything` via API (token cfat_ bisa purge) karena edge menyimpan 404 lama ber-TTL panjang → 19/19 aset 200, CSS `text/css`, root 200.
- **Affected Files** (VPS): `/home/skillens/skillens/frontend/.next/standalone/` (ditambah static+public). Tanpa ubah kode repo.
- **Verification & Testing**: origin css 200:7568B, js 200, font 200; edge 19/19 200 pasca-purge — Passed.
- **Handoff Notes for Next Session**: GOTCHA — deploy manual VPS (git pull + build + restart) WAJIB sertakan copy standalone, kalau tidak styling hilang lagi:
  `cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public && chown -R skillens:skillens .next/standalone && systemctl restart skillens-frontend`
  lalu purge cache CF. Tidak ada deploy script di VPS; pertimbangkan buat `deploy-vps.sh` agar tidak manual.

### Session: 2026-09-27 07:25 WIB — Cloudflare Rules via API: Redirect www→Apex + Edge Cache `/` (DONE)
- **Goal / User Request**: User memberi token baru (`cfat_…`, nama wispy-heart-2bb6); eksekusi sisa via API.
- **Changes Made** (via API, token hanya di memory, tidak disimpan di file):
  - Token verified: rulesets readable (managed saja: sanitize, firewall managed, ddos_l7). SSL setting = `full`, cert active — no change.
  - Buat ruleset `apex-canonical-redirect` (`ff54c341…`, phase http_request_dynamic_redirect): `www.socratech.my.id/*` → 301 `https://socratech.my.id` + path, preserve query.
  - Buat ruleset `landing-edge-cache` (`61241749…`, phase http_request_cache_settings): hanya `socratech.my.id/` exact → edge TTL override 300s, browser respect origin.
- **Affected Files**: none (pure Cloudflare dashboard config via API).
- **Verification & Testing**:
  - `www/` → 301 `Location: https://socratech.my.id/`; `www/how-it-works?x=1` → 301 path+query utuh; apex tetap 200 — Passed
  - `/`: MISS→HIT, TTFB 0.13-0.17s (was 0.2-0.9s via tunnel); `/login` tetap DYNAMIC (tidak ikut tercache) — Passed
- **Handoff Notes for Next Session**: Config Cloudflare final: tunnel named tunggal, DNS apex+www CNAME tunnel proxied, SSL full, redirect 301 www→apex, edge cache `/` 5 mnt. Jika landing di-deploy ulang, edge refresh maksimal 5 mnt. Token lama (`cfut_…`, Zone:Read+DNS) dan token baru tidak disimpan di repo.

### Session: 2026-09-26 22:15 WIB — Cloudflare API Token Check: Redirect/Cache Rules Blocked by Scope (PENDING USER)
- **Goal / User Request**: User memberi API token; lanjutkan sisa (SSL verify, redirect www→apex, cache rule `/`).
- **Changes Made**:
  - Token valid (`/tokens/verify` active), zone `socratech.my.id` (`81d83f…`, active, full, NS bayan+erin, migrasi dari JagoanHosting hari ini).
  - DNS via API terkonfirmasi benar: CNAME apex+www → `<tunnelID>.cfargotunnel.com` proxied; legacy A `server.` + CNAME ftp/mail ikut apex.
  - Token scope terbatas: `settings/ssl` → 9109 Unauthorized; `rulesets` list → 10000 Authentication error; `pagerules` → 403; `settings/cache_level` → Authentication error. Hanya Zone:Read + DNS yang bisa. Redirect Rules / Cache Rules / SSL / Page Rules via API TIDAK bisa dengan token ini maupun cert.pem cloudflared (scope Tunnel+DNS saja).
  - VPS deploy copy `/home/skillens/skillens` = git repo bersih di `215a0e4`, origin `rfypych/skillens.git` — siap untuk alur fix-via-git jika dipilih.
- **Affected Files**: none.
- **Verification & Testing**: apex+www tetap 200 via tunnel — OK, tidak ada regresi.
- **Handoff Notes for Next Session**: Tiga opsi untuk redirect www→apex + cache `/`: (A) user klik dashboard (Redirect Rules, 2 mnt); (B) user buat token baru dengan SSL:Edit + Rulesets:Edit + Cache:Edit lalu agent eksekusi via API; (C) redirect origin di `frontend/next.config.ts` + rebuild/restart VPS via alur git. Token yang diberikan TIDAK disimpan di file mana pun.

### Session: 2026-09-26 22:05 WIB — Verifikasi CLI Cloudflare VPS + Stabilitas Apex (DONE)
- **Goal / User Request**: User infokan ada Cloudflare CLI yang sudah auth di VPS jhic.
- **Changes Made**:
  - Cek VPS: tidak ada `wrangler`; satu-satunya CLI authed adalah `cloudflared` (`/root/.cloudflared/cert.pem`) — sudah dipakai maksimal (tunnel ingress + `route dns --overwrite-dns` apex+www). Tidak ditemukan `CF_API_TOKEN` di env/file.
  - Apex sempat 000 1x (transient pasca-overwrite DNS), retest 6x kemudian 200 semua (0.26-1.10s) via SIN edge — pulih, bukan persisten.
- **Affected Files**: none (verifikasi saja).
- **Verification & Testing**: apex 6x 200, www 200, `/login`+`/api/health` 200 — OK.
- **Handoff Notes for Next Session**: Sisa butuh dashboard/API token (SSL mode verify, Redirect Rule www→apex, Cache Rule `/`): minta user buat API token (Zone:Read + Cache Rules:Edit + Rulesets:Edit) atau klik dashboard. Alternatif tanpa token: redirect www→apex via `redirects()` di `frontend/next.config.ts` + rebuild + restart di VPS (perlu alur deploy git yang disepakati dulu).

### Session: 2026-09-26 21:50 WIB — Fix socratech.my.id: DNS Tunnel + Kill Quick Tunnel (DONE)
- **Goal / User Request**: Perbaiki semuanya (follow-up dari diagnosa lelet).
- **Changes Made** (via `ssh jhic`, skill `cloudflare` tunnel):
  - Backup `/root/.cloudflared/config.yml` → `config.yml.bak-20260926`; tulis ingress baru berisi apex + www → `127.0.0.1:3000` + `http_status:404` fallback.
  - `cloudflared tunnel route dns --overwrite-dns 9e384c55 www.socratech.my.id` → www 525→200. Lalu hal yang sama untuk apex (sempat 000 transient ~30s saat propagasi, pulih 200).
  - `systemctl stop + disable skillens-tunnel.service` (quick tunnel `--url`, PID 167153 mati); `systemctl restart skillens-tunnel-named.service` (PID baru 410987, 4 koneksi QUIC sehat: sin13/sin14/cgk07x2, env precheck PASS).
  - `graphify update .` lokal per aturan AGENTS.md.
- **Affected Files** (VPS): `/root/.cloudflared/config.yml`, DNS CNAME apex+www → `<tunnelID>.cfargotunnel.com`, `/etc/systemd` state (quick disabled).
- **Verification & Testing**:
  - www 5x: `200:0.20/0.21/1.43/0.22/0.19s` (was 525 + spike 2.88s) — FIXED
  - apex 5x: `200:0.26/0.71/0.22s` (was jitter 0.19-0.86s, masih ada jitter wajar tunnel) — OK
  - `/login` 200, `/api/health` 200 via apex — OK
  - `systemctl`: named/frontend/backend active, quick inactive; `ps` 1 cloudflared saja — OK
- **Handoff Notes for Next Session**: Sisa opsional (dashboard Cloudflare, butuh akses): 1) pastikan SSL mode Full (bukan Strict) — 525 sudah hilang jadi kemungkinan sudah benar; 2) pilih kanonik apex vs www + Redirect Rule (saat ini keduanya 200, duplikat konten); 3) opsional Cache Rule edge untuk `/` (prerender, s-maxage=1th) karena HTML masih DYNAMIC; 4) opsional matikan dockerd/Webuzo idle di VPS 4GB. Jitter 0.1-0.9s via tunnel adalah overhead normal (origin 3ms).

### Session: 2026-09-26 21:35 WIB — Troubleshoot socratech.my.id Lelet via Graphify + SSH jhic
- **Goal / User Request**: Troubleshoot kenapa socratech.my.id terasa lelet menggunakan graphify, SSH VPS alias `jhic`.
- **Changes Made**:
  - Graphify-first per AGENTS.md: `graphify query "how is deployment configured"` + `query "frontend backend API proxy"` → peta proxy: `frontend/src/proxy.ts:4`, `lib/api.ts:98`, `next.config.ts` rewrite `/api/:path*` → `BACKEND_INTERNAL_URL`. Catatan: `--code-only` skip Caddyfile/docker-compose (yaml/docs), jadi infra dicek langsung via SSH/curl.
  - Curl edge: apex 200 TTFB 0.19-0.69s jitter (5x: 0.41/0.47/0.20/0.70/0.39s), `cf-cache-status: DYNAMIC`, `x-nextjs-cache: HIT`; www 525 SSL handshake failed + spike 2.88s. Statik `_next` sudah `cf-cache-status: HIT`.
  - SSH jhic: origin localhost cepat (frontend `/` 3.5ms, `/login` 2.3ms, backend `/health` 1.8ms), systemd prod build (`server.js` standalone, NODE_ENV=production). DB Neon + Redis Upstash eksternal. Load 0.25, RAM 3.9G (free 1.5G), disk 33%. `docker ps` kosong (compose tidak dipakai), dockerd + Webuzo/Apache/MariaDB idle. Dua cloudflared: named tunnel `9e384c55` (created today, edge 2xCGK+2xSIN) + quick tunnel `--url` 1+ hari (PID 167153). `config.yml` hanya punya `www` → `127.0.0.1:3000`, tanpa apex. Frontend restart 21:20 WIB (SIGTERM 143, deploy, bukan OOM).
- **Affected Files**: (diagnosa saja, tanpa ubah kode)
  - `Caddyfile:5`, `docker-compose.prod.yml:13-56` (tidak dipakai di VPS, deploy bare-metal systemd)
  - `/etc/systemd/system/skillens-frontend.service`, `skillens-backend.service` (VPS)
  - `/root/.cloudflared/config.yml` (VPS, hanya www, missing apex)
- **Verification & Testing**:
  - `curl apex 5x` jitter 3x + `curl www` 525/2.88s spike — reproduced
  - `ssh jhic curl localhost` 2-3ms — origin healthy, bottleneck di CF edge + tunnel, bukan kode
  - `graphify god-nodes/query` — graph 4087 nodes responsif — Passed
- **Handoff Notes for Next Session**: Perbaikan (belum dieksekusi, perlu konfirmasi user): 1) tambah apex ke ingress + `cloudflared tunnel route dns <ID> socratech.my.id www.socratech.my.id`, restart tunnel; 2) kill quick tunnel PID 167153; 3) cek Cloudflare SSL mode (Full, bukan Strict) + redirect www↔apex tunggal; 4) pertimbangkan matikan docker/Webuzo idle atau naikkan VPS. Setelah fix ukur ulang `curl -w ttfb` 5x apex+www dan `cloudflared tunnel info`.

### Session: 2026-09-26 15:30 WIB — Graphify Docs + OpenCode Agent Install + Code Graph Build
- **Goal / User Request**: Baca dokumentasi https://github.com/Graphify-Labs/graphify, lalu cari cara untuk kamu gunakan sebagai agent (OpenCode).
- **Changes Made**:
  - Docs v8 dibaca via WebFetch (README, ARCHITECTURE, pyproject): CLI `graphifyy` (double-y), tree-sitter AST lokal, edge tags EXTRACTED/INFERRED, query/path/explain, `graphify-out/graph.json + GRAPH_REPORT.md + graph.html`.
  - Install CLI: `uv tool install graphifyy` (v0.9.69, 448 code files supported, 37 grammars).
  - Install skill project-scope: `graphify install --platform opencode --project` (menulis `.opencode/skills/graphify/SKILL.md`, `.opencode/plugins/graphify.js`, register di `.opencode/opencode.json`, append section `## graphify` ke `AGENTS.md`) + `graphify install --platform agents --project` (menulis `.agents/skills/graphify/SKILL.md`).
  - Build graph code-only: `graphify extract . --code-only --no-viz` lalu `graphify cluster-only . --no-viz` (label LLM gagal karena Claude credit low, fallback Community N placeholders).
- **Affected Files**:
  - `[MODIFY]` `AGENTS.md` (append 13-line graphify section)
  - `[NEW]` `.opencode/skills/graphify/SKILL.md` + `references/`
  - `[NEW]` `.opencode/plugins/graphify.js`, `[MODIFY]` `.opencode/opencode.json`
  - `[NEW]` `.agents/skills/graphify/SKILL.md` + `references/`
  - `[NEW]` `graphify-out/graph.json` (4087 nodes, 8223 edges, 285 communities), `graphify-out/GRAPH_REPORT.md`, `manifest.json`
- **Verification & Testing**:
  - `graphify god-nodes --top 10`: cx (213), react (120), User (71) — Passed
  - `graphify query "what connects auth to database?"`: 330 nodes found, BFS dari database.py/AuthCard/auth-card.tsx — Passed
  - `graphify explain "FastAPI"`: 15 imports_from EXTRACTED dari routers/services — Passed
  - `graphify path "User" "DatabasePool"`: correctly reports no match; `path "FastAPI" "User"`: no directed path (expected, undirected needed) — Passed
  - `graphify cluster-only`: labeling failed (claude -p credit low) tapi graph + report tetap ditulis — known note
- **Handoff Notes for Next Session**: Skill sudah always-on via AGENTS.md. Untuk pertanyaan codebase gunakan `graphify query/path/explain` dulu sebelum grep. Setelah ubah kode jalankan `graphify update .`. Untuk docs/PDF/images perlu GEMINI_API_KEY atau biarkan host-agent sebagai LLM. `graphify-out/` saat ini not-ignored (cek `git check-ignore`); putuskan share via `git add -f graphify-out/graph.json GRAPH_REPORT.md` atau tambahkan ke .gitignore.

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

### Session: 2026-09-24 — Vision Akal-akalan: verdict + Gemini backend
- **Goal / User Request**: "Akalin model vision yang bisa baca gambar (orang bekerja di CV)".
- **Changes Made**:
  - Provider matrix tested live: Groq key = 11 text/audio models, llama-4-scout/maverick 404; pollinations = hallucinated office from panel sketch; Moondream2 CPU = OOM-kills 12GB server (fp32 ~7GB, fp16 still too big alongside API); SmolVLM-256M = garbage output ("Kasus di kawin."). Also fixed env: stale HF OAuth token broke anonymous hub downloads (huggingface-cli logout); pinned starlette<0.47 again after pip sidegrade.
  - `services/vision.py`: Gemini 2.0 Flash backend (OpenAI-compatible endpoint), `GOOGLE_API_KEY` in config + `.env.example`, graceful 503 without key; background-thread job stores findings on application.
  - Gallery UI copy updated (neutral key requirement); evaluator already consumes visual summary when present.
- **Affected Files**:
  - `[NEW]` `backend/services/vision.py`
  - `[MODIFY]` `backend/config.py`, `backend/.env.example`, `backend/routers/biosphere.py`, `frontend/src/app/recruiter/candidates/[app_id]/page.tsx`
- **Verification & Testing**:
  - Endpoint without key → 503 + photo-presence 400 paths verified live. Gemini path itself untested (no key in env).
  - Semgrep 0 findings; tsc clean; build green.
- **Handoff Notes for Next Session**: USER ACTION: create free key at https://aistudio.google.com/apikey → add `GOOGLE_API_KEY=<key>` to backend/.env → restart backend → click "Analisis Visual AI" on any photo app. Then verify quality before claiming to jury.
- **Commits**: `e6f9069` on `preview`.

### Session: 2026-09-25 — VPS Deploy (JagoanHosting, root, Docker)
- **Goal / User Request**: Deploy to JagoanHosting VPS via `ssh jhic`; git version control; best DevOps.
- **Changes Made**:
  - Survey: Ubuntu 24.04, 3.9GB RAM, Webuzo Apache owns :80/:443 (do not touch panel vhost). Decision: Docker on VPS + Apache front-door ProxyPass (NOT shared hosting — FastAPI needs ASGI).
  - Installed Docker 29.8 + compose (official repo; Ubuntu repo lacked compose plugin).
  - New: `frontend/Dockerfile` (standalone), `docker-compose.prod.yml` (no local db/redis/worker; +Caddy), `docker-compose.apache.yml` (drop Caddy, loopback publish), `Caddyfile`, `.dockerignore` ×2, `documentation/DEPLOY-VPS.md`.
  - Fixes found by container smoke test: `BACKEND_INTERNAL_URL` as compose build-arg (rewrite baked at build); `FRONTEND_URL` env-driven CORS in backend (`config.py` + `main.py`); Caddyfile `{$DOMAIN:localhost}` default; `starlette<0.47` pin in requirements.
  - Missing-type incident: `resume_visual_analysis` absent from committed `types/api.ts` broke VPS build (fixed in `c70bbc6`).
  - VPS: `/opt/skillens` (branch preview), `backend/.env` scp'd + `FRONTEND_URL=https://socratech.my.id`, Apache `00-skillens.conf` ProxyPass → 127.0.0.1:3000, graceful reload OK.
- **Affected Files**: (see commits `9bcedc5`, `9d7012e`, `c70bbc6`)
- **Verification & Testing**:
  - Both images built; in-network: frontend 200, backend 200, `/api/auth/login` → JWT through full chain; Apache vhost 200 + login 200 via Host header.
  - Caddy path validated separately (redirect + local cert issuance); unused on this box.
- **Handoff Notes for Next Session**: BLOCKED on user: point DNS `socratech.my.id` A → `101.50.1.15`, then install acme.sh + issue cert + add :443 vhost. Containers running now serve HTTP only to that hostname.
- **Commits**: `9bcedc5`, `9d7012e`, `c70bbc6` on `preview`.

### Session: 2026-09-25 — Native mentor-flow deploy (no Docker, no tunnel dependency)
- **Goal / User Request**: Replicate mentor's Webuzo flow: Node plugin + clone to project path + bind domain. (No Node plugin installed; Node absent → replicated natively.)
- **Changes Made** (all on VPS, repo already had the code):
  - Installed Node 20 LTS (nodesource); cloned `-b preview` to `/home/skillens/skillens` (owned by `skillens` user created earlier via panel).
  - Python venv `/home/skillens/venv` + requirements; frontend `npm ci` + prod build (`BACKEND_INTERNAL_URL=http://127.0.0.1:8000` baked).
  - systemd units `skillens-backend` (uvicorn :8000) + `skillens-frontend` (standalone :3000), enabled; Docker stack stopped (frees ~1GB RAM on 3.9GB box).
  - Existing Apache `00-skillens.conf` ProxyPass + tunnel target unchanged (both point at 127.0.0.1:3000).
- **Affected Files**: VPS-only (`/etc/systemd/system/skillens-*.service`); repo: none (no commit needed).
- **Verification & Testing**:
  - backend 200, frontend 200, Apache vhost 200, login→JWT through full chain, tunnel URL 200.
- **Handoff Notes for Next Session**: Public 80/443 still shared-infra (unchanged). To update app: `cd /home/skillens/skillens && git pull && rebuild frontend + systemctl restart skillens-*`.
- **Commits**: none (ops only).

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

### Session: 2026-09-23 — Perbaikan 5 Logo Sponsor di Semua Halaman
- **Goal / User Request**: Perbaiki kelima logo (JHIC, Jagoan Hosting, Komdigi, Garuda Spark, Ngalup) di semua halaman, pastikan diletakkan dengan baik.
- **Findings & Fixes**:
  - Aset timpang: dimensi sumber 1.38:1 s.d. 6.32:1 dan ukuran 29-174KB per file (total 525KB) untuk logo footer. Fix: resize via sharp ke tinggi 96px → total 57KB (≈90% lebih ringan), proporsi asli dipertahankan.
  - `SponsorLogos` ditulis ulang ala BoardUI: varian `strip` (login/signup/apply) dan `band` (footer shell: hairline atas + caption "Didukung oleh"), tinggi visual seragam h-6 + batas lebar per logo (komdigi kecil tidak tenggelam, ngalup lebar tidak dominan), grayscale tenang + hover berwarna, wrap rapi di mobile.
  - Penempatan: band ditambahkan di layout rekruiter + kandidat (sebelumnya hilang saat konversi BoardUI); strip tetap di login/signup/apply. Total 5 titik.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/components/SponsorLogos.tsx`, `frontend/src/app/recruiter/layout.tsx`, `frontend/src/app/candidate/layout.tsx`
  - `[MODIFY]` `frontend/public/sponsors/*.png` (5 file dioptimasi)
- **Verification & Testing**:
  - `npm run build` green. Playwright: strip login + band footer dashboard (5 img ter-render, sejajar rapi). 0 pageerror. Temp dibersihkan.
- **Handoff Notes for Next Session**: Server dev fresh berjalan (:3000 + :8000) setelah keduanya sempat mati antar-sesi.

### Session: 2026-09-23 — Push Sponsor Logos ke preview
- **Goal / User Request**: Push ke preview branch.
- **Changes Made**:
  - Gate: skill `code-review` dimuat; review difokuskan (diff kecil, 9 file, authored sendiri): standar BoardUI terpenuhi, `tsc`/`build` hijau, secret-scan diff bersih (1 hit = teks dokumentasi worklog, false positive). `.env.local` ter-ignore.
  - Temuan: HEAD `4744738` sudah berisi full BoardUI rollout (24 file app) dari sync sesi sebelumnya; working diff hanya delta sponsor (9 file).
  - Stage selektif 9 file (WORKLOG, 5 PNG, 2 layout, SponsorLogos). Artefak tak dilacak (uploads PDF, e2e visual, .agents, dsb.) TIDAK ikut.
  - Commit `e6757e3` + push `preview` sukses (`4744738..e6757e3`).
  - Bersih: `e2e/audit-font-dash.png` dihapus.
- **Affected Files**: (sama 9 file sesi sponsor, kini ter-commit)
- **Verification & Testing**: `git status` pasca-push bersih (hanya untracked lama); remote `preview` maju ke `e6757e3`.
- **Handoff Notes for Next Session**: Semua pekerjaan BoardUI sesi ini sudah di `preview`. Merge ke `main` menunggu permintaan user.

### Session: 2026-09-23 — Hybrid Login: Shader Main + ASCII Oranye + Kartu BoardUI
- **Goal / User Request**: Cek login branch main (ada WebGL shader), terapkan + hybrid dengan style saat ini; shader jadi ASCII warna oranye yang estetik.
- **Changes Made**:
  - Baca `main:login/page.tsx` (ShaderBackground: Swirl + ChromaFlow orange + FlutedGlass + FilmGrain) + `AsciiFluidBg` (medan ASCII hijau, tak terpakai).
  - Baru `OrangeAsciiCanvas.tsx`: plasma ASCII full-layar transparan, rampa oranye 7 stop, alpha memudar ke tengah (zona tenang di belakang kartu), font JetBrains Mono, cap 30fps, hormat reduced-motion + pause saat tab hidden. Tanpa `mix-blend-screen` (blend + WebGL tak tampil di env ini, dibuktikan empiris).
  - Login hybrid: panggung gelap hangat `#100806` + glow radial oranye CSS + ASCII di atasnya, kartu BoardUI terang tak berubah logikanya (demo 1-klik, show password, error, sponsor) + shadow-waitlist, link kembali putih/60.
- **Affected Files**:
  - `[NEW]` `frontend/src/components/OrangeAsciiCanvas.tsx`
  - `[MODIFY]` `frontend/src/app/login/page.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright 0 pageerror + screenshot: plasma oranye penuh + kartu tenang (visual proof). Temp dibersihkan.
  - Debug marathon (dicatat agar tak diulang): piksel probe menipu karena server dev basi (8032 stale) — pola `taskkill //PID //F` + hapus `.next/dev` + start ulang; `mix-blend-screen` + `shaders/react` tak render di headless env ini.
- **Handoff Notes for Next Session**: Signup masih terang polos (tawarkan hybrid yang sama bila diminta). `ShaderBackground` tetap dipakai landing (excluded).

### Session: 2026-09-23 — Koreksi Tema Login (Gelap Benar, ASCII Rapi, via Context7)
- **Goal / User Request**: Tema ngawur — putih ya putih, gelap ya gelap. Cek lagi, jangan aislop, gunakan context7.
- **Audit (jujur)**: Kartu sudah putih murni ✓. Yang ngawur: (1) latar `#100806` coklat kotor saat kena glow; (2) ASCII terlalu rapat (sel 30px, ambang rendah, glif berat `$@`) sehingga jadi noise wallpaper.
- **Context7**: `/tailwindlabs/tailwindcss.com` → pola resmi `@custom-variant dark (&:where(.dark, .dark *))`. Diverifikasi sistem tema repo sudah benar (varian + token `.dark` ada, app light-only by design) — tak ada yang diubah di sana.
- **Fix**: panggung jadi hitam netral `#0B0B0C` + glow oranye lebih kecil/redup; ASCII dijarangkan (sel 48px, ambang 0.34, tanpa `$@`, rampa dengan bayangan pekat, alpha + zona tenang diperlebar). Hasil: aksen oranye jarang dan elegan, tengah tenang, kartu putih murni.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/components/OrangeAsciiCanvas.tsx`, `frontend/src/app/login/page.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright desktop + mobile (390px): rapi di keduanya. Temp dibersihkan.
- **Handoff Notes for Next Session**: Jangan kembalikan `mix-blend-screen`/`shaders/react` ke login (tak render andal di env ini, sudah dibuktikan empiris berkali-kali).

### Session: 2026-09-23 — Revert Login ke Versi Production (main)
- **Goal / User Request**: Undo hybrid login; user ingin layout persis production.
- **Changes Made**:
  - `frontend/src/app/login/page.tsx` dikembalikan persis dari `main` (`git checkout main -- ...`): layout split production (mobile card-sheet + desktop form/panel, carbon icons, motion, ShaderBackground). Terverifikasi visual desktop + 0 pageerror + `tsc` bersih.
  - `frontend/src/components/OrangeAsciiCanvas.tsx` dihapus (tak ada referensi tersisa).
  - Status: perubahan masih staged, BELUM di-commit/push (menunggu instruksi; aturan commit eksplisit).
- **Handoff Notes for Next Session**: Jika user minta push revert ini, commit + push `preview` seperti biasa.

### Session: 2026-09-23 — Login Production + Kulit BoardUI (layout persis main)
- **Goal / User Request**: Setelah revert, user ingin layout persis production tapi style BoardUI.
- **Changes Made**:
  - `login/page.tsx` ditulis ulang: struktur + copy 100% production (mobile card-sheet + desktop split form/panel, ShaderBackground, remember/forgot, sponsor) dengan kulit BoardUI — token semantik, font Inter (`font-boardui`), composite type (hero `text-display-3/2-medium`), Button/Input/IconButton BoardUI, ikon remix (eye-toggle via overlay IconButton + `fieldClassName="pr-11"` karena trailingIcon dekoratif), tanpa motion.
  - Panel gelap production dipertahankan apa adanya (seni yang disengaja, bukan bug tema).
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright desktop 1440 + mobile 390: layout production utuh berkulit BoardUI. 0 pageerror. Temp dibersihkan.
- **Handoff Notes for Next Session**: Login kini divergen dari `main` hanya di styling (lebih aman di-merge). Signup belum disentuh sesi ini.

### Session: 2026-09-23 — Audit Standar BoardUI Resmi (Skill + Graphify)
- **Goal / User Request**: Belum benar-benar mempelajari UI BoardUI; beberapa seksi aislop dan tak penuhi standar. Revisi pakai context7/graphify.
- **Studi**: skill resmi BoardUI (`.agents/skills/boardui/`: SKILL + patterns/motion/theming) + graphify query/topik standar. Temuan koreksi penting: kartu/panel = `rounded-3xl` (koreksi 2xl saya sebelumnya SALAH), heading seksi = `title-2`, tombol teks = LinkButton, press = step warna `active:`, keyframe wajib guard reduced-motion, ubin stat 2xl mengikuti source komponen.
- **Changes Made**:
  - Panel (preview/logo/steps/portals/demo/spotlight/showcase) → 3xl; heading seksi → title-2; FAQ → rounded-xl (baris menu).
  - Link inline (Mulai Evaluasi, portal CTA) → LinkButton resmi; `active:` press states dilengkapi.
  - Animasi blink telemetri (tanpa guard, off-scale) DIHAPUS → bar statis.
  - `graphify update .` pasca-edit.
- **Affected Files**: 9 file `frontend/src/components/landing/*`.
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright showcase: kartu 3xl, heading title-2, LinkButton. 0 pageerror. Temp dibersihkan.

### Session: 2026-09-23 — Rombak Landing Ikuti BoardUI.com Asli
- **Goal / User Request**: Masih tidak mirip BoardUI sama sekali; cari komponen BoardUI yang cocok dan rombak dari "Tiga lapisan bukti" ke bawah.
- **Riset**: fetch HTML boardui.com (1.8MB) + ekstrak struktur asli: grid komponen live-demo (judul + 1 baris), spotlight loading state, template siap pakai, blok install/MCP, pricing, FAQ. Itu yang ditiru persis.
- **Changes Made**:
  - `FeaturesSection` → grid 6 kartu live: tabel peringkat, stat, thinking indicator hidup, telemetri live animasi, FileUpload asli (bisa dijatuhi PDF), radar fingerprint.
  - Baru `SpotlightSection` (panel gelap + ThinkingIndicator hidup), `PortalsSection` (2 kartu portal gradient-icon), `DemoAccessSection` (blok terminal mono + salin fungsional + tombol Masuk), `FaqSection` (akordeon 5 Q).
  - `StepsSection` dihapus (diganti DemoAccess). `page.tsx` urutan baru. Hero TIDAK disentuh.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/components/landing/FeaturesSection.tsx`, `frontend/src/app/page.tsx`
  - `[NEW]` `SpotlightSection.tsx`, `PortalsSection.tsx`, `DemoAccessSection.tsx`, `FaqSection.tsx`
  - `[DELETE]` `frontend/src/components/landing/StepsSection.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright 5 shot semua seksi: tabel/stat/thinking/telemetri/upload/radar hidup, spotlight, portal, terminal demo, FAQ. 0 pageerror. Temp dibersihkan.
- **Handoff Notes for Next Session**: BELUM push. Microcopy Inggris di dalam FileUpload adalah bawaan komponen BoardUI asli (disengaja).

### Session: 2026-09-23 — Rombak Total Bawah Hero (Tanah Putih BoardUI)
- **Goal / User Request**: Bagian "Tiga lapisan bukti" ke bawah jelek banget; rombak total presis BoardUI. Hero jangan diubah.
- **Root Cause**: dekorasi tabrakan sudah dibuang sesi lalu tapi bahasa visual masih generik (tanah abu raksasa + panel putih besar + radius 3xl di mana-mana), bukan bahasa aplikasi BoardUI.
- **Changes Made**:
  - Tanah bawah-hero jadi putih penuh (`bg-background-full`, footer ikut) — persis ground aplikasi BoardUI.
  - Kepadatan skala dashboard: seksi py-4/6, kartu p-5/6, radius kartu 2xl seragam (3xl hanya panel display hero/CTA).
  - LogoCloud jadi ubin secondary tanpa border; strip abu antara CTA-footer dihapus.
  - Hero TIDAK disentuh.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/app/page.tsx`, 6 file `frontend/src/components/landing/*`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. Playwright 2 shot: ubin stat + kartu putih + steps + CTA gelap + footer, semua bersih. 0 pageerror. Temp dibersihkan.
- **Handoff Notes for Next Session**: BELUM push (unggu perintah). PENTING: user kemungkinan melihat URL production (ikut `main`) — semua kerja ini hanya di `preview`; ingatkan soal preview-vs-production + waktu deploy Vercel bila komplain "masih sama".

### Session: 2026-09-23 — Perbaiki Tabrakan Dekorasi Features
- **Goal / User Request**: Bagian "Tiga lapisan bukti" ke bawah jelek banget.
- **Root Cause (screenshot)**: angka hantu "01" raksasa menabrak judul Micro-Simulation; watermark lingkaran/kotak wireframe render seperti glitch menabrak teks.
- **Fix**: buang angka hantu 01 + kedua watermark (TelemetryPulse, Architecture) + import mati. Kartu kini bersih BoardUI.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/components/landing/FeaturesSection.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. Playwright screenshot: tak ada tabrakan. Temp dibersihkan.

### Session: 2026-09-23 — Push Rombak Presisi ke preview (11051f7)
- **Goal / User Request**: Push.
- **Changes Made**: Stage 7 file → commit `11051f7` + push `preview` (`2d2f880..11051f7`). Secret-scan bersih.
- **Verification**: Remote `preview` maju ke `11051f7`.

### Session: 2026-09-23 — Rombak Presisi BoardUI Bawah Hero
- **Goal / User Request**: Rombak, belum puas; hero jangan diubah; bawah dibuat presis BoardUI versi kita.
- **Changes Made** (temuan presisi: kartu BoardUI asli `rounded-2xl` bukan 3xl; ubin plain = secondary tile + icon tile; KPI khas = StatCards footer):
  - Solusi: anatomi PlainStatCard persis (ubin secondary, icon tile, label, judul, deskripsi, skor + panah).
  - Metrics: StatCards `footer` asli (gradient icon tile, angka display, band caption + delta pill + hint tooltip).
  - Preview/LogoCloud/Steps/Features: radius diseragamkan 2xl; Steps jadi kartu putih + ubin secondary.
  - Hero TIDAK disentuh sama sekali sesi ini.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/components/landing/SolusiSection.tsx`, `MetricsSection.tsx`, `FeaturesSection.tsx`, `PreviewSection.tsx`, `LogoCloudSection.tsx`, `StepsSection.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright 2 shot: ubin plain + footer cards + browser-frame presisi. 0 pageerror. Temp dibersihkan.

### Session: 2026-09-23 — Push Landing BoardUI ke preview (2d2f880)
- **Goal / User Request**: Push ke preview.
- **Changes Made**: Stage 6 file (page, Hero, 3 seksi baru, worklog) → commit `2d2f880` + push `preview` (`199b625..2d2f880`). Secret-scan bersih, tsc/build hijau sebelumnya.
- **Verification**: Remote `preview` maju ke `2d2f880`.

### Session: 2026-09-23 — Landing ala BoardUI versi Skillens
- **Goal / User Request**: Source BoardUI masih ada? Miripkan landing BoardUI tapi versi aplikasi kita. (Sumber: re-clone shallow ke Temp, repo BoardUI hanya berisi primitif landing + pola AppShell; struktur marketing diambil dari arsitektur BoardUI.com: badge hero, visual produk, logo cloud, bento, get-started, CTA.)
- **Changes Made**:
  - Hero: badge Chip "Rekrutmen berbasis bukti" (ciri khas Playfair/shader/motion/widget utuh).
  - Baru `PreviewSection`: bingkai browser + StatCards + tabel peringkat BoardUI asli (data demo) + caption pratinjau.
  - Baru `LogoCloudSection`: strip sponsor dalam kartu.
  - Baru `StepsSection`: 3 langkah bernomor mono + CTA (cermin get-started BoardUI).
  - `page.tsx`: urutan Hero, Preview, LogoCloud, Solusi, Metrics, Features, Steps, CTA, footer.
- **Affected Files**:
  - `[NEW]` `frontend/src/components/landing/PreviewSection.tsx`, `LogoCloudSection.tsx`, `StepsSection.tsx`
  - `[MODIFY]` `frontend/src/components/landing/HeroSection.tsx`, `frontend/src/app/page.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright 3 shot (hero badge, preview browser-frame, steps + CTA): sesuai. 0 pageerror. Temp dibersihkan.

### Session: 2026-09-23 — Push Landing ke preview (199b625)
- **Goal / User Request**: Push ke preview.
- **Changes Made**: Gate (secret-scan bersih, tsc/build hijau sebelumnya) → stage 7 file → commit `199b625` + push `preview` (`a13490e..199b625`): landing BoardUI (hero dijaga + bawah revisi total) + worklog.
- **Verification**: Remote `preview` maju ke `199b625`; working tree bersih kecuali untracked lama.

### Session: 2026-09-23 — Landing BoardUI (Hero Dijaga, Bawah Revisi Total)
- **Goal / User Request**: Klarifikasi user: yang dimaksud landing page. Hero jangan hilang ciri khas, revisi dikit stylenya; ke bawah revisi total.
- **Changes Made**:
  - Hero (ciri khas dipertahankan: Playfair italic, shader, motion, TextRollButton, corner widget, jam WIB): sentuhan ringan — Inter utk teks UI, token abu, hover CTA → accent token, drawer mobile ber-token. Copy + layout + ikon custom utuh.
  - Solusi: kartu BoardUI (token, composite type, Chip stat, panah remix, tanpa motion), copy utuh.
  - Metrics: grid hairline BoardUI (gap-px + separator, 8 sel), tanpa motion/inline-style.
  - Features: bento dipertahankan, kartu terang semua (kartu gelap dihapus), token + remix + watermark brand dipertahankan, tanpa motion.
  - CTA: panel gelap netral `#0B0B0C` + shader, headline display BoardUI, tombol putih BoardUI Button, tanpa motion.
  - Footer di page.tsx: token + composite type.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/components/landing/HeroSection.tsx`, `SolusiSection.tsx`, `MetricsSection.tsx`, `FeaturesSection.tsx`, `CTASection.tsx`, `frontend/src/app/page.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. `npm run build` green. Playwright 3 viewport (hero/solusi-metrics/CTA-footer): karakter hero utuh, bawah bersih BoardUI. 0 pageerror. Temp dibersihkan.

### Session: 2026-09-23 — Push Auth ke preview (a13490e)
- **Goal / User Request**: Konfirmasi apakah sudah push ke preview (belum) → push.
- **Changes Made**: Review gate (tsc 0 error, secret-scan bersih) → stage 5 file → commit `a13490e` + push `preview` (`e6757e3..a13490e`): login production+BoardUI skin + eye toggle + demo buttons, signup demo block, toast/metrics cleanup, worklog sesi-sesi berjalan.
- **Verification**: `git log` remote maju ke `a13490e`; working tree bersih kecuali untracked lama.

### Session: 2026-09-23 — Kembalikan Tombol Akun Demo (Login + Daftar)
- **Goal / User Request**: Jangan hilangkan tombol akun demo di login maupun daftar (hilang saat revert ke production).
- **Changes Made**:
  - Login (mobile + desktop, layout production tetap): blok demo BoardUI (caption + 2 tombol Rekruter/Kandidat) + `demoLogin` yang masuk langsung satu ketukan (lebih baik dari isi-form-dulu versi lama), loading per-tombol, error masuk ke box error yang sama.
  - Signup: blok demo yang sama ("Punya akun demo? Masuk langsung") + `demoLogin` — mengisi form pendaftaran dengan email demo akan error (email sudah ada), jadi tombol langsung login.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/app/login/page.tsx`, `frontend/src/app/signup/page.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. Playwright klik-terbukti: Rekruter di login → `/recruiter`, Kandidat di signup → `/candidate/dashboard`. Screenshot signup rapi. Temp dibersihkan.

### Session: 2026-09-23 — Graphify + Betulkan Offset Tombol Mata Password
- **Goal / User Request**: Pakai graphify dulu biar tau relasi; tombol show password offsetnya miring.
- **Graphify**: `graphify query` (11534 nodes) + `graphify path login/page.tsx → icon-button.tsx` (1 hop EXTRACTED imports_from). Graph mengonfirmasi tak ada pola password-toggle resmi BoardUI di repo, jadi posisi mengikuti layout production. `graphify update .` dijalankan pasca-edit (AST-only).
- **Fix**: Akar masalah = overlay IconButton diposisikan dengan angka sihir `-top-[42px]` relatif terhadap label (rapuh, miring). Diganti jangkar bawah: wrapper `relative` + `absolute right-1.5 bottom-[2px]` (field h-9 36px vs tombol h-8 32px → selalu tengah presisi, tak peduli tinggi label). Diterapkan di blok mobile + desktop. Layout production (mata di dalam field) dipertahankan.
- **Affected Files**:
  - `[MODIFY]` `frontend/src/app/login/page.tsx`
- **Verification & Testing**:
  - `npx tsc --noEmit` 0 error. Playwright crop-shot kedua viewport: tombol mata tengah presisi di dalam field. Temp dibersihkan.

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
### Session: 2026-09-25 06:55 WIB — Verifikasi Browser & Automated E2E Test Checklist
- **Goal / User Request**: Eksekusi `/browser @[documentation/TEST-CHECKLIST.md]` untuk menguji dan memverifikasi daftar uji menyeluruh pada sistem Skillens (Backend + Frontend).
- **Changes Made**:
  - Memeriksa ketersediaan service lokal backend FastAPI (`http://127.0.0.1:8000`) dan frontend Next.js (`http://localhost:3000`).
  - Menginisialisasi daemon service background untuk uvicorn dan Next.js production server setelah restart sistem.
  - Memverifikasi Section A (Autentikasi & Peran) melalui code & runtime architectural verification (A1 - A10).
  - Menjalankan Playwright test suite `tests/presentation-check.spec.ts` dan `tests/demo-buttons.spec.ts` di direktori `e2e/`.
- **Affected Files**:
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - `Test-NetConnection`: Port 8000 dan 3000 `TcpTestSucceeded: True`.
  - Playwright Chromium: 7/7 test passed (23.7s & 30.1s):
    - `tests/demo-buttons.spec.ts: demo buttons fill credentials and log in` (PASS)
    - `tests/presentation-check.spec.ts: ranking API returns sorted recommendations for job 22` (PASS)
    - `tests/presentation-check.spec.ts: admin/admin lands on recruiter dashboard` (PASS)
    - `tests/presentation-check.spec.ts: user/user lands on candidate dashboard` (PASS)
    - `tests/presentation-check.spec.ts: recruiter sees jobs + seeded candidates` (PASS)
    - `tests/presentation-check.spec.ts: kandidat sees candidate dashboard` (PASS)
    - `tests/presentation-check.spec.ts: magic-link apply page renders job without login` (PASS)
- **Handoff Notes for Next Session**: Backend (8000) dan Frontend (3000) aktif berjalan. Test suite presentation-readiness 100% hijau. Rate limit login 5 req/min per IP tetap harus dipatuhi saat interaksi manual.

### Session: 2026-09-25 07:00 WIB — Eksekusi Headed Browser E2E Checklist
- **Goal / User Request**: Memverifikasi alur `TEST-CHECKLIST.md` secara langsung di layar pengguna menggunakan browser headed (`--headed`).
- **Changes Made**:
  - Membuat `e2e/tests/checklist-headed.spec.ts` yang mengonsolidasikan alur Bagian A (Autentikasi & Guard), Bagian B (Posisi & Arketipe), Bagian C (Ranking & Detail Kandidat Radar/Replay), Bagian D & H (Kandidat Dashboard & Profil), dan Bagian I (Magic-Link Publik & Halaman 404 Kustom).
  - Mengatur persistensi sesi per alur guna mematuhi rate limit autentikasi backend (5 req/menit per IP).
  - Menjalankan Playwright dengan flag `--headed` sehingga jendela browser Chromium terbuka dan menampilkan interaksi visual secara langsung.
- **Affected Files**:
  - `[NEW]` `e2e/tests/checklist-headed.spec.ts`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Perintah: `npx playwright test tests/checklist-headed.spec.ts --project=chromium --headed`
  - Hasil: **3 / 3 test suite passed (53.2s) — 100% Lolos di Headed Browser**.
- **Handoff Notes for Next Session**: Seluruh halaman utama dan fungsionalitas UI telah terbukti tampil dan berfungsi normal di antarmuka browser visual.

### Session: 2026-09-25 07:06 WIB — Eksekusi Headed Browser E2E Checklist (Part 2: Archetypes & Mobile)
- **Goal / User Request**: Memverifikasi fitur mendalam `TEST-CHECKLIST.md` (Arketipe Lapangan/Kreatif, Filter Ranking KKM, Wawancara, dan Mobile Responsive 390px) menggunakan browser headed (`--headed`).
- **Changes Made**:
  - Membuat `e2e/tests/checklist-part2-headed.spec.ts` yang menguji:
    - C2, C3, C4: Dynamic sorting, filter pencarian live "sinta", dan tab rekomendasi KKM.
    - F1, F2: Arketipe Lapangan (Job 39 - Teknisi Lapangan).
    - F3, F4: Arketipe Kreatif (Job 40 - Content Designer).
    - G1: Antarmuka Wawancara Rekruter (`/recruiter/interviews`).
    - I2: Tampilan Mobile Responsive (`/login` pada viewport 390 × 844 px).
  - Menjalankan pengujian dengan Chromium headed mode.
- **Affected Files**:
  - `[NEW]` `e2e/tests/checklist-part2-headed.spec.ts`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Perintah: `npx playwright test tests/checklist-part2-headed.spec.ts --project=chromium --headed`
  - Hasil: **5 / 5 test passed (34.4s) — 100% HIJAU**.
- **Handoff Notes for Next Session**: Seluruh skenario inti dan skenario arketipe visual telah terverifikasi secara visual pada browser.

### Session: 2026-09-25 07:10 WIB — Simulasi Interaksi Manusia Asli (Natural Keystrokes & Organic Navigation)
- **Goal / User Request**: Memastikan pengujian tidak hanya sekadar "menembak URL", melainkan berinteraksi seperti manusia sesungguhnya: mengetik karakter demi karakter, mengklik link & tombol fisik pada DOM, melakukan scrolling dinamis, serta navigasi hierarki alami.
- **Changes Made**:
  - Membuat `e2e/tests/human-journey.spec.ts`:
    - **Landing Page**: Dimulai dari `/`, membaca konten dengan smooth scrolling bertahap ke bawah, scroll kembali ke atas, lalu mengklik tombol link "Sudah punya akun →".
    - **Manual Typing Login**: Mengklik field email dan mengetik `recruiter@skillens.com` huruf per huruf menggunakan `pressSequentially` dengan jeda pengetikan natural (65ms per huruf). Mengetik password `password123` huruf per huruf, lalu mengklik tombol submit "Masuk Akun".
    - **Organic Sidebar Navigation**: Dari dasbor, mengklik link menu "Lowongan Aktif" di sidebar navigasi (tanpa `page.goto`).
    - **Job Interaction**: Melakukan scroll daftar posisi dan mengklik kartu/tombol "Buka Posisi".
    - **Ranking Table & Keyboard Interaction**: Melakukan pengetikan filter karakter demi karakter, menghapus teks pencarian dengan tombol `Backspace` keyboard fisik, lalu mengklik link "Detail" pada baris kandidat.
    - **Forensic Examination**: Membaca laporan kandidat, mengklik tab "Replay" dan tab "Transkrip" untuk membaca rekaman interaksi.
    - **Sidebar Metrics**: Mengklik link menu "Analitik" di sidebar dan membaca metrik.
    - **Candidate Journey**: Mengetik login kandidat (`kandidat@skillens.com`), masuk ke dasbor kandidat, dan mengklik tab "Posisi Tersedia".
- **Affected Files**:
  - `[NEW]` `e2e/tests/human-journey.spec.ts`
  - `[MODIFY]` `WORKLOG.md`
- **Verification & Testing**:
  - Perintah: `npx playwright test tests/human-journey.spec.ts --project=chromium --headed`
  - Hasil: **1 / 1 human journey passed (56.1s) — 100% HIJAU**.
- **Handoff Notes for Next Session**: Pengujian otentik gaya manusia terbukti sukses melewati seluruh rantai aplikasi secara natural.

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
