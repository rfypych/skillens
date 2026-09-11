'use client';

import { ArrowLeft, CheckmarkOutline, Document, Email, Portfolio, User } from '@carbon/icons-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import { useLanguage } from '@/i18n/LanguageContext';
import TextRollButton from '@/components/TextRollButton';

export default function CandidateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    profile: {
      bio: '',
      experience: '',
      resume_url: ''
    }
  });

  const fetchProfile = () => {
    api.get('/auth/me')
      .then(data => {
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          profile: {
            bio: data.profile?.bio || '',
            experience: data.profile?.experience || '',
            resume_url: data.profile?.resume_url || ''
          }
        });
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  };

  useEffect(() => {
    fetchProfile();
    window.addEventListener('user-profile-updated', fetchProfile);
    return () => window.removeEventListener('user-profile-updated', fetchProfile);
  }, [router]);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/me', {
        full_name: formData.full_name,
        profile: formData.profile
      });
      window.dispatchEvent(new Event('user-profile-updated'));
      toast.success('Profil berhasil diperbarui!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 font-sans">
      <div className="h-20 bg-gray-100 animate-pulse rounded-2xl" />
      <div className="bg-white p-8 border border-gray-200/80 rounded-2xl h-96 animate-pulse" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 font-sans">
      <Toaster position="top-right" />
      
      <div>
        <Link href="/candidate/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dasbor
        </Link>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2 tracking-tight">Profil Saya</h1>
        <p className="text-gray-600 text-base font-normal">Kelola informasi pribadi dan ringkasan resume Anda.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden"
      >
        <form onSubmit={handleSave} className="p-8 space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-[#F26522]" />
              Informasi Dasar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Email className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full text-gray-500 cursor-not-allowed text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Document className="w-5 h-5 text-[#F26522]" />
              Detail Profesional & Resume
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Bio Singkat</label>
                <textarea
                  value={formData.profile.bio}
                  onChange={e => setFormData({ ...formData, profile: { ...formData.profile, bio: e.target.value } })}
                  placeholder="Saya adalah software engineer yang berfokus pada pengembangan aplikasi AI skala besar..."
                  className="w-full h-24 px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900 resize-none font-normal"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Ringkasan Pengalaman Kerja</label>
                <textarea
                  value={formData.profile.experience}
                  onChange={e => setFormData({ ...formData, profile: { ...formData.profile, experience: e.target.value } })}
                  placeholder="5 tahun di TechCorp (Backend), 2 tahun di Startup Inc (Fullstack)..."
                  className="w-full h-32 px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900 resize-y font-normal"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">CV / Resume</label>
                
                {/* Current stored CV indicator */}
                {formData.profile.resume_url && (
                  <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl mb-3">
                    <div className="flex items-center gap-2.5 text-xs text-emerald-900">
                      <CheckmarkOutline className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">CV Tersimpan</p>
                        <p className="text-emerald-700 font-mono text-[11px] truncate max-w-[200px]">
                          {formData.profile.resume_url.split('/').pop()}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL || '/api'}${formData.profile.resume_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline"
                    >
                      Lihat
                    </a>
                  </div>
                )}

                {/* Upload new CV */}
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={async (e) => {
                      if (!e.target.files || e.target.files.length === 0) return;
                      const file = e.target.files[0];
                      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                      if (!isPdf) {
                        toast.error('Hanya file PDF yang didukung.');
                        e.target.value = '';
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('File terlalu besar. Maksimum 5MB.');
                        e.target.value = '';
                        return;
                      }
                      const formDataObj = new FormData();
                      formDataObj.append('file', file);
                      formDataObj.append('document_type', 'resume');
                      
                      try {
                        const res = await api.post('/candidates/upload', formDataObj);
                        setFormData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, resume_url: res.file_url }
                        }));
                        toast.success('Resume berhasil diunggah');
                      } catch (err: any) {
                        toast.error(err.message || 'Gagal mengunggah resume');
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-3 w-full px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl group-hover:border-[#F26522]/50 group-hover:bg-gray-50 transition-all">
                    <Portfolio className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        {formData.profile.resume_url ? 'Ganti CV (Opsional)' : 'Unggah CV / Resume'}
                      </p>
                      <p className="text-[10px] text-gray-400">PDF saja — Maks 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              Bahasa Platform
            </h3>
            <div className="space-y-4">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
                className="w-full md:w-1/2 px-4 py-2.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900 font-medium"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={saving}>
              <TextRollButton text={saving ? 'Menyimpan...' : 'Simpan Profil'} variant="orange" size="md" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
