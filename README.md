# 🚀 Skillens AI Platform

> **Skillens AI Platform** — Platform Penilai Bakat & Wawancara AI Interaktif Berbasis Conversational AI.

[![Live App](https://img.shields.io/badge/Production-Live_App-orange?style=for-the-badge&logo=vercel)](https://socratech.my.id)
[![API Docs](https://img.shields.io/badge/API-Swagger_Docs-blue?style=for-the-badge&logo=fastapi)](https://socratech.my.id/api/docs)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/rfypych/skillens)

---

## 🌟 Quick Links & Documentation

- 📘 **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**: Dokumentasi Lengkap Aplikasi, Studi Kasus, Solusi Masalah, & Arsitektur Sistem.
- 🔌 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**: Dokumentasi Lengkap REST API & Endpoint Swagger.

---

## 🌐 Live URLs

- **Web Application (produksi)**: [https://socratech.my.id](https://socratech.my.id)
- **Staging (branch preview, DB terpisah)**: [https://staging.socratech.my.id](https://staging.socratech.my.id)
- **Backend API**: [https://socratech.my.id/api](https://socratech.my.id/api) (via frontend rewrite ke FastAPI di VPS)
- **Interactive Swagger Docs**: [https://socratech.my.id/api/docs](https://socratech.my.id/api/docs)

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `recruiter@skillens.com` | `password123` | Buat Job, Atur KKM, Pantau Ranking Kandidat |
| **Candidate** | `kandidat@skillens.com` | `password123` | Apply Job, Upload Resume PDF, Wawancara AI |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (Turbopack), TypeScript, Tailwind CSS, Lucide Icons. Produksi di **VPS Jakarta (systemd)**, staging di **Vercel**, edge via **Cloudflare** (tunnel + cache + redirect).
- **Backend**: FastAPI (Python), SQLAlchemy, Pydantic, OAuth2 / JWT, Slowapi. Berjalan di **VPS** (3 worker prod + 2 worker staging + Celery worker antrean evaluasi).
- **AI Engine**: Groq `qwen/qwen3-8-27b` (fallback `gpt-oss-120b`), vision foto via **Gemini**, fingerprint ML scikit-learn GradientBoosting.
- **Database & Cache**: **Neon Cloud Serverless PostgreSQL** (branch produksi + staging terpisah) & **Upstash Cloud Redis** (cache API 60s + broker Celery).

© 2026 **Skillens AI Platform**. All Rights Reserved.
