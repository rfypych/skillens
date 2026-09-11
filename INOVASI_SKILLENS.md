---
title: 'Skillens — Evidence-Based Hiring'
subtitle: 'Inovasi Digital Business Challenge — Tema Karir (POV Recruiter)'
version: '1.8'
competition: 'JHIC 2.0 — Business Plan Competition'
theme: 'Karir (POV Recruiter)'
team_roles: 'Hacker·Hipster·Hustler'
category: 'Digital Business Challenge'
---

# Skillens — Evidence-Based Hiring

> **Evaluasi rekrutmen berbasis bukti nyata, bukan klaim resume.**
> Inovasi web app untuk JHIC 2.0 — Business Plan Competition, tema **Karir (POV Recruiter)**.

---

## 1. Ringkasan Eksekutif

**Skillens — Evidence-Based Hiring** adalah platform rekrutmen berbasis web yang menilai kandidat **berdasar bukti kinerja nyata**, bukan sekadar isi CV. Platform ini menggantikan screening CV tradisional (±1–2 menit baca per lamaran tanpa menguji apa pun) dengan **Micro-Interview AI interaktif** berdurasi **±15 menit** per kandidat; begitu jawaban dikirim, submit dibalas instan dan **skor, label integritas, serta rekomendasi diterbitkan secara asinkron** (umumnya beberapa puluh detik, tergantung kecepatan LLM) oleh pipeline evaluasi.

Berbeda dari ATS (Applicant Tracking System) yang hanya mencocokkan kata kunci, Skillens **menguji kompetensi kandidat secara real-time** dan **mendeteksi klaim palsu serta kecurangan** lewat analisis perilaku (keystroke forensics + AI-detection) — sistem **deteksi kecurangan otomatis untuk rekrutmen**.

| Ringkasan | Nilai |
|---|---|
| Nama inovasi | Skillens — Evidence-Based Hiring |
| Tema lomba | Karir (POV Recruiter) |
| Format | Web App responsif (mobile-friendly) |
| Durasi evaluasi per kandidat | ±15 menit (vs take-home test 1–4+ jam) |
| Respons setelah submit | Ack instan < 1 detik; skor & label terbit asinkron (umumnya beberapa puluh detik, tergantung LLM) |
| Pendekatan kunci | Evaluasi berbasis bukti + analisis perilaku anti-kecurangan + prediksi performa |

---

## 2. Permasalahan yang Diangkat (Problem Statement)

### 2.1 Resume mengklaim, tidak membuktikan

- Survei self-reported menunjukkan melebih-lebihkan resume adalah praktik umum, meski angkanya bervariasi antar sumber: ±70% kandidat mengaku memperkuat isi resume (ResumeLab 2020), dan dari sisi employer ±53–58% HR pernah menemukan kebohongan di resume (SHRM/CareerBuilder). Angka pastinya tidak dapat dipastikan karena berbasis pengakuan diri — tetapi arahnya konsisten: **ini norma, bukan pengecualian**.
- Akibatnya perusahaan menghabiskan waktu screening untuk CV yang tidak mencerminkan kemampuan sebenarnya.

Biaya salah rekrut pun bervariasi menurut sumber: estimasi yang sering dikutip berkisar **±30% pendapatan tahun pertama** untuk posisi entry-level (U.S. DOL) hingga **1,5–3× gaji tahunan** untuk posisi profesional/senior. Terlepas angka mana yang dipakai, kesimpulannya sama: keputusan rekrutmen yang salah mahal.

### 2.2 ATS tradisional tidak membaca kinerja

- Sebagian besar ATS hanya *keyword matching* → resume yang pandai menulis kata kunci lolos, kandidat yang benar-benar kompeten bisa terbuang.
- Tidak ada alat praktis untuk **menguji jawaban** sebelum interview final, apalagi **mendeteksi** jawaban yang disusun di luar skala manusiawi (copy-paste supercepat, jawaban AI murni).

