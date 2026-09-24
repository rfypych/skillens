# Skillens — Daftar Uji Komprehensif Semua Fitur

> Prasyarat: backend `http://127.0.0.1:8000` + frontend `http://localhost:3000` jalan (production-mode: `npm start`).
> Akun: Rekruter `recruiter@skillens.com` / `password123` · Kandidat `kandidat@skillens.com` / `password123` · Admin `admin` / `admin` · User `user` / `user`.
> Baud rate-limit: MAKS 5x login/menit per IP — beri jeda, jangan spam refresh saat testing auth.
> Uji otomatis (sudah hijau, boleh jalan dulu): `npx playwright test tests/presentation-check.spec.ts tests/demo-buttons.spec.ts --project=chromium`

## A. Autentikasi & Peran (15 mnt)
- [ ] A1. Login Rekruter via tombol demo → mendarat `/recruiter`, nama tampil benar.
- [ ] A2. Login Kandidat via tombol demo → mendarat `/candidate/dashboard`.
- [ ] A3. Login `admin`/`admin` → mendarat `/recruiter` (bukan dashboard kandidat).
- [ ] A4. Login `user`/`user` → mendarat `/candidate/dashboard`.
- [ ] A5. Login salah (password ngawur) → pesan error merah muncul, tetap di `/login`.
- [ ] A6. Buka `/recruiter` tanpa login (tab incognito) → mental ke `/login`.
- [ ] A7. Buka `/candidate/dashboard` tanpa login → mental ke `/login`.
- [ ] A8. Logout → sesi habis, halaman proteksi tak bisa dibuka via back button.
- [ ] A9. Signup kandidat baru → bisa login → dashboard kosong rapi (bukan error).
- [ ] A10. Signup rekruter + nama perusahaan → dashboard + perusahaan tersimpan di settings.

## B. Rekruter: Posisi & Arketipe (20 mnt)
- [ ] B1. `/recruiter/jobs`: kartu job tampil (judul, kandidat count, tombol Salin Tautan + Buka Posisi).
- [ ] B2. Salin Tautan → link tercopy, buka di incognito → halaman apply tanpa login.
- [ ] B3. `/recruiter/jobs/new`: wizard 3 tahap jalan; **pemilih arketipe 3 kartu** tampil (Teknis/Lapangan/Kreatif).
- [ ] B4. Buat job arketipe Lapangan → skenario berisi Situasi + Misi Bahaya (cek tab Setup Simulasi).
- [ ] B5. JD Debiasing Check → skor bias + saran muncul (tombol CEK BIAS).
- [ ] B6. Edit posisi → ubah gaji → simpan → berubah di daftar (skenario TIDAK regenerate).
- [ ] B7. Detail job: pill arketipe tampil (TEKNIS/LAPANGAN/KREATIF) + pill status AKTIF.

## C. Rekruter: Ranking & Kandidat (20 mnt)
- [ ] C1. Tabel ranking: 5 kandidat job 22 urut skor (87,5 / 83 / 79,2 / 58 / 45).
- [ ] C2. Klik header Skor AI → urutan berubah asc/desc; peringkat # stabil ikut skor.
- [ ] C3. Search "sinta" → tinggal 1 baris; hapus → kembali 5.
- [ ] C4. Tab Rekomendasi AI → hanya yang lulus KKM (3 orang job 22).
- [ ] C5. `/recruiter/candidates`: semua kandidat + label AI + tombol Laporan.
- [ ] C6. Detail Arka (APP-70): skor 5 dimensi + radar + replay ketikan + transkrip + tombol Lihat CV + Unduh Report (file JSON terdownload).
- [ ] C7. Klik Analisis CV → hasil skill/klaim/red-flag muncul.
- [ ] C8. Kandidat berfoto → galeri Dokumentasi Visual tampil; klik Analisis Visual AI → hasil muncul (±1 mnt, butuh GOOGLE_API_KEY).
- [ ] C9. Undang Wawancara (Rania) → modal jadwal → simpan → status jadi interview.
- [ ] C10. Arsipkan 1 kandidat uji → hilang dari daftar (jangan arsipkan demo asli!).

