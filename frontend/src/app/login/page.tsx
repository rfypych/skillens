'use client';

import { ChevronLeft, Email, Locked, View, ViewOff, Warning } from '@carbon/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import SponsorLogos from '@/components/SponsorLogos';
import TextRollButton from '@/components/TextRollButton';
import ShaderBackground from '@/components/ShaderBackground';

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
    <div className="min-h-screen bg-[#EFEFEF] font-sans overflow-x-hidden">
      
      {/* MOBILE VIEW (< lg): Dribbble Card Sheet Layout */}
      <div className="flex lg:hidden min-h-screen flex-col justify-between bg-[#0F172A]">
        {/* Top WebGL Header Area */}
        <div className="relative w-full h-[220px] sm:h-[260px] text-white p-4 flex flex-col justify-between overflow-hidden">
          <ShaderBackground variant="dark" />
          <div className="relative z-20 w-full flex items-center justify-between">
            <Link href="/" className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="bg-white rounded-full p-1 pl-3.5 pr-1 shadow-sm border border-gray-200/60 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">Belum punya akun?</span>
              <Link 
                href="/signup" 
                className="text-xs font-semibold text-white bg-gray-900 hover:bg-[#F26522] px-3.5 py-1.5 rounded-full transition-colors shadow-xs"
              >
                Daftar
              </Link>
            </div>

          </div>
          <div className="relative z-20 w-full text-center my-auto pb-4 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/skillens-logo-text.png" alt="Skillens" className="h-9 w-auto brightness-0 invert object-contain" />
            </Link>
          </div>
        </div>

        {/* Bottom Form Sheet - Fills Full Bottom Viewport */}
        <div className="relative z-30 w-full flex-1 bg-white rounded-t-[32px] sm:rounded-t-[40px] px-6 py-8 shadow-2xl flex flex-col justify-between border-t border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Welcome Back</h1>
              <p className="text-gray-500 text-xs font-normal">Enter your details below to continue.</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold">
                <Warning className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white text-sm text-gray-900 font-medium placeholder-gray-400"
                    placeholder="email atau admin / user"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full pl-4 pr-12 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white text-sm text-gray-900 font-medium placeholder-gray-400"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <ViewOff className="h-5 w-5" /> : <View className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input id="remember-me-mobile" type="checkbox" className="h-4 w-4 text-[#F26522] focus:ring-0 border-gray-300 rounded bg-white cursor-pointer" />
                  <label htmlFor="remember-me-mobile" className="ml-2 block text-xs font-medium text-gray-600 cursor-pointer">Ingat saya</label>
                </div>
                <a href="#" className="text-xs font-semibold text-gray-500 hover:text-[#F26522] transition-colors">Forgot password?</a>
              </div>

              <div className="pt-2">
                <TextRollButton
                  text={loading ? 'Memproses...' : 'Sign in'}
                  variant="orange"
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="w-full justify-between rounded-2xl"
                />
              </div>

              <div className="pt-1">
                <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Akun demo — ketuk untuk mengisi</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.label}
                      type="button"
                      onClick={() => fillDemo(acc.email, acc.password)}
                      className={`px-2 py-2 rounded-full border text-[11px] font-semibold transition-colors ${email === acc.email ? 'border-[#F26522] bg-[#F26522]/10 text-[#F26522]' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'}`}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500 font-normal">
              Belum memiliki akun?{' '}
              <Link href="/signup" className="font-semibold text-[#F26522] hover:text-[#e05a1a] transition-colors">
                Daftar sekarang
              </Link>
            </p>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <SponsorLogos />
            </div>
          </motion.div>
        </div>
      </div>

      {/* DESKTOP VIEW (>= lg): Asymmetric Split-Screen with WebGL Window Panel */}
      <div className="hidden lg:flex min-h-screen flex-row items-stretch justify-between">
        {/* Form Side - Left Column */}
        <div className="w-[42%] xl:w-[38%] flex flex-col justify-center px-12 xl:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-2">Selamat datang kembali.</h1>
              <p className="text-gray-500 text-sm font-normal">Masuk ke akun Skillens Anda untuk melanjutkan.</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold">
                <Warning className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Email className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] transition-colors bg-white text-sm text-gray-900"
                    placeholder="you@company.com atau admin / user"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Locked className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] transition-colors bg-white text-sm text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me-desktop" type="checkbox" className="h-4 w-4 text-[#F26522] focus:ring-0 border-gray-300 rounded bg-white cursor-pointer" />
                  <label htmlFor="remember-me-desktop" className="ml-2 block text-xs font-medium text-gray-600 cursor-pointer">Ingat saya</label>
                </div>
                <a href="#" className="text-xs font-semibold text-[#F26522] hover:text-[#e05a1a] transition-colors">Lupa kata sandi?</a>
              </div>

              <div className="pt-2">
                <TextRollButton
                  text={loading ? 'Memproses...' : 'Masuk Akun'}
                  variant="orange"
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="w-full justify-between"
                />
              </div>

              <div className="pt-1">
                <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Akun demo — klik untuk mengisi otomatis</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.label}
                      type="button"
                      onClick={() => fillDemo(acc.email, acc.password)}
                      title={`${acc.email} / ${acc.password}`}
                      className={`px-2 py-2 rounded-full border text-[11px] font-semibold transition-colors ${email === acc.email ? 'border-[#F26522] bg-[#F26522]/10 text-[#F26522]' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'}`}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
                <p className="text-center text-[11px] text-gray-400 mt-2 font-mono">
                  {email ? `${email} / ${password.replace(/./g, '•')}` : 'Pilih salah satu akun di atas'}
                </p>
              </div>
            </form>

            <p className="mt-8 text-center text-xs text-gray-500 font-normal">
              Belum memiliki akun?{' '}
              <Link href="/signup" className="font-semibold text-[#F26522] hover:text-[#e05a1a] transition-colors">
                Daftar sekarang
              </Link>
            </p>

            <div className="mt-10 pt-6 border-t border-gray-200/60">
              <SponsorLogos />
            </div>
          </motion.div>
        </div>

        {/* WebGL Side - Flush Right Edge Floating Panel */}
        <div className="w-[58%] xl:w-[62%] p-3 pl-0">
          <div className="w-full h-full bg-[#0F172A] rounded-3xl border border-gray-200/60 p-12 lg:p-16 text-white flex flex-col justify-between items-start relative overflow-hidden shadow-2xl">
            {/* WebGL Shader Background Overlay */}
            <ShaderBackground variant="dark" />

            {/* Clean Brand Header */}
            <div className="relative z-20">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <img src="/skillens-logo-text.png" alt="Skillens" className="h-9 w-auto brightness-0 invert object-contain" />
              </Link>
            </div>

            {/* Pure Typography Content */}
            <div className="relative z-20 max-w-xl my-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.08]">
                  Merekrut bakat tepat,<br/>
                  <span className="text-[#F26522]">dengan kepastian mutlak.</span>
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed font-normal max-w-lg mt-6">
                  Skillens mengeliminasi klaim palsu resume dengan simulasi studi kasus interaktif berbasis telemetry AI cerdas.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