### 2.3 Siapa yang merasakan

| Perspektif | Dampak |
|---|---|
| Recruiter (HR) | Tidak meninjau ribuan CV; membaca skor + rekomendasi AI final. |
| Kandidat jujur & talenta terpendam | Dapat diakui berbasis bukti, bukan gelar/latar belakang. |
| Perusahaan | Pada lowongan volume tinggi (ribuan pelamar), screening manual memakan puluhan jam per siklus; Skillens menggeser waktu manusia dari membaca CV ke meninjau hasil asesmen. Besar penghematan bergantung volume lamaran. |

---

## 3. Inovasi Inti — Three Layers of Evidence

> **"Gantikan CV yang mengklaim dengan bukti yang terbukti."**

Skillens dibangun dari **3 lapisan inovasi** yang saling mengunci:

### 3.1 Lapisan 1 — Micro-Simulation Assessment

Kandidat menghadapi **studi kasus nyata** sesuai posisi (flash sale, arsitektur sistem, penanganan crash, dst). AI mewawancarai **interaktif dan multi-putaran** (bukan sekali jawab), lalu menyusun skor per **5 dimensi**:

| Dimensi | Fokus |
|---|---|
| Pemahaman Masalah | Kedalaman identifikasi akar masalah |
| Pendekatan Solusi | Strategi, arsitektur, trade-off |
| Eksekusi Logis | Kebenaran dan urutan khas logika |
| Komunikasi | Kejelasan penjelasan yang terstruktur |
| Kualitas Respons | Relevansi terhadap studi kasus |

**Insentif kandidat (dual-sided value)** *(konsep)*: setiap kandidat yang menyelesaikan sesi otomatis menerima **Personal Skill & Competency Report** (radar chart 5 dimensi + label integritas) yang bisa diunduh untuk portofolio pribadi — memberi *value* langsung bagi kandidat dan menekan *drop-off rate* di top-funnel.

**JD Debiasing Check** *(konsep)* (saat recruiter membuat lowongan): AI menganalisis bahasa deskripsi pekerjaan → **bias score** (gender/usia/inklusivitas) + saran kalimat yang lebih netral — mendukung kepatuhan (*compliance*) dan kualitas keberagaman (*diversity*) pelamar, di sisi recruiter.

### 3.2 Lapisan 2 — Telemetry & AI Anti-Kecurangan

Keystroke dikumpulkan saat kandidat mengerjakan dan dianalisis **secara forensik**:

- **Keystroke Pattern**: kecepatan ketik, backspace ratio, silence ratio, total karakter → profil natural typing fingerprint.
- **Deteksi skew**: perilaku tidak manusiawi (kecepatan supertinggi, copy-paste tak wajar, perpindahan tab) diklasifikasi model ML.
- **Deteksi jawaban AI-copy / teks di-paste**: heuristik + model.

> **Penanganan perangkat mobile**: telemetry memakai event keyboard & clipboard standar browser (`keydown`/`paste`) sehingga berjalan di desktop maupun virtual keyboard ponsel/tablet. Label `Likely Fabricated` hanya dipicu ambang **>30 karakter/detik (≈360 WPM)** — kecepatan yang mustahil dicapai keyboard fisik maupun virtual (swipe/autocorrect justru lebih lambat), sehingga risiko *false positive* di mobile lebih rendah. (Roadmap) kalibrasi WPM terpisah per-perangkat via user-agent.

Hasilnya salah satu dari **5 label integritas** yang transparan bagi HR:

| Label | Arti |
|---|---|
| **Highly Validated** | Jawaban & telemetry konsisten — sangat direkomendasikan. |
| **Hidden Gem** | Talenta non-tradisional dengan potensi besar. |
| **Solid Match** | Kompetensi cocok tanpa indikasi khusus. |
| **Mismatch** | Klaim CV tidak sesuai performa aktual. |
| **Likely Fabricated** | Terindikasi kecurangan / kecepatan tidak manusiawi. |

