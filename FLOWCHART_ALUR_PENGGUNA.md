# Flowchart Alur Pengguna Skillens — Evidence-Based Hiring

> Lampiran teknis `INOVASI_SKILLENS.md` (v1.8).

---

## Diagram 1 — Aktor & Titik Masuk (High-level)

```mermaid
flowchart TD
    R["Recruiter"] -->|"login / register"| RB["Dasbor Recruiter"]
    R -->|"1 klik"| DEMO["POST /seed/demo<br/>1 job + 5 kandidat ternilai"]

    K["Kandidat"] -->|"buka link posisi / magic link"| APPLY["Halaman Apply"]
    APPLY --> INST["Petunjuk + Consent Telemetry"]
    INST --> TEST["Assessment AI (chat multi-turn)"]
    TEST --> SUB["Submit"]
    SUB -->|"ack < 1 detik"| DONE["Halaman Selesai"]
    SUB -.->|"asinkron"| EVAL["Backend: evaluasi LLM + telemetry + fingerprint"]

    EVAL -->|"refresh / lihat"| RB
    RB -->|"review"| CAN["Detail Kandidat"]
```

---

## Diagram 2 — Alur Recruiter (Detail)

```mermaid
flowchart TD
    A["Login / register"] --> B["Dasbor /recruiter"]
    B --> C["Buat posisi<br/>(title, deskripsi, expected outcomes, skills, lokasi, deadline)"]
    C -.-> D["JD Debiasing Check<br/>bias score + saran kalimat inklusif"]
    C --> E["Atur assessment<br/>scenario prompt + trap word tersembunyi<br/>turn & durasi per-job"]
    E --> F["Publikasikan posisi"]
    F --> G["Magic link / undangan ke kandidat"]
    G --> H["Kandidat apply + selesaikan assessment"]
    H --> I["Klik 'Muat Data Demo' (opsional demo)"]
    I --> I1["Seed idempotent: job 'Senior Product Engineer' + 5 kandidat"]
    H --> J["Refresh daftar kandidat"]
    J --> K{"Status evaluasi?"}
    K -->|"Pending"| K1["Tunggu evaluasi asinkron (puluhan detik)"]
    K -->|"Selesai"| L["Detail kandidat"]
    L --> L1["Skor 5 dimensi + overall"]
    L --> L2["Label integritas (5 label)"]
    L --> L3["Cognitive Fingerprint radar + overlay tim"]
    L --> L4["Behavior Replay: timeline keystroke"]
    L --> L5["Analisis CV (OCR scan) + pertanyaan interview lanjutan"]
    L --> M["Ranking kandidat per posisi"]
    M --> N["Jadwalkan interview + skor manual"]
    N --> O["Metrics: performa recruiter"]
```

---

## Diagram 3 — Alur Kandidat (Top-Funnel, Detail)

```mermaid
flowchart TD
    A["Buka link posisi"] --> B{"Sudah login?"}
    B -->|"Ya"| B1["Auto-fill nama/email + pakai CV tersimpan"]
    B -->|"Tidak"| B2["Isi nama + email + upload PDF (max 5MB)"]
    B1 --> C
    B2 --> C["Submit apply (POST /assessment/{job}/apply)"]
    C --> C0{"File upload valid?"}
    C0 -->|"bukan .pdf / >5MB"| C1["Error: 'Hanya PDF / file terlalu besar'"]
    C0 -->|"valid / tanpa upload (CV tersimpan)"| D["Ekstrak teks CV<br/>scan/gagal -> OCR RapidOCR + PyMuPDF"]
    D --> G["Buat/simpan akun + cookie token (30 mnt)"]
    G --> H["Halaman Petunjuk: aturan + consent pemantauan telemetry"]
    H --> I["Klik 'Mulai Tes' — timer 15 menit tak bisa dihentikan"]
    I --> J["Skenario prompt + chat AI interviewer"]
    J --> K["Telemetry aktif: keystroke, backspace, paste diblokir, tab-switch, replay"]
    K --> L{"Turn ke-4 / waktu habis?"}
    L -->|"belum"| J
    L -->|"ya"| M["Konfirmasi 'Kirim Jawaban'"]
    M --> N["Submit -> ack < 1 detik"]
    N --> O["Halaman 'Evaluasi Berhasil Dikirim'"]
    O --> P["Dasbor kandidat"]
    P -.-> Q["Personal Skill & Competency Report (radar)<br/>download untuk portofolio"]
```

---

## Diagram 4 — Pipeline Evaluasi Backend (Detail)

```mermaid
flowchart TD
    S1["POST /assessment/{id}/submit"] --> S2{"Sudah pernah submit?"}
    S2 -->|"Ya"| S2a["400: 'sudah dikirim'"]
    S2 -->|"Baru"| S3["Simpan AssessmentResult<br/>answer, tab_switches, copy_paste, time, keystroke_metrics, replay"]
    S3 --> S4["status aplikasi = evaluated"]
    S4 --> S5{"USE_CELERY?"}
    S5 -->|"Ya"| S6["Celery task evaluasi"]
    S5 -->|"Tidak"| S7["Daemon thread evaluasi (inline)"]
    S6 --> S8
    S7 --> S8["LLM evaluasi transcript + CV"]
    S8 --> S9{"Provider OK?"}
    S9 -->|"primary error"| S9a["Fallback Groq"]
    S9a --> S9b{"Groq OK?"}
    S9b -->|"ok"| S10
    S9b -->|"gagal"| S9c["Label = Error + feedback (tidak silent fail)"]
    S9 --> S10["5 skor dimensi + label + pertanyaan interview + feedback"]
    S10 --> S11["Telemetry override:"]
    S11 --> S12{"CPS >30 & chars>200 ATAU<br/>paste>0 & time<45s & chars>300"}
    S12 -->|"Ya"| S13["Label = Likely Fabricated<br/>5 skor dimensi di-cap = 10"]
    S12 -->|"Tidak"| S14["Pertahankan hasil LLM"]
    S13 --> S15["Hitung overall (30/25/20/15/10)"]
    S14 --> S15
    S15 --> S16["Fingerprint model: 6 dimensi + fallback heuristik"]
    S16 --> S17["Persist + commit DB"]
    S17 --> S18["Recruiter refresh -> hasil muncul"]
```

---

## Diagram 5 — Alur Demo Final (Muat Data Demo, 1 Klik)

```mermaid
flowchart TD
    A["Recruiter klik 'Muat Data Demo'"] --> B["POST /seed/demo (auth recruiter/admin)"]
    B --> C["get_or_create company / recruiter / job<br/>'Senior Product Engineer'"]
    C --> D["5 kandidat ternilai lengkap: label, fingerprint, CV, replay"]
    D --> E["Idempotent: klik ulang -> job sama, tidak duplikat"]
    E --> F["Toast sukses + redirect /recruiter/jobs/{job_id}"]
```

---

## Catatan untuk demo live (17 Okt)

1. **Skenario yang paling meyakinkan bukan recruiter, tapi kandidat**: buka magic link → apply → tes 4 turn → submit → muncul di dashboard recruiter. Ini belum disiapkan sebagai skenario demo.
2. **Jangan demo fitur yang belum diimplementasi** — juri bisa minta "tunjukkan sekarang".
3. Data demo idempotent: tombol bisa diklik berkali-kali tanpa menggandakan data — aman untuk demo berulang.