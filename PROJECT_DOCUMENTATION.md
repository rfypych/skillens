# 🚀 Skillens AI Platform - Master Documentation & Specification

> **Skillens AI Platform** — *Evidence-Based Hiring, AI Micro-Simulation & End-to-End Recruitment Management System*  
> **Live Production Web App**: [https://skillens-app.vercel.app](https://skillens-app.vercel.app)  
> **Live Production Backend API**: [https://skillens-backend-production.up.railway.app](https://skillens-backend-production.up.railway.app)

---

## 📌 1. Ringkasan Eksekutif (Executive Summary)

**Skillens AI** adalah platform rekrutmen masa depan berbasis Artificial Intelligence (AI) yang menerapkan pendekatan **Evidence-Based Hiring**. Platform ini mengintegrasikan seluruh rantai seleksi talenta dalam satu sistem *End-to-End Management* — mulai dari pengunggahan resume & sertifikat, simulasi uji kompetensi interaktif (*AI Micro-Simulation*), validasi klaim CV (*Claim vs Evidence Matrix*), pemeringkatan anonim berdasar KKM, hingga penjadwalan wawancara pintar (*Smart Scheduling*).

Dengan memanfaatkan arsitektur LLM mutakhir **Llama 3.3 70B** di atas **Groq Cloud API** dan arsitektur database serverless **Neon PostgreSQL**, Skillens memangkas waktu administratif rekrutmen hingga **60%** dan memersingkat durasi seleksi yang semula berminggu-minggu menjadi hitungan jam dengan nol bias.

---

## 💔 2. Latar Belakang & Masalah Yang Dipecahkan (Background Problems)

Berdasarkan analisis kebutuhan industri (*Pak Slamet TKJ & Kebutuhan Lapangan*), proses rekrutmen konvensional menghadapi 4 akar masalah utama:

### 1. Skill Validation Gap (Ketidaksesuaian CV vs Kemampuan Nyata)
Banyak kandidat mencantumkan keahlian tinggi di CV, tetapi gagal saat dihadapkan pada tugas nyata di lapangan. Rekruter kesulitan memvalidasi klaim CV tanpa bukti performa yang objektif.

### 2. Proses Seleksi Manual Yang Lambat & Terfragmentasi
Penyaringan CV secara manual, pembuatan jadwal wawancara, dan evaluasi hasil tes tersebar di berbagai tools terpisah. Proses ini memakan waktu berminggu-minggu hingga bulan, membengkakkan biaya seleksi, dan menyebabkan risiko *bad hiring*.

### 3. Wawancara Konvensional Yang Subyektif & Tanpa Bukti
Wawancara manual sering kaku, dipengaruhi bias emosional pewawancara (*halo effect*), serta tidak didukung data kompetensi yang komprehensif.

### 4. Pengalaman Pelamar Yang Buruk & Fenomena Ghosting
Kandidat tidak mendapatkan informasi transparan mengenai status pendaftaran, batas waktu lowongan, atau peringkat hasil uji kompetensi mereka.

---

## 💡 3. Solusi & Inovasi Unggulan Skillens (Innovation Solutions)

Skillens menghadirkan solusi terintegrasi melalui fitur-fitur kunci berikut:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SKILLENS PLATFORM ARCHITECTURE                  │
├────────────────────────────────────────────────────────────────────────┤
│ 1. AI Micro-Simulation  : Uji kompetensi berbasis simulasi kerja nyata │
│ 2. Forensic Anti-Cheat   : Deteksi integritas & kecurangan real-time   │
│ 3. Claim vs Evidence     : Matriks validasi klaim CV vs bukti jawaban  │
│ 4. Hiring Risk Score     : Klasifikasi risiko kandidat secara objektif │
│ 5. Anonymous Ranking     : Pemeringkatan "Peringkat Anda: Rank X"      │
│ 6. Multi-Account Hierarchy: Akun Utama Perusahaan + Akses Anggota Tim  │
│ 7. Smart Scheduling      : Undangan wawancara otomatis (Jeda 1-2 Hari) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 4. Persyaratan Fungsional Detail (System Functional Requirements)

### 👔 A. Fitur & Alur Dashboard Rekruter (HRD / Perusahaan / PT)
1. **Real-time Candidate Update**: Papan pemantauan pelamar yang memperbarui data kandidat secara otomatis tanpa perlunya reload halaman.
2. **Multi-Account Company Hierarchy (Hierarki Akun Perusahaan)**:
   - Satu Perusahaan (PT) memiliki satu **Akun Utama (Master/Parent Account)**.
   - Akun Utama dapat membuat dan mengelola beberapa **Akun Anggota (Sub-Accounts / Team Members)**.
   - Akun Utama dapat menentukan hak akses (*Custom Permissions*) secara spesifik untuk masing-masing anggota tim.
3. **Manajemen Lowongan & Expiration Date**:
   - Menentukan batas waktu penutupan lowongan pekerjaan (*Job Expiration Limit*).
   - Menentukan kriteria penilaian, kriteria ketuntasan minimal (**KKM / Cutoff Score**), serta batas kuota kelulusan (contoh: *Rank 1–90 Lulus ke tahap selanjutnya, sisanya Gagal*).
4. **Smart Scheduling & AI Recommendation**:
   - AI memberikan rekomendasi kandidat terbaik yang lolos KKM sesuai kuota.
   - Rekruter menentukan jadwal wawancara, dan AI mengirimkan undangan resmi ke kandidat.
5. **Rekomendasi Pertanyaan Wawancara AI**:
   - AI merekomendasikan pertanyaan spesifik yang menggali *bagaimana proses kandidat menjawab tes dan menyelesaikan persoalan di dalam tes micro-simulation*.
6. **Input Poin Pemeringkatan Akhir (Post-Interview Scoring)**:
   - Setelah wawancara selesai, HRD memberikan nilai tambahan untuk menentukan pemeringkatan akhir kandidat.

---

### 👨‍💻 B. Fitur & Alur Pelamar (Kandidat)
1. **Unggah Data Pribadi & Berkas**: Pelamar mengunggah data diri, CV (Resume PDF), serta Sertifikat pendukung.
2. **Notifikasi Tes AI Micro-Simulation**: Pelamar mendapatkan notifikasi instan untuk mengikuti sesi tes / wawancara AI.
3. **Hasil Penilaian & Pemeringkatan Anonim**:
   - Pelamar dapat melihat status kelulusan KKM (*Diterima / Ditolak*).
   - Fitur **Pemeringkatan Anonim**: Pelamar hanya dapat melihat peringkatnya sendiri (contoh: *"Peringkat Anda: Rank 3 dari 150 pelamar"*), tanpa bisa melihat nama atau data pelamar lain demi menjaga privasi.
4. **Respon Jadwal Wawancara (Terima / Tolak Sesi)**:
   - Apabila kandidat dinyatakan lulus KKM dan masuk kuota wawancara, kandidat akan menerima undangan wawancara dengan jeda waktu undangan **minimal 1–2 hari** sebelum sesi dimulai.
   - Kandidat berhak memilih **(Terima / Tolak Sesi Wawancara)** melalui portal kandidat.

---

## 🏢 5. Studi Kasus & Impact Matrix (Case Studies & Business ROI)

### 📈 Studi Kasus 1: PT Skillens Tech - Rekrutmen Frontend Engineer
- **Kebutuhan**: Menyaring 150 pelamar posisi *Senior Frontend Engineer* dalam batas waktu lowongan 7 hari dengan target KKM 80.0 dan kuota 10 orang teratas.
- **Implementasi Skillens**:
  1. 150 kandidat mengunggah CV & sertifikat, lalu mengikuti tes AI Micro-Simulation.
  2. Sistem melakukan *Claim vs Evidence Matrix* untuk memverifikasi klaim React/TypeScript di CV dengan jawaban tes nyata.
  3. Sistem menerbitkan peringkat anonim (*Rank 1 - 150*).
  4. Top 10 Kandidat (Rank 1–10) secara otomatis menerima undangan wawancara HRD dengan jeda 2 hari.
- **Dampak Bisnis**:
  - Waktu administrasi terpotong **65%**.
  - Durasi seleksi singkat dari **14 hari menjadi 4 jam**.
  - Risiko *bad hiring* berkurang hingga **90%**.

---

## 🏗️ 6. Arsitektur Teknis & Database Cloud

- **Frontend (Vercel)**: Next.js 16 (Turbopack), TypeScript, Tailwind CSS, WebGL Ambient Mesh Shaders (`ShaderBackground.tsx` dengan SVG Radial Fallback untuk Redmi Note 9 / Mali GPUs).  
  👉 Domain Utama: **[https://skillens-app.vercel.app](https://skillens-app.vercel.app)**
- **Backend API (Railway)**: Python FastAPI, SQLAlchemy, OAuth2 JWT, Slowapi Rate Limiting.  
  👉 Domain API: **[https://skillens-backend-production.up.railway.app](https://skillens-backend-production.up.railway.app)**
- **AI Machine Learning Engine**: Llama 3.3 70B Versatile via Groq Cloud API.
- **Database Serverless**: Neon Cloud PostgreSQL (`ap-southeast-1` Singapore).
- **In-Memory Cache**: Upstash Cloud Redis.

---

## 🔑 7. Kredensial Uji Coba Produksi (Production Demo Credentials)

Gunakan kredensial resmi di bawah ini untuk menguji seluruh alur kerja di **[https://skillens-app.vercel.app/login](https://skillens-app.vercel.app/login)**:

| Peran (Role) | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| 👔 **Rekruter (HRD)** | `recruiter@skillens.com` | `password123` | Buat Job, Atur KKM, Unduh Ranking, Akses Akun Utama Perusahaan |
| 👨‍💻 **Kandidat** | `kandidat@skillens.com` | `password123` | Upload CV & Sertifikat, Tes AI, Cek Rank Anonim, Terima/Tolak Wawancara |

---

## 📄 8. Lisensi & Hak Cipta
© 2026 **Skillens AI Platform**. Hak Cipta Dilindungi Undang-Undang.