### 3.3 Lapisan 3 — Talent Intelligence (Predictive Hiring)

- **Cognitive Fingerprint**: profil multi-dimensi kandidat (kelengkapan & kedalaman skill) dari fitur + jawaban.
- **Prediksi Performa Lanjutan**: memperkirakan skor bila wawancara diperdalam → probabilitas keberhasilan.
- **Comparative Ranking**: membandingkan kandidat berdasar potensi jangka panjang (prediksi risiko resign dini / *premature turnover* digabungkan ke *Tenure Probability* di roadmap).
- **CV Cognitive Analysis**: ekstraksi PDF (termasuk hasil pindai lewat OCR) lalu analisis klaim vs bukti.
- **Behavior Replay**: transcript + keystroke timeline per pertanyaan untuk audit.
- **Komposisi Tim (Team Fit)**: pemetaan kekuatan tim dari anggota yang telah direkrut.
- *(Roadmap)* **Tenure Probability Score**: probabilitas kandidat bertahan ≥12 bulan — butuh data historis *successful hire*, dijadwalkan setelah data terkumpul.

---

## 4. Posisi Kompetitif (Gap Analysis)

| Aspek | ATS Tradisional | Skillens |
|---|---|---|
| Basis penilaian | Kata kunci resume | Bukti kinerja (assessment) |
| Deteksi CV palsu/AI | Tidak ada | Keystroke forensics + AI-detection |
| Screening | 1–2 menit baca CV per lamaran | Otomatis ±15 menit asesmen/kandidat |
| Talenta terpendam | Terbuang | Terdeteksi (Hidden Gem) |
| Rekomendasi | Statis | AI + prediksi performa |
| Transparansi audit | Tidak ada | Replay history lengkap |

Perbandingan di atas disederhanakan; pemain assessment nyata juga harus diakui:

| Pemain | Fokus mereka | Posisi Skillens |
|---|---|---|
| **HireVue** | Video interview terstruktur + scoring, kelas enterprise global | Skillens text-based micro-interview + telemetry integritas, harga kelas UMKM |
| **Codility / HackerRank** | Uji skill teknis (coding) | Mereka fokus hard-skill teknis; Skillens menilai kompetensi lintas posisi + lapisan integritas perilaku |
| **Karat** | Interview teknis sebagai layanan (interviewer manusia) | Biaya per kandidat tinggi & terjadwal; Skillens self-serve & asinkron |
| **Platform lokal (Glints, Kalibrr, dst.)** | Marketplace + ATS | Screening masih berbasis CV/keyword; tidak ada evaluasi bukti + telemetry |

> Kejujuran kompetitif: pemain di atas lebih matang di bagiannya masing-masing. Klaim Skillens bukan "lebih canggih dari semua", melainkan **kombinasi evaluasi bukti + integritas perilaku dalam satu paket browser-first dengan harga UMKM Indonesia** — kombinasi yang belum kami temukan di pasar lokal.

### 4.1 Inovasi utama

> **Sistem deteksi kecurangan untuk rekrutmen** — dari penelusuran kami, kami belum menemukan produk di Indonesia yang menilai bukti jawaban + integritas secara otomatis berbasis analisis perilaku, langsung berjalan di browser tanpa instalasi. Ini hasil desk research tim, bukan klaim pasar definitif.

### 4.2 Moat Teknis yang Dibangun Sendiri (bukan panggil LLM)

Nilai teknikal Skillens **tidak** terletak pada model LLM (yang memang API pihak ketiga), melainkan pada sistem **in-house**:

