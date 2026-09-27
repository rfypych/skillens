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
import { api } from '@/lib/api';
import SponsorLogos from '@/components/SponsorLogos';
import ShaderBackground from '@/components/ShaderBackground';
import { Button } from '@/components/base/buttons/button';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Input } from '@/components/base/input/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Akun demo seeded di DB — masuk langsung satu ketukan untuk presentasi.
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
      setDemoLoading(null);
    }
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
      const targetUrl = me.role === 'recruiter' ? '/recruiter' : '/candidate/dashboard';
      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message || 'Kredensial tidak valid. Silakan coba lagi.');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background-full font-boardui overflow-x-hidden">

      {/* MOBILE VIEW (< lg): Dribbble Card Sheet Layout */}
      <div className="flex lg:hidden min-h-screen flex-col justify-between bg-[#0F172A]">
        {/* Top WebGL Header Area */}
        <div className="relative w-full h-[220px] sm:h-[260px] text-white p-4 flex flex-col justify-between overflow-hidden">
          <ShaderBackground variant="dark" />
          <div className="relative z-20 w-full flex items-center justify-between">
            <Link
              href="/"
              aria-label="Kembali"
              className="flex size-9 items-center justify-center rounded-full text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiArrowLeftLine className="size-6" aria-hidden />
            </Link>
            <div className="bg-background-primary-default rounded-full p-1 pl-3.5 pr-1 shadow-card border border-border-button-default flex items-center gap-2">
              <span className="text-body-regular text-text-secondary">Belum punya akun?</span>
              <Link href="/signup">
                <Button variant="primary" size="small">
                  Daftar
                </Button>
              </Link>
            </div>

          </div>
          <div className="relative z-20 w-full text-center my-auto pb-4 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
              <img src="/skillens-logo-text.png" alt="Skillens" className="h-9 w-auto brightness-0 invert object-contain" />
            </Link>
          </div>
        </div>

        {/* Bottom Form Sheet - Fills Full Bottom Viewport */}
        <div className="relative z-30 w-full flex-1 bg-background-primary-default rounded-t-[32px] sm:rounded-t-[40px] px-6 py-8 shadow-dropdown flex flex-col justify-between border-t border-separator-border">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-center">
              <h1 className="text-title-1-medium text-text-primary mb-1">Welcome Back</h1>
              <p className="text-body-regular text-text-secondary">Enter your details below to continue.</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-border-error-default p-4 text-text-error-primary">
                <RiErrorWarningLine className="size-5 shrink-0 mt-0.5" aria-hidden />
                <p className="text-body-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                isRequired
                value={email}
                onChange={setEmail}
                placeholder="nicholas@ergemla.com"
                leadingIcon={RiMailLine}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  isRequired
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••••••"
                  leadingIcon={RiLockLine}
                  fieldClassName="pr-11"
                />
                <IconButton
                  size="small"
                  icon={showPassword ? RiEyeOffLine : RiEyeLine}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 bottom-[2px]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input id="remember-me-mobile" type="checkbox" className="size-4 cursor-pointer rounded accent-accent-500" />
                  <label htmlFor="remember-me-mobile" className="cursor-pointer text-body-regular text-text-secondary">Ingat saya</label>
                </div>
                <a href="#" className="text-body-medium text-text-tertiary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">Forgot password?</a>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  leadingIcon={RiLoginBoxLine}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Memproses...' : 'Sign in'}
                </Button>
              </div>
            </form>

            <div className="mt-6 flex flex-col gap-2">
              <p className="text-center text-caption-1-medium text-text-tertiary">Akun demo: ketuk untuk masuk langsung</p>
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

      {/* DESKTOP VIEW (>= lg): Asymmetric Split-Screen with WebGL Window Panel */}
      <div className="hidden lg:flex min-h-screen flex-row items-stretch justify-between">
        {/* Form Side - Left Column */}
        <div className="w-[42%] xl:w-[38%] flex flex-col justify-center px-12 xl:px-16 py-16">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-title-1-medium text-text-primary mb-2">Selamat datang kembali.</h1>
              <p className="text-body-regular text-text-secondary">Masuk ke akun Skillens Anda untuk melanjutkan.</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-border-error-default p-4 text-text-error-primary">
                <RiErrorWarningLine className="size-5 shrink-0 mt-0.5" aria-hidden />
                <p className="text-body-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                isRequired
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
                leadingIcon={RiMailLine}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  isRequired
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  leadingIcon={RiLockLine}
                  fieldClassName="pr-11"
                />
                <IconButton
                  size="small"
                  icon={showPassword ? RiEyeOffLine : RiEyeLine}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 bottom-[2px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input id="remember-me-desktop" type="checkbox" className="size-4 cursor-pointer rounded accent-accent-500" />
                  <label htmlFor="remember-me-desktop" className="cursor-pointer text-body-regular text-text-secondary">Ingat saya</label>
                </div>
                <a href="#" className="text-body-medium text-accent-600 outline-none transition-colors hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-border-focus-ring">Lupa kata sandi?</a>
              </div>

              <div className="pt-2">
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
              </div>
            </form>

            <div className="mt-6 flex flex-col gap-2">
              <p className="text-center text-caption-1-medium text-text-tertiary">Akun demo: ketuk untuk masuk langsung</p>
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

            <p className="mt-8 text-center text-body-regular text-text-secondary">
              Belum memiliki akun?{' '}
              <Link href="/signup" className="text-body-medium text-accent-600 outline-none transition-colors hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                Daftar sekarang
              </Link>
            </p>

            <div className="mt-10 border-t border-separator-border pt-6">
              <SponsorLogos />
            </div>
          </div>
        </div>

        {/* WebGL Side - Flush Right Edge Floating Panel */}
        <div className="w-[58%] xl:w-[62%] p-3 pl-0">
          <div className="w-full h-full bg-[#0F172A] rounded-3xl p-12 lg:p-16 text-white flex flex-col justify-between items-start relative overflow-hidden shadow-dropdown">
            {/* WebGL Shader Background Overlay */}
            <ShaderBackground variant="dark" />

            {/* Clean Brand Header */}
            <div className="relative z-20">
              <Link href="/" className="flex items-center gap-3 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-9 w-auto brightness-0 invert object-contain" />
              </Link>
            </div>

            {/* Pure Typography Content */}
            <div className="relative z-20 max-w-xl my-auto">
              <div>
                <h2 className="text-display-3-medium lg:text-display-2-medium text-white leading-[1.08]">
                  Merekrut bakat tepat,<br/>
                  <span className="text-accent-500">dengan kepastian mutlak.</span>
                </h2>
                <p className="text-body-1-medium text-white/70 leading-relaxed max-w-lg mt-6">
                  Skillens mengeliminasi klaim palsu resume dengan simulasi studi kasus interaktif berbasis telemetry AI cerdas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
