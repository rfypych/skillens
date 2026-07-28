# 🚀 Skillens AI Platform - Master Documentation & Case Study

> **Skillens AI Platform** — *Interactive Talent Assessment & Conversational AI Hiring System*  
> **Live Production Web App**: [https://skillens-app.vercel.app](https://skillens-app.vercel.app)  
> **Live Production Backend API**: [https://skillens-backend-production.up.railway.app](https://skillens-backend-production.up.railway.app)

---

## 📌 1. Ringkasan Eksekutif (Executive Summary)

**Skillens AI** adalah platform penilai bakat dan wawancara kerja berbasis kecerdasan buatan (*AI-Powered Interactive Assessment Platform*) yang dirancang untuk mentransformasi proses rekrutmen dari cara-cara lama yang kaku dan penuh bias menjadi pengalaman wawancara yang adaptif, obyektif, interaktif, dan terukur.

Menggunakan model bahasa raksasa mutakhir **Llama 3.3 70B** yang diakselerasi melalui infrastruktur **Groq Cloud API**, Skillens bertindak sebagai wawancara berbasis conversational AI yang mampu mengevaluasi kompetensi teknis, kemampuan pemecahan masalah (*problem-solving*), hingga soft-skill kandidat secara real-time.

---

## 💔 2. Latar Belakang & Masalah Yang Dipecahkan (Problem Statement)

Proses rekrutmen tradisional di berbagai industri saat ini menghadapi 3 tantangan besar:

### ❌ Masalah 1: Screening Resume Manual Yang Penuh Bias & Inefisien
* **Fakta**: Rekruter rata-rata menghabiskan 6–10 detik saja untuk membaca satu dokumen CV.
* **Akibat**: Banyak talent berkualitas terlewat hanya karena format CV kurang menarik (formatting bias), sementara resume yang penuh kata kunci palsu (*keyword stuffing*) justru lolos.
* **Beban Kerja**: Ketika 1 posisi dibuka dan diserbu 1.500+ lamaran, tim HR membutuhkan waktu berminggu-minggu hanya untuk menyaring kandidat awal.

### ❌ Masalah 2: Wawancara Konvensional Yang Kaku & Tidak Terstandarisasi
* **Fakta**: Pertanyaan wawancara manual sering bergantung pada mood pewawancara dan tidak konsisten antar kandidat.
* **Akibat**: Sulit membandingkan kandidat secara objektif. Penilaian cenderung berdasarkan kesan pertama (*halo effect*) ketimbang bukti kemampuan yang terukur.

### ❌ Masalah 3: Pengalaman Kandidat Yang Buruk (*Ghosting Syndrome*)
* **Fakta**: Lebih dari 75% pelamar kerja mengalami *ghosting* — tidak pernah menerima kabar atau ulasan umpan balik (*feedback*) dari perusahaan setelah melamar atau melakukan wawancara awal.
* **Akibat**: Merusak citra merek (*employer branding*) perusahaan di mata talenta profesional.

---

## 💡 3. Solusi Skillens AI (The Skillens Solution)

Skillens menghadirkan pendekatan **"Interactive Competency & Conversational Evaluation"**:

```
[ Pelamar Kerja / Kandidat ]
            │ (Upload CV / Apply Job)
            ▼
[ Interactive AI Interviewer ] ── (Llama 3.3 70B via Groq)
            │ (Tanya Jawab Adaptif Real-time)
            ▼
[ Automated Scoring & Analytics ] ── (Matching Score, KKM, Competency Breakdown)
            │
            ▼
[ Dashboard Rekruter & Ranking ] ── (Peringkat Otomatis & Rekomendasi Hiring)
```

1. **Conversational AI Interviewer Adaptif**: AI tidak sekadar memberikan kuis pilihan ganda kaku, melainkan mengajukan pertanyaan kontekstual yang beradaptasi dengan jawaban sebelumnya dari kandidat.
2. **Penilaian Obyektif Berbasis KKM & Kompetensi**: Setiap lowongan pekerjaan dilengkapi kriteria Kriteria Ketuntasan Minimal (KKM) dan indikator kompetensi khusus.
3. **Pemeringkatan Otomatis (*Instant Candidate Ranking*)**: Sistem secara otomatis mengkalkulasi *Match Percentage* dan skor keseluruhan kandidat begitu wawancara selesai.
4. **Umpan Balik Transparan Tanpa Ghosting**: Kandidat mendapatkan laporan evaluasi kekuatan & area pengembangan secara langsung.

---

## 🏢 4. Studi Kasus & Skenario Penggunaan (Use Cases)

### 📈 Studi Kasus 1: Rekrutmen Massal Program Management Trainee di PT Skillens Tech
* **Skenario**: Perusahaan membuka posisi *Junior Software Engineer* & *Management Trainee* dengan total 2.400 pelamar.
* **Sebelum Skillens**: Tim HR membutuhkan 3 minggu untuk menyaring CV dan melakukan phone-screening 200 kandidat.
* **Dengan Skillens**:
  1. Rekruter mendaftarkan posisi pekerjaan dan kriteria kompetensi di Skillens.
  2. Seluruh 2.400 pelamar langsung mengikuti sesi wawancara AI 15 menit.
  3. Dalam waktu kurang dari 2 jam setelah pendaftaran ditutup, dashboard rekruter telah menampilkan **Top 5% Kandidat Terbaik** berdasarkan skor KKM & analisis kompetensi teknis.
* **Hasil**: Efisiensi waktu rekrutmen meningkat **88%**, menghemat ratusan jam kerja tim HR.

---

### 🎓 Studi Kasus 2: Seleksi Kampus Merdeka & Magang Industri (Internship Acquisition)
* **Skenario**: Perusahaan teknologi ingin menyaring mahasiwa magang secara obyektif tanpa memandang asal universitas.
* **Solusi**: Wawancara AI Skillens menilai logika pemecahan masalah dan pemahaman dasar rekayasa perangkat lunak secara seragam.
* **Hasil**: Mengeliminasi bias nama kampus, memberikan kesempatan setara bagi kandidat berbakat dari seluruh wilayah Indonesia.

---

## 🏗️ 5. Arsitektur Sistem & Teknologi (System Architecture)

Skillens dibangun menggunakan arsitektur modern berkinerja tinggi (*High-Performance Modern Web Architecture*):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (NEXT.JS 16)                           │
│  - App Router (Turbopack)         - WebGL Shaders (shaders/react)      │
│  - TypeScript & Tailwind CSS      - Responsive Mobile Aesthetic        │
│  - Hosted on Vercel (https://skillens-app.vercel.app)                  │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ (REST API & OAuth2 Bearer Tokens)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FASTAPI PYTHON)                        │
│  - Python 3.11 + FastAPI          - SQLAlchemy ORM                     │
│  - Slowapi Rate Limiting          - JWT Auth & HTTP-Only Cookies       │
│  - Hosted on Railway (https://skillens-backend-production.up.railway.app)│
└────────────────────────────────────────────────────────────────────────┘
          │                                  │
          ▼                                  ▼
┌───────────────────────────┐      ┌─────────────────────────────────────┐
│  AI ENGINE (GROQ CLOUD)   │      │   DATABASE & CACHE                  │
│  - Model: Llama 3.3 70B   │      │   - Neon Cloud Serverless PostgreSQL│
│  - Sub-second Inference   │      │   - Upstash Cloud Redis             │
└───────────────────────────┘      └─────────────────────────────────────┘
```

### Stack Teknologi Utama:
* **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS, WebGL Shaders (`shaders/react`), Lucide Icons.
* **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic v2, Passlib/Bcrypt, PyJWT.
* **AI Engine**: Llama-3.3-70b-versatile via Groq Cloud API.
* **Database**: Neon Serverless PostgreSQL (Region Singapore `ap-southeast-1`).
* **Cache & Session**: Upstash Cloud Redis.
* **Deployment & CI/CD**: Vercel (Frontend) & Railway (Backend).

---

## 🔄 6. Alur Kerja Pengguna (User Workflows)

### 👔 Alur Kerja Rekruter (Recruiter Workflow):
1. **Login Ke Dashboard Rekruter**: Masuk menggunakan akun rekruter.
2. **Buat Lowongan Pekerjaan Baru**: Memasukkan Judul, Deskripsi, Skill Spesifik, Indikator Evaluasi, dan Standar KKM.
3. **Pantau Pelamar & Ranking**: Melihat peringkat otomatis kandidat berdasarkan hasil wawancara AI.
4. **Inspeksi Detail Penilaian**: Melihat transkrip lengkap wawancara AI, *skill breakdown*, dan laporan kecocokan kandidat.

### 👨‍💻 Alur Kerja Kandidat (Candidate Workflow):
1. **Eksplorasi Lowongan & Apply**: Memilih lowongan di landing page dan mengunggah dokumen resume (PDF).
2. **Masuk Sesi Wawancara AI Interaktif**: Berinteraksi langsung dengan AI Interviewer dalam format percakapan interaktif.
3. **Menerima Umpan Balik**: Melihat hasil evaluasi, skor, dan status indikator kelulusan KKM secara transparan.

---

## 🏆 7. Keunggulan Kompetitif (Competitive Advantage & ROI)

| Fitur / Parameter | Rekrutmen Manual | Kuis Pilihan Ganda | **Skillens AI Platform** |
| :--- | :--- | :--- | :--- |
| **Waktu Pengolahan 1.000 CV** | 2-3 Minggu | 3-5 Hari | **< 1 Jam** |
| **Format Evaluasi** | Subyektif / Unstructured | Kaku / Mudah Dicontek | **Conversational AI Adaptif** |
| **Tingkat Bias** | Tinggi (Format CV, Halo Effect) | Sedang | **Sangat Rendah (Obyektif)** |
| **Pengalaman Kandidat** | Rentan Ghosting | Membosankan | **Interaktif, Real-time & WebGL** |
| **Analisis Kompetensi** | Terbatas | Hanya Skor Angka | **Breakdown Skill & Ulasan AI** |

---

## 🔑 8. Akses Demo & Kredensial Uji Coba (Demo Access)

Platform telah aktif 100% di lingkungan produksi dan dapat diuji coba menggunakan kredensial berikut:

* **URL Aplikasi Web**: [https://skillens-app.vercel.app](https://skillens-app.vercel.app)
* **URL Halaman Login**: [https://skillens-app.vercel.app/login](https://skillens-app.vercel.app/login)
* **Dokumentasi API Interactive**: [https://skillens-backend-production.up.railway.app/docs](https://skillens-backend-production.up.railway.app/docs)

### Kredensial Pengujian Akun:

#### 👔 Akun Rekruter (Recruiter Demo):
* **Email**: `recruiter@skillens.com`
* **Password**: `password123`
* **Role**: `recruiter`
* **Akses**: Membuat Job, Menentukan KKM, Melihat Peringkat & Transkrip AI.

#### 👨‍💻 Akun Kandidat (Candidate Demo):
* **Email**: `kandidat@skillens.com`
* **Password**: `password123`
* **Role**: `candidate`
* **Akses**: Upload PDF Resume, Mengikuti Wawancara AI Interaktif, Cek Hasil Evaluasi.

---

## 📄 9. Lisensi & Hak Cipta
© 2026 **Skillens AI Platform**. Hak Cipta Dilindungi Undang-Undang.