- **Keystroke Forensics & Telemetry Pipeline**: sinyal mentah (keydown, paste, tab-switch) → 13 fitur *feature engineering* → model **GradientBoosting (scikit-learn)** yang dilatih via pipeline sendiri + fallback heuristik deterministik.
- **Submit instan + evaluasi asinkron**: respons submit < 1 detik; daemon thread menjamin skor/label selalu terbit bahkan saat request HTTP diputus (durasi skoring bergantung kecepatan LLM).
- **OCR PDF terintegrasi**: resume scan (RapidOCR + PyMuPDF) dibaca dan dianalisis klaim vs bukti.
- **Behavior Replay & audit**: timeline keystroke per pertanyaan tersimpan penuh.

### 4.3 Posisi vs Tim AI/ML Kustom (Juri Teknis vs Juri Bisnis)

- **Tidak menjual "kecanggihan LLM"** — itu API pihak ketiga dan mudah diserang. Yang dijual: **sistem anti-cheat + telemetry + pipeline evaluasi** yang seluruhnya ditulis sendiri.
- **Juri teknis**: soroti kompleksitas keystroke forensics, feature engineering, dan pipeline evaluasi asinkron (submit instan, skor terbit andal) sebagai bukti *engineering* nyata.
- **Juri bisnis/HR**: soroti kelengkapan produk **end-to-end** (kandidat kerja → behavior replay → competency report → dashboard HR → jadwal interview) yang tanpa konfigurasi rumit — area yang umumnya lemah pada tim AI/ML murni. Di sisi inilah produktivitas Skillens menang di skor *product-market fit*.

---

## 5. Business Model

| Elemen | Pendekatan |
|---|---|
| **Target pasar** | HR/People Ops perusahaan UMKM-menengah, agensi rekrutmen, penyedia talent. |
| **Model bisnis** | SaaS langganan: Free (1 job aktif), Pro (≤5 job), Enterprise (unlimited + OCR + API). |
| **Value** | Menggeser waktu recruiter dari membaca CV ke meninjau hasil asesmen; keputusan rekrut berbasis data bukti. |
| **RoI pelanggan** | Hipotesis: waktu screening lebih singkat & risiko salah rekrut menurun — belum divalidasi dengan data lapangan. |

**Paket harga (estimasi, disesuaikan daya beli UMKM/Startup Indonesia)**:

| Paket | Harga/bulan | Cakupan |
|---|---|---|
| Free | Rp 0 | 1 job aktif, 10 evaluasi/bulan |
| Pro | Rp 299.000 | ≤5 job, evaluasi tanpa batas, OCR CV, label + fingerprint |
| Enterprise | Rp 999.000+ | Unlimited job, API, SSO, audit custom, SLA |

**Unit economics (basis asumsi)**:
- *LTV*: pelanggan Pro bertahan rata-rata 8 bulan → ≈ Rp 2,4 jt.
- *CAC*: fokus organic/SEO + demo → target < Rp 500 rb (payback < 2 bulan).
- *Gross margin*: biaya compute LLM < 1 sen USD/kandidat dan terkendali via *model routing* → margin SaaS ≥ 85%.
- *Bad hire* yang dicegah bernilai signifikan (lihat estimasi biaya §2.1) — dasar *pricing* berbasis ROI pelanggan.

**Ukuran pasar (pendekatan bottom-up, bukan riset pasar)**:

Kami tidak mengutip angka TAM yang tidak dapat kami verifikasi sumbernya. Estimasi dibangun dari asumsi yang bisa diuji:

| Lapis | Asumsi |
|---|---|
| Target awal (SAM) | UMKM-menengah & agensi rekrutmen Indonesia yang rutin merekrut; jumlah pastinya harus divalidasi |
| Skenario konservatif | 1.000 pelanggan berbayar × Rp 299 rb/bulan ≈ Rp 3,6 M ARR |
| Target tahun pertama (SOM) | 20–50 pelanggan berbayar → ≈ Rp 72–180 jt ARR |

**Status validasi (jujur)**:

- Produk berupa **prototype fungsional end-to-end** dengan data demo (uji E2E 26 PASS); **belum ada pelanggan berbayar maupun pilot eksternal**.
- Validasi permintaan saat ini sebatas hipotesis masalah + penggunaan demo.
- Langkah berikutnya sebelum komersialisasi: pilot dengan 3–5 design partner (UMKM/agensi) untuk menguji asumsi kesediaan membayar.

