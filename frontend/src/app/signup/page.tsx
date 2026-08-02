'use client';

import { ChevronLeft, Email, Enterprise, Locked, User, View, ViewOff, Warning } from '@carbon/icons-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import SponsorLogos from '@/components/SponsorLogos';
import TextRollButton from '@/components/TextRollButton';
import ShaderBackground from '@/components/ShaderBackground';

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
  const [error, setError] = useState('');

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              <span className="text-xs font-medium text-gray-700">Sudah punya akun?</span>
              <Link 
                href="/login" 
                className="text-xs font-semibold text-white bg-gray-900 hover:bg-[#F26522] px-3.5 py-1.5 rounded-full transition-colors shadow-xs"
              >
                Masuk
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
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Get started free.</h1>
              <p className="text-gray-500 text-xs font-normal">Free forever. No credit card needed.</p>
            </div>

            {/* Role Toggle */}
            <div className="relative flex bg-gray-100 p-1.5 rounded-2xl mb-6 border border-gray-200">
              <motion.div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gray-900 rounded-xl z-0"
                animate={{ x: role === 'candidate' ? 0 : '100%' }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              {(['candidate', 'recruiter'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`relative flex-1 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider z-10 ${
                    role === r ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {r === 'candidate' ? "Saya Kandidat" : "Saya Rekruter"}
                </button>
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold overflow-hidden"
              >
                <Warning className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}

            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white text-sm text-gray-900 font-medium placeholder-gray-400"
                    placeholder="nicholas@ergemla.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Your name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white text-sm text-gray-900 font-medium placeholder-gray-400"
                    placeholder="Nicholas Ergemla"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {role === 'recruiter' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Company name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="company_name"
                        required={role === 'recruiter'}
                        value={formData.company_name}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white text-sm text-gray-900 font-medium placeholder-gray-400"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-4 pr-12 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white text-sm text-gray-900 font-medium placeholder-gray-400"
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

              <div className="pt-2">
                <TextRollButton
                  text={loading ? 'Memproses...' : 'Sign up'}
                  variant="orange"
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="w-full justify-between rounded-2xl"
                />
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500 font-normal">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="font-semibold text-[#F26522] hover:text-[#e05a1a] transition-colors">
                Masuk
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
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-2">Buat akun baru.</h1>
              <p className="text-gray-500 text-sm font-normal">Bergabung dengan Skillens dan nikmati evaluasi berbasis AI.</p>
            </div>

            {/* Role Toggle */}
            <div className="relative flex bg-white p-1.5 rounded-full mb-6 border border-gray-200 shadow-xs">
              <motion.div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gray-900 rounded-full z-0"
                animate={{ x: role === 'candidate' ? 0 : '100%' }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              {(['candidate', 'recruiter'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`relative flex-1 py-2 text-xs font-semibold rounded-full transition-colors uppercase tracking-wider z-10 ${
                    role === r ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {r === 'candidate' ? "Saya Kandidat" : "Saya Rekruter"}
                </button>
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold overflow-hidden"
              >
                <Warning className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}

            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] transition-colors bg-white text-sm text-gray-900"
                    placeholder="Sarah Jenkins"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {role === 'recruiter' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="pt-1"
                  >
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Nama Perusahaan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Enterprise className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="company_name"
                        required={role === 'recruiter'}
                        value={formData.company_name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] transition-colors bg-white text-sm text-gray-900"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Email className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] transition-colors bg-white text-sm text-gray-900"
                    placeholder="you@email.com"
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
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] transition-colors bg-white text-sm text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <TextRollButton
                  text={loading ? 'Memproses...' : `Daftar Akun ${role === 'recruiter' ? 'Rekruter' : 'Kandidat'}`}
                  variant="orange"
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="w-full justify-between"
                />
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500 font-normal">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="font-semibold text-[#F26522] hover:text-[#e05a1a] transition-colors">
                Masuk
              </Link>
            </p>
            
            <div className="mt-8 pt-6 border-t border-gray-200/60">
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
              <AnimatePresence mode="wait">
                {role === 'candidate' ? (
                  <motion.div
                    key="candidate-text"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.08]">
                      Tunjukkan keahlian nyata,<br/>
                      <span className="text-[#F26522]">bukan sekadar resume.</span>
                    </h2>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed font-normal max-w-lg mt-6">
                      Buktikan kemampuan pemecahan masalah Anda melalui simulasi studi kasus interaktif di platform Skillens.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="recruiter-text"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.08]">
                      Zero false positives.<br/>
                      <span className="text-[#F26522]">100% kepastian.</span>
                    </h2>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed font-normal max-w-lg mt-6">
                      Dapatkan wawasan bukti nyata dari setiap pelamar dengan simulasi AI interaktif Skillens.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
