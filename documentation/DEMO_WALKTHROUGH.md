# 🚀 Skillens AI Platform — Panduan Demo & Dokumentasi Alur Lengkap

Selamat datang di dokumentasi resmi dan panduan demo **Skillens Platform**. Dokumentasi ini menyajikan penjelasan komprehensif mengenai latar belakang produk, masalah industri perekrutan yang diselesaikan, hingga alur kerja lengkap (*end-to-end user workflow*) baik dari sudut pandang **Recruiter/HRD** maupun **Kandidat/Pelamar**.

---

## 📌 1. Pendahuluan & Masalah yang Dipecahkan

### 💡 Latar Belakang
Perekrutan talenta digital (khususnya bidang *software engineering*, *product*, dan *tech*) saat ini menghadapi krisis otentisitas akibat maraknya klaim berlebihan pada resume (CV inflation) dan penggunaan AI generatif secara tidak jujur untuk menjawab ujian pilihan ganda statis.

### 🛡️ Solusi Skillens
Skillens hadir sebagai **Platform Penilaian Bakat Berbasis AI & Simulasi Studi Kasus Real-Time** yang mengevaluasi kemampuan praktis kandidat melalui:
1. **AI Micro-Simulation**: Kandidat diuji melalui skenario studi kasus nyata industri (bukan hafalan/pilihan ganda).
2. **Sistem Anti-Cheat Proctored**: Pemantauan perpindahan tab (*tab switching*), pencegahan copy-paste, serta kata kunci rahasia (*Scooby-Doo Trap Words*) untuk mendeteksi penggunaan ChatGPT/LLM eksternal.
3. **Pemeringkatan Real-Time & KKM**: Pemeringkatan kandidat secara otomatis berdasarkan nilai kelulusan minimum (*Passing Grade / KKM*) yang ditentukan HRD.
4. **Wawancara Terjadwal & Evaluasi Poin**: AI merekomendasikan kandidat terbaik yang lulus KKM serta menyajikan draft pertanyaan wawancara spesifik berdasarkan kelemahan/kelebihan jawaban tes kandidat.

---

## 🔑 2. Kredensial Akun Demo

