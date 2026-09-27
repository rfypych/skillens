'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiLoginBoxLine,
  RiMailLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Input } from '@/components/base/input/input';
import { api } from '@/lib/api';
import SponsorLogos from '@/components/SponsorLogos';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default demo credentials (seeded in DB) — one-click fill for presentations.
  // Only 2 roles exist: recruiter & candidate.
  const DEMO_ACCOUNTS = [
    { label: 'Rekruter', email: 'recruiter@skillens.com', password: 'password123' },
    { label: 'Kandidat', email: 'kandidat@skillens.com', password: 'password123' },
  ];

  const fillDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loginData = new URLSearchParams();
      loginData.append('username', email);
      loginData.append('password', password);

      await api.post('/auth/login', loginData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        requireAuth: false
      });

      const me = await api.get('/auth/me');
      const targetUrl = (me.role === 'recruiter' || me.role === 'admin') ? '/recruiter' : '/candidate/dashboard';
      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message || 'Kredensial tidak valid. Silakan coba lagi.');
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-background-full px-4 py-10 font-boardui">
      <div className="flex w-full max-w-[400px] flex-col gap-4">
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
            <h1 className="text-title-2-medium text-text-primary">Selamat datang kembali.</h1>
            <p className="text-body-regular text-text-secondary">Masuk ke akun Skillens Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-border-error-default p-3.5 text-text-error-primary">
                <RiErrorWarningLine className="size-5 shrink-0" aria-hidden />
                <p className="text-body-medium">{error}</p>
              </div>
            )}

            <Input
              name="email"
              type="text"
              label="Email"
              placeholder="email atau admin / user"
              value={email}
              onChange={setEmail}
              leadingIcon={RiMailLine}
              isRequired
            />

            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={setPassword}
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
              leadingIcon={RiLoginBoxLine}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Memproses...' : 'Masuk Akun'}
            </Button>

            <div className="flex flex-col gap-2">
              <p className="text-center text-caption-1-medium text-text-tertiary">Akun demo: ketuk untuk mengisi</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <Button
                    key={acc.label}
                    type="button"
                    variant={email === acc.email ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => fillDemo(acc.email, acc.password)}
                    title={`${acc.email} / ${acc.password}`}
                  >
                    {acc.label}
                  </Button>
                ))}
              </div>
              <p className="text-center text-caption-1-medium text-text-tertiary">
                {email ? `${email} / ${password.replace(/./g, '•')}` : 'Pilih salah satu akun di atas'}
              </p>
            </div>
          </form>

          <p className="mt-6 text-center text-body-regular text-text-secondary">
            Belum memiliki akun?{' '}
            <Link href="/signup" className="text-body-medium text-accent-600 outline-none transition-colors hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-border-focus-ring">
              Daftar sekarang
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