---

## 6. Responsivitas & Optimasi Teknis

**Stack**: Next.js 16 (App Router, SSR) — FastAPI (async) — PostgreSQL (Neon) — Redis (Upstash) — LLM (Groq `llama-3.3-70b-versatile`) — scikit-learn (model fingerprint) — OCR (RapidOCR + PyMuPDF).

| Metrik | Implementasi |
|---|---|
| Kecepatan render | Server-side rendering + payload kecil + cache Redis |
| Kapasitas | Backend async; menangani banyak koneksi concurrent; produksi online (Railway → Vercel proxy) |
| Skalabilitas | Stateless API + fail-safe job daemon (evaluasi asinkron) |
| Reliabilitas | `/health` check, retry & timeout, handler error global |

### 6.1 Hasil Uji Performa

| Kategori | Hasil |
|---|---|
| E2E test produksi (login → apply → evaluasi → rekomendasi) | **26 PASS / 0 gagal** |
| Submit evaluasi → respons | Ack **< 1 detik**; skor & label terbit asinkron (daemon thread), durasi bergantung kecepatan LLM |
| Model fingerprint | MAE ±2/100 **pada dataset training** — indikator awal; cross-validation variasi perangkat sedang dipersiapkan (roadmap); peran model advisory, bukan sinyal tunggal |
| OCR PDF scan | Teruji (dokumen scan terbaca) |
| Proxy/CORS | Allow-Origin sesuai origin, rewrite tersaring |

### 6.2 Ketahanan Provider LLM (Failover Berlapis)

- **Evaluasi final**: rantai fallback 2-provider — provider utama (OpenAI-compatible) → **Groq** → label `Error` + feedback (tidak pernah *silent fail*); evaluasi berjalan di daemon thread sehingga submit selalu balas instan.
- **Sesi chat**: jika provider gagal → pesan 503 ramah + retry otomatis, sesi tidak hang.
- (Roadmap) switch otomatis via *timeout* 5 detik + provider tambahan (OpenRouter/Ollama lokal) untuk ketahanan saat live demo & lonjakan trafik.

**Alur demo final (1 klik)**: recruiter login → klik **"Muat Data Demo"** → satu posisi + 5 kandidat ternilai lengkap (label, fingerprint, CV, replay) siap dipresentasikan dihadapan juri.

> **Catatan konfigurasi**: jumlah turn interview (saat ini 4) dan durasi (saat ini 15 menit) direncanakan dapat diatur per-lowongan oleh recruiter melalui panel (roadmap) — mengurangi gesekan kandidat untuk posisi tertentu.

---

## 7. Strategi Pemasaran & Kualitas Konten (SEO)

- **SEO terstruktur**: halaman landing ber-isi problem–solution, meta description, skema `Organization` + `SoftwareApplication` untuk rich result.
- **Konten edukatif**: artikel "bagaimana mendeteksi CV palsu" → *top-funnel* yang menarik khalayak HR.
- **Demo-juri**: akun demo recruiter siap + tombol **Muat Data Demo (1 klik)** di dashboard.
- **People Choice**: visualisasi hasil kandidat (skor + label + evidence) yang menarik untuk dibagikan.
- **Logo wajib** JHIC, Jagoan Hosting, Komdigi, Garuda Spark, Ngalup — pada webapp & deck final.

---

## 8. Roadmap

| Fase (per guideline) | Agenda |
|---|---|
| Registrasi & Pitch (≤ 30 Agt) | Dokumen inovasi ini, pitch deck |
| Preliminary (12 Sep) | Demo prototype: alur recruiter ↔ candidate |
| Bootcamp (21–24 Sep) | Re-deploy ke VPS Jagoan Hosting + tuning SEO |
| Finalisasi Web & PPT (1–12 Okt) | Fitur final, uji load, deck 10 halaman, konfigurasi turn/durasi per-job |
| Final Day (17 Okt) | Live demo + Q&A juri |