Untuk mencoba alur aplikasi secara langsung di [https://skillens-app.vercel.app](https://skillens-app.vercel.app), gunakan kredensial demo berikut:

| Peran (Role) | Email | Password | Akses Fitur Utama |
| :--- | :--- | :--- | :--- |
| **Recruiter / HRD** | `recruiter@skillens.com` | `password123` | Buat lowongan, atur KKM, preview perangkap anti-cheat, atur jadwal interview, beri poin evaluasi. |
| **Kandidat / Pelamar** | `kandidat@skillens.com` | `password123` | Lihat lowongan, kerjakan tes simulasi AI 15 menit, pantau status pendaftaran, respon undangan wawancara. |

---

## 📸 3. Alur Demo & Panduan Visual Step-by-Step

### Langkah 1: Halaman Utama (Landing Page)
- **URL**: `https://skillens-app.vercel.app/`
- **Fungsi**: Memperkenalkan platform Skillens dengan desain tajam *Sharp Minimalist / Editorial Aesthetic*, animasi *Shader Overlay*, serta sertifikasi keamanan ISO 27001.

---

### Langkah 2: Autentikasi & Login (`/login`)
- **URL**: `https://skillens-app.vercel.app/login`
- **Fungsi**: Portal masuk bersama untuk recruiter dan kandidat menggunakan kredensial JWT tersinkronisasi.

---

### Langkah 3: Pusat Komando Recruiter (`/recruiter`)
- **URL**: `https://skillens-app.vercel.app/recruiter`
- **Fungsi**: Ringkasan *Command Center* HRD yang menampilkan total evaluasi, kandidat tersembunyi (gems), dan jumlah kecurangan yang berhasil dicegah oleh AI.

---

### Langkah 4: Kelola Posisi Aktif (`/recruiter/jobs`)
- **URL**: `https://skillens-app.vercel.app/recruiter/jobs`
- **Fungsi**: Mengelola daftar lowongan terbuka. Setiap kartu lowongan dilengkapi **2 Tombol Aksi Utama**:
  1. **Salin Tautan**: Menyalin tautan sakti evaluasi AI untuk disebarkan ke pelamar.
  2. **Buka Posisi**: Masuk langsung ke ruang detail & leaderboard lowongan.

---

### Langkah 5: Formulir Pembukaan Lowongan Baru (`/recruiter/jobs/new`)
- **URL**: `https://skillens-app.vercel.app/recruiter/jobs/new`
- **Fungsi**: Memungkinkan recruiter membuat lowongan baru dengan menentukan judul, lokasi, rentang gaji, serta kriteria khusus posisi.

---

### Langkah 6: Detail Lowongan & Leaderboard Real-Time (`/recruiter/jobs/[id]` — Tab 1)
- **URL**: `https://skillens-app.vercel.app/recruiter/jobs/1`
- **Fungsi**: Menampilkan daftar seluruh pelamar yang diurutkan secara *real-time* berdasarkan skor total tes simulasi AI vs Nilai KKM. Dilengkapi badge indikator anti-cheat (*Clean* vs *Terdeteksi Pindah Tab*).

---

### Langkah 7: Rekomendasi AI & Wawancara (`/recruiter/jobs/[id]` — Tab 2)
- **URL**: `https://skillens-app.vercel.app/recruiter/jobs/1` (Tab 2)
- **Fungsi**: AI memfilter kandidat teratas yang lulus KKM dan merekomendasikan daftar pertanyaan wawancara spesifik. Recruiter dapat mengatur jadwal wawancara (dengan aturan jeda minimal 1-2 hari) serta memberikan poin pemeringkatan akhir.

---

### Langkah 8: Setup Simulasi AI & Nilai KKM (`/recruiter/jobs/[id]` — Tab 3)
- **URL**: `https://skillens-app.vercel.app/recruiter/jobs/1` (Tab 3)
- **Fungsi**: Recruiter menentukan **Nilai KKM (0-100)**, status pembukaan, deadline lowongan, serta mengedit skenario studi kasus Markdown. Menampilkan pula perangkap rahasia *Scooby-Doo Anti-Cheat Trap Word*.

---

### Langkah 9: Rincian & Metadata Lowongan (`/recruiter/jobs/[id]` — Tab 4)
- **URL**: `https://skillens-app.vercel.app/recruiter/jobs/1` (Tab 4)
- **Fungsi**: Mengedit metadata lowongan seperti expected outcomes, deskripsi pekerjaan, dan spesifikasi keahlian.

---

### Langkah 10: Pengajuan Lamaran & Upload CV Kandidat (`/candidate/apply/[job_id]`)
- **URL**: `https://skillens-app.vercel.app/candidate/apply/default-magic-token-1`
- **Fungsi**: Pelamar mengisi data diri, mengunggah dokumen CV/Sertifikat, dan mendaftar posisi tanpa perlu pembuatan akun yang rumit.

---

### Langkah 11: Briefing & Panduan Ujian Kandidat (`/candidate/instructions/[application_id]`)
- **URL**: `https://skillens-app.vercel.app/candidate/instructions/1`
- **Fungsi**: Menjelaskan batasan waktu 15 menit, aturan anti-cheat, serta panduan interaktif sebelum kandidat memulai tes.

---

### Langkah 12: Ruang Evaluasi Simulasi AI Kandidat (`/candidate/test/[app_id]`)
- **URL**: `https://skillens-app.vercel.app/candidate/test/1`
- **Fungsi**: Antarmuka tes utama berbasis studi kasus real-time. Dilengkapi *timer* 15 menit, area jawaban terstruktur, dan pemantau aktivitas proctored.

---

### Langkah 13: Dasbor Status Kandidat (`/candidate/dashboard`)
- **URL**: `https://skillens-app.vercel.app/candidate/dashboard`
- **Fungsi**: Tempat kandidat memantau status lamaran, hasil tes simulasi, dan notifikasi kelulusan.

---

### Langkah 14: Manajemen Undangan Wawancara Kandidat (`/candidate/interviews`)
- **URL**: `https://skillens-app.vercel.app/candidate/interviews`
- **Fungsi**: Kandidat dapat meninjau jadwal wawancara yang diajukan oleh recruiter serta memilih untuk **Menerima** atau **Menolak** sesi wawancara.

---

## 🛠️ 4. Spesifikasi Arsitektur Teknis

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Carbon Icons.
- **Backend API**: FastAPI (Python 3.11), SQLAlchemy, Pydantic v2, JWT Security.
- **Database**: PostgreSQL (Cloud / VPS Hosted).
- **Deployment**: Vercel (Frontend App) & VPS Cloudflare Tunnel (Backend API).

---
*Dokumentasi ini dibuat secara otomatis oleh Browser Agent Skillens pada 2026-07-28.*
