'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  RiArrowLeftLine,
  RiBuildingLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiMailLine,
  RiLockLine,
  RiUserAddLine,
  RiUserLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Input } from '@/components/base/input/input';
import { api } from '@/lib/api';
import SponsorLogos from '@/components/SponsorLogos';

export default function Signup() {
  const router = useRouter();
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    company_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Akun demo seeded di DB — masuk langsung satu ketukan tanpa mendaftar.
  const DEMO_ACCOUNTS = [
    { label: 'Rekruter', email: 'recruiter@skillens.com', password: 'password123' },
    { label: 'Kandidat', email: 'kandidat@skillens.com', password: 'password123' },
  ];

  const demoLogin = async (email: string, password: string, label: string) => {
    if (loading || demoLoading) return;
    setDemoLoading(label);
    setError('');
    try {
      const loginData = new URLSearchParams();
      loginData.append('username', email);
      loginData.append('password', password);

      await api.post('/auth/login', loginData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        requireAuth: false
      });

      const me = await api.get('/auth/me');
      const targetUrl = (me.role === 'recruiter' || me.role === 'admin') ? '/recruiter' : '/candidate/dashboard';
      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message || 'Kredensial tidak valid. Silakan coba lagi.');
      setDemoLoading(null);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        role,
        company_name: role === 'candidate' ? null : formData.company_name
      };
      await api.post('/auth/signup', payload, { requireAuth: false });

      const loginData = new URLSearchParams();
      loginData.append('username', formData.email);
      loginData.append('password', formData.password);

      try {
        await api.post('/auth/login', loginData.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          requireAuth: false
        });
        await api.get('/auth/me');
        const targetUrl = role === 'recruiter' ? '/recruiter' : '/candidate/dashboard';
        window.location.href = targetUrl;
      } catch {
        window.location.href = '/login';
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat pendaftaran');
      setLoading(false);
    }
  };


  const setField = (name: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-full px-4 py-10 font-boardui">
      <div className="flex w-full max-w-[440px] flex-col gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Kembali ke beranda
        </Link>

        <div className="flex w-full flex-col rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-1.5">
            <img src="/skillens-logo-text.png" alt="Skillens" className="mb-3 h-8 w-auto self-start object-contain" />
            <h1 className="text-title-2-medium text-text-primary">Buat akun baru.</h1>
            <p className="text-body-regular text-text-secondary">Bergabung dengan Skillens dan nikmati evaluasi berbasis AI.</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {(['candidate', 'recruiter'] as const).map((r) => (
              <Button
                key={r}
                type="button"
                variant={role === r ? 'primary' : 'secondary'}
                size="small"
                leadingIcon={r === 'candidate' ? RiUserLine : RiBuildingLine}
                onClick={() => setRole(r)}
              >
                {r === 'candidate' ? 'Saya Kandidat' : 'Saya Rekruter'}
              </Button>
            ))}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-border-error-default p-3.5 text-text-error-primary">
              <RiErrorWarningLine className="size-5 shrink-0" aria-hidden />
              <p className="text-body-medium">{error}</p>
            </div>
          )}

          <form className="mt-4 flex flex-col gap-4" onSubmit={handleSignup}>
            <Input
              name="full_name"
              type="text"
              label="Nama Lengkap"
              placeholder="Sarah Jenkins"
              value={formData.full_name}
              onChange={setField('full_name')}
              leadingIcon={RiUserLine}
              isRequired
            />

            {role === 'recruiter' && (
              <Input
                name="company_name"
                type="text"
                label="Nama Perusahaan"
                placeholder="Acme Corp"
                value={formData.company_name}
                onChange={setField('company_name')}
                leadingIcon={RiBuildingLine}
                isRequired={role === 'recruiter'}
              />
            )}

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={setField('email')}
              leadingIcon={RiMailLine}
              isRequired
            />

            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={setField('password')}
                  leadingIcon={RiLockLine}
                  isRequired
                />
              </div>
              <IconButton
                size="small"
                icon={showPassword ? RiEyeOffLine : RiEyeLine}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                onClick={() => setShowPassword(!showPassword)}
                className="mb-0.5 shrink-0"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="medium"
              leadingIcon={RiUserAddLine}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Memproses...' : `Daftar Akun ${role === 'recruiter' ? 'Rekruter' : 'Kandidat'}`}
            </Button>

            <p className="text-center text-caption-1-medium text-text-tertiary">
              {role === 'candidate'
                ? 'Buktikan kemampuan Anda melalui simulasi studi kasus interaktif.'
                : 'Dapatkan bukti nyata dari setiap pelamar dengan simulasi AI interaktif.'}
            </p>
          </form>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-center text-caption-1-medium text-text-tertiary">Punya akun demo? Masuk langsung</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <Button
                  key={acc.label}
                  type="button"
                  variant="secondary"
                  size="small"
                  disabled={loading || demoLoading !== null}
                  onClick={() => demoLogin(acc.email, acc.password, acc.label)}
                  title={`${acc.email} / ${acc.password}`}
                >
                  {demoLoading === acc.label ? 'Memproses...' : acc.label}
                </Button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-body-regular text-text-secondary">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="text-body-medium text-accent-600 outline-none transition-colors hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-border-focus-ring">
              Masuk
            </Link>
          </p>

          <div className="mt-8 border-t border-separator-border pt-6">
            <SponsorLogos />
          </div>
        </div>
      </div>
    </div>
  );
}