### 8.1 Roadmap Produk (Vision)

Fitur-fitur berikut **belum dibangun** dan disajikan sebagai arah pengembangan — bukan klaim yang sudah berjalan:

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| **Interview Co-Pilot Live** | Asisten real-time saat wawancara: transkrip live, pencocokan klaim vs CV, scoring berbasis rubrik, prompt pendalaman, debrief otomatis | 1 |
| **Remote Onboarding Readiness** | Menilai kesiapan kandidat remote + checklist setup & *buddy matching* untuk menekan resign 90 hari | 2 |
| **Tenure Probability Score** | Probabilitas bertahan ≥12 bulan — diaktifkan setelah data historis *successful hire* terkumpul | 2 |
| **Workload Intelligence** | Prediksi overload recruiter + redistribusi prioritas otomatis | 3 |
| **Hiring Team Collaboration Hub** | Ruang kerja bersama recruiter × hiring manager: debrief terstruktur, consensus engine, audit trail | 4 |

> Catatan: seluruh fitur di atas hanya diekspos sebagai **visi jangka panjang** dalam presentasi — menghindari risiko demo setengah jadi dan janji yang tidak bisa dibuktikan di Final Day. Urutan prioritas ditetapkan **pilot-driven** (dari feedback design partner §5), bukan komitmen penyerahan yang mengikat.

---

## 9. Risiko & Mitigasi (Celah Kritis)

### 9.1 Gesekan pada Kandidat (Candidate Drop-off Rate)

**Risiko**: talenta pasif/senior enggan mengikuti simulasi ±15 menit sebelum berbicara dengan manusia, sehingga hanya kandidat *entry-level* yang bertahan.

**Mitigasi**:
- Perbandingan yang benar: 15 menit vs **take-home assignment 1–4 jam** yang justru sudah ditolak talenta pasif — Skillens menang di kecepatan.
- Target awal: posisi *entry–mid & volume* di mana *structured assessment* sudah menjadi norma; talenta senior/pasif masuk lewat jalur **undangan (invite-only)** dengan motivasi tinggi.
- Assessment hanyalah **satu sinyal** keputusan, bukan gerbang tunggal — recruiter tetap bisa memprioritaskan kandidat lain.
- **Insentif langsung kandidat**: setiap penyelesai otomatis mendapat **Personal Skill & Competency Report** (radar chart + label) untuk portofolio pribadi — alasan nyata untuk bertahan sampai selesai.
- (Roadmap) Turn & durasi per-job dapat dikonfigurasi recruiter agar gesekan disesuaikan posisi.

### 9.2 Cacat Logika Keystroke Forensics (Bias Hardware & Aksesibilitas)

**Risiko**: kecepatan ketik, *backspace ratio*, dan *silence ratio* memunculkan *false positive* — tuduhan curang yang salah, termasuk diskriminasi terhadap disabilitas motorik/disleksia atau perbedaan keyboard.

**Mitigasi (fakta implementasi)**:
- Label `Likely Fabricated` hanya dipicu sinyal ekstrem: kecepatan ketik >30 karakter/detik (≈360 WPM — di atas kemampuan ketik manusia) atau paste yang terjadi dalam rentang waktu sangat singkat (<45 detik). Keduanya sinyal kuat, bukan variasi irama ketik normal.
- **Backspace ratio tidak dipakai untuk menuduh** — malah diberi bobot kecil positif (menandai kandidat yang rajin mengoreksi/mengedit = jujur).
- Label bersifat **advisory**: memicu verifikasi manusia + `Behavior Replay` (audit timeline keystroke), bukan penolakan otomatis.
- **Perangkat mobile**: telemetry memakai event browser standar (berfungsi di virtual keyboard); ambang >30 CPS mustahil dicapai baik keyboard fisik maupun mobile (swipe/autocorrect lebih lambat), sehingga risiko *false positive* mobile lebih rendah — (roadmap) kalibrasi per-perangkat via user-agent.
- Kesimpulan juri: "Kami tidak menuduh atas irama ketik — kami hanya menandai anomali mustahil + tanda AI di teks, dan **manusia yang memutuskan**."