## D. Kandidat: Alur Tes Penuh (25 mnt, peran ke-2)
- [ ] D1. Magic link (incognito) → isi nama/email + upload CV PDF (≤5MB) → Lanjut.
- [ ] D2. Upload PDF 6MB+ → ditolak dengan pesan jelas. Upload .docx → ditolak (hanya PDF).
- [ ] D3. Halaman instruksi → panduan 3 tahap → centang persetujuan → Mulai.
- [ ] D4. Ruang ujian: skenario tampil, timer 15:00 jalan, kirim 1 jawaban → balasan AI follow-up (relevan, Bahasa Indonesia).
- [ ] D5. Pindah tab → counter tab + warning muncul. Paste → warning paste.
- [ ] D6. Jawab sampai 4 turn → AI suruh klik Kirim (tidak bertanya lagi).
- [ ] D7. Konfirmasi submit → "Evaluasi Berhasil Dikirim" < 1 detik.
- [ ] D8. Tunggu ±45 detik → refresh → status evaluated + skor + label (bukan "Pending"/Error).
- [ ] D9. Dashboard kandidat → lamaran tercatat + Unduh Report jalan.
- [ ] D10. Buka link tes app yang SUDAH dievaluasi → kartu "Sesi Ujian Tidak Tersedia" (bukan loader muter).

## E. Anti-Cheat Forensik (15 mnt, nilai jual utama)
- [ ] E1. Jawab dengan tempel kata jebakan job (tanya rekruter: tab Setup Simulasi) → label **Likely Fabricated** + cheating true.
- [ ] E2. Jawab dengan gaya AI ("As an AI…", "Let me know…") → terdeteksi.
- [ ] E3. Ketik super-cepat + jawaban panjang (atau Regionsubmit CPS>30) → override "Likely Fabricated".
- [ ] E4. CV senior + jawaban dangkal → **Mismatch**. CV sederhana + jawaban brilian → **Hidden Gem**.
- [ ] E5. Kandidat curang TIDAK masuk tab Rekomendasi (di bawah KKM).

## F. Arketipe Lapangan & Kreatif (15 mnt)
- [ ] F1. Job 39 Teknisi Lapangan: skenario berisi Situasi 1-2 + Misi Bahaya K3.
- [ ] F2. Ranking job 39: Budi 86,25 / Agus 7,75 / Joko 0,0 + pill LAPANGAN.
- [ ] F3. Job 40 Content Designer: brief Kopi Senja + Tugas Rasa + Interogasi Portofolio.
- [ ] F4. Ranking job 40: Sinta 84,75 / Rizky 8,25 / Maya 0,0 + pill KREATIF.
- [ ] F5. Detail kandidat lapangan: rubrik bahas keputusan + K3 (bukan teori kantor).

## G. Wawancara & Metrics & Settings (10 mnt)
- [ ] G1. `/recruiter/interviews`: form jadwal validasi (tanpa tanggal → error); daftar wawancara tampil.
- [ ] G2. Beri nilai wawancara → tersimpan, tampil di kandidat.
- [ ] G3. `/recruiter/metrics`: 4 KPI angka wajar (rata-rata 0–100, bukan 142!), delta "minggu ini", grafik distribusi + volume terisi.
- [ ] G4. `/recruiter/settings`: ubah nama + simpan → header ikut berubah. Ganti bahasa → label sidebar berubah.
- [ ] G5. `/recruiter/settings/team`: undang sub-akun → login sebagai dia → hanya lihat job perusahaan.

## H. Kandidat: Dashboard, Profil, Interview (10 mnt)
- [ ] H1. Dashboard: lamaran + posisi terbuka + tombol Lamar.
- [ ] H2. Profil: isi bio + upload CV → tersimpan; apply berikutnya pakai CV tersimpan otomatis.
- [ ] H3. `/candidate/interviews`: undangan dari G1 tampil + catatan terbaca.

## I. Halaman Sistem & Sitemap (5 mnt)
- [ ] I1. Buka `/rute-ngawur-123` → halaman 404 oranye-pill Indonesia + tombol Kembali.
- [ ] I2. `/login` mobile (atau resize 390px) → form rapi, tombol demo 2 kolom.
- [ ] I3. `documentation/Skillens-Sitemap.pdf` terbuka + 24 node terbaca.
- [ ] I4. `/sitemap/` (setelah deploy) tampil live.

## J. Ketahanan & Batas (10 mnt, jujur ke juri kalau ditanya)
- [ ] J1. Matikan backend → frontend tampil pesan error ramah (bukan blank putih).
- [ ] J2. Submit dobel (klik 2× cepat) → hanya 1 hasil (guard duplikat).
- [ ] J3. Buka apply job yang deadline lewat → ditolak "expired".
- [ ] J4. Kandidat A buka link tes kandidat B → 403 / redirect login (tidak bocor).
- [ ] J5. **Diketahui belum ada**: analisis ISI piksel foto butuh key (sudah dipasang), dark mode tidak ada, notifikasi email tidak ada.

---
*Cakupan: 60+ cek. Estimasi total ±2,5 jam (bagi 3 orang ≈ 50 mnt/orang). Yang bertanda ★ (D, E, F) adalah nyawa demo — jangan dilewatkan.*
