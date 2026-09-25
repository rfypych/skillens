# Deploy Skillens ke VPS JagoanHosting (Root + Docker)

> Terverifikasi: kedua image ke-build + seluruh rantai (Caddy → frontend → rewrite /api → backend → JWT) dites hijau di Docker sebelum panduan ini ditulis.

## 0. Yang kamu butuhkan
- VPS Ubuntu 22.04+ dengan root (RAM min 2GB; 4GB nyaman).
- Domain (mis. `skillens.id`) dengan DNS A record → IP VPS. Tanpa domain, HTTPS otomatis tidak jalan.

## 1. Siapkan VPS (sekali saja)
```bash
apt update && apt install -y docker.io docker-compose-plugin git
systemctl enable --now docker
```

## 2. Ambil kode
```bash
git clone -b preview https://github.com/rfypych/skillens.git /opt/skillens
cd /opt/skillens
```

## 3. Isi rahasia (JANGAN commit file ini)
```bash
cp backend/.env.example backend/.env  # lalu edit, atau salin dari lokal
nano backend/.env
```
Wajib benar: `DATABASE_URL` (Neon), `JWT_SECRET_KEY` (≥32 char acak),
`OPENAI_API_KEY` + `GROQ_API_KEY`, `GOOGLE_API_KEY`,
dan tambah baris: `FRONTEND_URL=https://DOMAIN-KAMU`

## 4. Jalankan
```bash
DOMAIN=skillens.id docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

## 5. Verifikasi (dari laptopmu)
```bash
curl -sL -o /dev/null -w "%{http_code}\n" https://skillens.id/login
curl -s -X POST https://skillens.id/api/auth/login \
  -d "username=admin&password=admin" | head -c 60
```
Keduanya harus 200 + token. Buka `https://skillens.id/login` di browser → tombol demo → masuk.

## 6. Operasional
```bash
# Lihat log
docker compose -f docker-compose.prod.yml logs -f backend
# Update ke versi baru
git pull origin preview
docker compose -f docker-compose.prod.yml up -d --build
# Backup upload CV (satu-satunya data lokal; sisanya di Neon)
tar -czf uploads-$(date +%F).tar.gz backend/uploads/
```

## Catatan arsitektur
- Yang jalan di VPS: `backend` (uvicorn), `frontend` (Next standalone), `caddy` (HTTPS otomatis).
- Yang TIDAK di VPS: Postgres → Neon, Redis → Upstash, worker Celery (mati; evaluasi jalan inline via `USE_CELERY=false`).
- `BACKEND_INTERNAL_URL` di-bake saat build (arg compose) — kalau ganti URL backend internal, rebuild frontend.
- Port 8000/3000 tidak dipublish; hanya 80/443 via Caddy. Jangan buka port database apa pun.
