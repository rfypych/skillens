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
import OrangeFlowAscii from '@/components/OrangeFlowAscii';

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

  const roleToggle = (
    <div className="grid grid-cols-2 gap-2">
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
  );

  const errorBox = error && (
    <div className="flex items-start gap-2.5 rounded-2xl border border-border-error-default p-3.5 text-text-error-primary">
      <RiErrorWarningLine className="size-5 shrink-0" aria-hidden />
      <p className="text-body-medium">{error}</p>
    </div>
  );

  const formFields = (
    <>
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

      <div className="relative">
        <Input
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Minimal 8 karakter"
          value={formData.password}
          onChange={setField('password')}
          leadingIcon={RiLockLine}
          fieldClassName="pr-11"
          isRequired
        />
        <IconButton
          size="small"
          icon={showPassword ? RiEyeOffLine : RiEyeLine}
          aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-1.5 bottom-[2px]"
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
    </>
  );

  const demoBlock = (
    <div className="flex flex-col gap-2">
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
  );

  return (
    <div className="min-h-screen bg-background-full font-boardui overflow-x-hidden">

      {/* MOBILE VIEW (< lg): mirror login card sheet */}
      <div className="flex lg:hidden min-h-screen flex-col justify-between bg-gradient-to-b from-accent-800 via-accent-700 to-accent-600">
        <div className="relative w-full h-[220px] sm:h-[260px] text-white p-4 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-accent-800 to-accent-700">
          <OrangeFlowAscii />
          <div className="relative z-20 w-full flex items-center justify-between">
            <Link
              href="/"
              aria-label="Kembali"
              className="flex size-9 items-center justify-center rounded-full text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiArrowLeftLine className="size-6" aria-hidden />
            </Link>
            <div className="bg-background-primary-default rounded-full p-1 pl-3.5 pr-1 shadow-card border border-border-button-default flex items-center gap-2">
              <span className="text-body-regular text-text-secondary">Sudah punya akun?</span>
              <Link href="/login">
                <Button variant="primary" size="small">
                  Masuk
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

        <div className="relative z-30 w-full flex-1 bg-background-primary-default rounded-t-[32px] sm:rounded-t-[40px] px-6 py-8 shadow-dropdown flex flex-col justify-between border-t border-separator-border">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-center">
              <h1 className="text-title-2-medium text-text-primary mb-1">Buat akun baru.</h1>
              <p className="text-body-regular text-text-secondary">Bergabung dengan Skillens dan nikmati evaluasi berbasis AI.</p>
            </div>

            {errorBox}

            <div className="mt-4 mb-4">{roleToggle}</div>

            <form className="flex flex-col gap-4" onSubmit={handleSignup}>
              {formFields}
            </form>

            <div className="mt-6">{demoBlock}</div>

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

      {/* DESKTOP VIEW (>= lg): mirror login split screen */}
      <div className="hidden lg:flex min-h-screen flex-row items-stretch justify-between">
        <div className="w-[42%] xl:w-[38%] flex flex-col justify-center px-12 xl:px-16 py-16">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-title-1-medium text-text-primary mb-2">Buat akun baru.</h1>
              <p className="text-body-regular text-text-secondary">Bergabung dengan Skillens dan nikmati evaluasi berbasis AI.</p>
            </div>

            {errorBox}

            <div className="mt-4 mb-4">{roleToggle}</div>

            <form className="flex flex-col gap-4" onSubmit={handleSignup}>
              {formFields}
            </form>

            <div className="mt-6">{demoBlock}</div>

            <p className="mt-8 text-center text-body-regular text-text-secondary">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="text-body-medium text-accent-600 outline-none transition-colors hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                Masuk
              </Link>
            </p>

            <div className="mt-10 border-t border-separator-border pt-6">
              <SponsorLogos />
            </div>
          </div>
        </div>

        <div className="w-[58%] xl:w-[62%] p-3 pl-0">
          <div className="w-full h-full bg-gradient-to-br from-accent-800 via-accent-700 to-accent-600 rounded-3xl p-12 lg:p-16 text-white flex flex-col justify-between items-start relative overflow-hidden shadow-dropdown">
            {/* Aliran ASCII putih ala shader hero — ringan, tanpa WebGL */}
            <div className="absolute inset-0" aria-hidden>
              <OrangeFlowAscii />
            </div>

            <div className="relative z-20">
              <Link href="/" className="flex items-center gap-3 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-9 w-auto brightness-0 invert object-contain" />
              </Link>
            </div>

            <div className="relative z-20 max-w-xl my-auto">
              <div>
                <h2 className="text-display-3-medium lg:text-display-2-medium text-white leading-[1.08]">
                  Merekrut bakat tepat,<br/>
                  <span className="text-white">dengan bukti nyata.</span>
                </h2>
                <p className="text-body-1-medium text-white/85 leading-relaxed max-w-lg mt-6">
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