### 9.3 Perlombaan Senjata Melawan AI (LLM di layar lain)

**Risiko**: kandidat mengetik ulang output AI secara manual (kecepatan natural, jeda buatan) sehingga telemetry terbaca manusiawi.

**Mitigasi**:
- Deteksi berlapis: *trap word* tersembunyi + AI hallmark di teks + anomali telemetry ekstrem.
- **Pertahanan sebenarnya**: AI interviewer melakukan *probing multi-turn* dan menilai **kedalaman/koherensi dialog** — juru ketik dari LLM lain tampak dangkal/inconsisten di turn 3–4.
- Label `Likely Fabricated` memicu **pertanyaan verifikasi otomatis** yang mengekspos titik lemah saat wawancara tatap muka.
- Posisi jujur: *decision support + anomaly detection*, bukan *polygraph*.
- **Batas kemampuan yang diakui**: ambang telemetry hanya menangkap kecurangan kasar (paste/kecepatan mustahil); pengetikan ulang output AI secara manual dapat lolos. Efektivitas probing multi-turn terhadap kecurangan jenis ini **belum diukur secara kuantitatif** — pengujian terkontrol (simulasi kandidat curang vs jujur) adalah item roadmap.

### 9.4 Skalabilitas Biaya vs Model Bisnis

**Risiko**: biaya API LLM membakar modal di model SaaS freemium untuk UMKM.

**Mitigasi (fakta implementasi)**:
- Biaya per kandidat sangat kecil: 4 turn chat × `max_tokens=150` + 1 call evaluasi × `max_tokens=500`, dengan fallback Groq (murah) — total di bawah 1 sen USD/kandidat.
- **Model routing**: model kecil untuk chat turn, model kuat hanya untuk evaluasi final; plus caching.
- Biaya compute **sebanding dengan volume kandidat ≈ tier pendapatan**; satu *bad hire* bisa bernilai hingga 1,5–3× gaji tahunan (estimasi §2.1), sedangkan biaya compute adalah *rounding error*.
- **Ketergantungan provider sudah dimitigasi**: evaluasi final punya rantai fallback 2-provider (primary → Groq → label `Error` yang eksplisit), chat memberi 503 ramah + retry — (roadmap) switch timeout 5 detik + OpenRouter/Ollama.

### 9.5 Narasi untuk QnA Juri (Akurasi `Likely Fabricated`)

> "Label itu adalah **sinyal untuk diverifikasi manusia, bukan tuduhan**. Sistem hanya menandai anomali yang mustahil secara fisika (>360 WPM) atau tanda AI di teks, dengan **bukti mentah tersimpan** (replay + timeline keystroke) yang bisa diaudit. Setiap label memicu pertanyaan verifikasi otomatis untuk wawancara lanjutan. Tanpa bukti ekstrem, kandidat tidak pernah di-label curang — jadi tidak ada diskriminasi hardware maupun disabilitas."

### 9.6 Dianggap "API Wrapper" oleh Juri Teknis

**Risiko**: juri berlatar teknis menilai Skillens sekadar memanggil API LLM pihak ketiga (Groq), dan menilai inovasi teknologi tim yang membangun model kustom lebih tinggi.

**Mitigasi**:
- **Reframe nilai teknis**: moat engineering ada di sistem in-house — keystroke forensics + fingerprint model (GradientBoosting), pipeline evaluasi asinkron (<1 detik), OCR, behavior replay — bukan di LLM API.
- **Jangan klaim "AI canggih"**: secara eksplisit menjelaskan peran LLM hanya sebagai *interviewer/evaluator*, sementara intelijen perilaku & pipeline adalah kode sendiri.
- **Tunjukkan arsitektur** saat presentasi: diagram telemetry → 13 fitur → model → label → rekomendasi.
- **Komposisi juri**: jika dominan teknis, tonjolkan kompleksitas anti-cheat & latency; jika dominan bisnis/HR, tonjolkan kelengkapan produk end-to-end yang siap pakai — area yang umumnya lemah pada tim model murni.

### 9.7 Kepatuhan Data Pribadi (UU PDP No. 27/2022)

**Risiko**: telemetry keystroke, transcript jawaban, dan CV adalah data pribadi (telemetry bahkan data perilaku). Pemrosesan tanpa dasar hukum melanggar UU PDP dan menghilangkan kepercayaan pelanggan.

**Status saat ini (jujur)**:
- **Sudah ada**: pernyataan persetujuan di halaman aturan tes — kandidat menyatakan bersedia pengerjaannya dipantau otomatis sebelum sesi dimulai.
- **Belum ada (gap yang harus ditutup sebelum pilot dengan kandidat nyata)**: kebijakan privasi komprehensif, ketentuan retensi data, mekanisme hak akses & penghapusan data oleh kandidat, serta notifikasi spesifik tujuan pemrosesan telemetry sesuai UU PDP.

**Mitigasi (roadmap compliance)**:
- Consent eksplisit & spesifik tujuan sebelum sesi.
- Retensi data terbatas (default 12 bulan, dapat dikonfigurasi) + penghapusan terjadwal.
- Hak kandidat: akses, koreksi, dan penghapusan data atas permintaan.
- Perjanjian pemrosesan data dengan penyedia pihak ketiga (database, cache, LLM); telemetry tidak dijual dan tidak digunakan di luar konteks rekrutmen.

### 9.8 Roadmap Terlalu Luas untuk Tim 3 Orang (Juri Bisnis)

**Risiko**: 5 fitur visi (§8.1) untuk tim 3 orang (Hacker–Hipster–Hustler) terlihat tidak fokus bagi juri bisnis.

**Mitigasi / jawaban Q&A**:
- Fokus 6 bulan pertama **hanya Core Assessment & Anti-Fraud** — satu-satunya yang dibutuhkan untuk jalur menuju 20–50 design partner B2B.
- Roadmap §8.1 bersifat **pilot-driven**, bukan komitmen: urutan prioritasnya ditentukan dari feedback design partner selama pilot, sehingga tidak ada janji penyerahan yang mengikat.
- Fitur visi diekspos hanya sebagai arah jangka panjang pasca-pendanaan, bukan syarat sebelum commercial launch.

### 9.9 Overfitting Model Fingerprint (Juri Data Science)

**Risiko**: MAE ±2/100 hanya diukur pada dataset training — juri data science dapat menuduh overfitting karena belum ada *out-of-sample test set*.

**Mitigasi / jawaban Q&A**:
- Diakui sebagai **indikator awal pada data internal**, bukan klaim akurasi general.
- (Roadmap) pengujian **cross-validation** dengan variasi keyboard/perangkat/populasi lebih luas sebelum model dipakai sebagai sinyal utama.
- Peran model tetap **advisory** dengan **fallback heuristik deterministik** — sistem tidak bergantung penuh pada prediksi ML, sehingga dampak model yang belum teruji penuh tetap terbatas.

---

## 10. Kesimpulan

Rekrutmen bukan hal baru, tetapi **menguji dan membuktikan klaim kandidat secara otomatis** adalah inovasi. Skillens mengubah evaluasi kandidat dari "membaca kertas" menjadi "menyaksikan bukti" — menghemat waktu HR, melindungi dari kecurangan, dan menemukan talenta tersembunyi. Inilah jawaban untuk tema **Karir (POV Recruiter)**.

> **"Skillens — Recruitment Runs on Evidence."**