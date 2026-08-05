'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, User, CheckmarkOutline, Upload, Building } from '@carbon/icons-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import TextRollButton from '@/components/TextRollButton';

interface OnboardingWizardProps {
  isOpen: boolean;
  userRole: 'candidate' | 'recruiter' | 'admin';
  initialData?: {
    full_name?: string;
    email?: string;
    profile?: {
      bio?: string;
      experience?: string;
      resume_url?: string;
      company_name?: string;
    };
  };
  onComplete: () => void;
}

export default function OnboardingWizardModal({
  isOpen,
  userRole,
  initialData,
  onComplete,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [fullName, setFullName] = useState(initialData?.full_name || '');
  const [bio, setBio] = useState(initialData?.profile?.bio || '');
  const [companyName, setCompanyName] = useState(initialData?.profile?.company_name || '');
  const [resumeUrl, setResumeUrl] = useState(initialData?.profile?.resume_url || '');
  const [resumeFileName, setResumeFileName] = useState(
    initialData?.profile?.resume_url ? initialData.profile.resume_url.split('/').pop() : ''
  );

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', 'resume');

    try {
      const res = await api.post('/candidates/upload', formData);
      setResumeUrl(res.file_url);
      setResumeFileName(file.name);
      toast.success('CV / Resume berhasil diunggah!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunggah CV');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Silakan isi Nama Lengkap Anda');
      return;
    }

    if (userRole === 'candidate' && !resumeUrl) {
      toast.error('Silakan unggah CV / Resume Anda terlebih dahulu');
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/me', {
        full_name: fullName.trim(),
        profile: {
          bio: bio.trim(),
          resume_url: resumeUrl,
          company_name: companyName.trim(),
        },
      });

      window.dispatchEvent(new Event('user-profile-updated'));
      toast.success('Setup data profil selesai!');
      onComplete();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden font-sans"
        >
          {/* Header Banner */}
          <div className="bg-[#0F172A] p-6 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[11px] font-mono tracking-widest text-[#F26522] uppercase font-bold">
                SETUP PROFIL PERTAMA KALI
              </span>
              <h2 className="text-2xl font-semibold tracking-tight mt-1 text-white">
                {userRole === 'candidate' ? 'Lengkapi Data Diri & CV' : 'Lengkapi Profil Rekruiter'}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                {userRole === 'candidate'
                  ? 'CV Anda akan otomatis terpasang saat melamar tanpa perlu upload berulang kali.'
                  : 'Lengkapi informasi Anda untuk memulai pengelolaan pekerjaan dan evaluasi kandidat.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {userRole === 'candidate' ? (
              <>
                {step === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#F26522]" /> Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Alex Pratama"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Bio / Ringkasan Singkat
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Frontend Engineer berpengalaman 3 tahun di React & TypeScript..."
                        className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900 resize-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!fullName.trim()) {
                          toast.error('Silakan isi Nama Lengkap terlebih dahulu');
                          return;
                        }
                        setStep(2);
                      }}
                      className="w-full mt-2"
                    >
                      <TextRollButton text="Lanjut ke Upload CV →" variant="dark" size="md" className="w-full justify-center" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Document className="w-4 h-4 text-[#F26522]" /> Unggah CV / Resume (PDF / DOCX) *
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#F26522] transition-colors bg-gray-50/50">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">
                          {uploading ? 'Mengunggah CV...' : 'Pilih file CV / Resume'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Format: PDF, DOC, DOCX (Maks 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="mt-3 block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#F26522] file:text-white hover:file:bg-[#d85415] cursor-pointer"
                        />
                      </div>

                      {resumeUrl && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-medium">
                          <span className="flex items-center gap-2 truncate">
                            <CheckmarkOutline className="w-4 h-4 text-emerald-600" />
                            {resumeFileName || 'CV Terpasang'}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-bold">TERPASANG</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors px-4 py-2"
                      >
                        ← Kembali
                      </button>
                      <button type="submit" disabled={saving || uploading}>
                        <TextRollButton
                          text={saving ? 'Menyimpan...' : 'Selesaikan Setup & Masuk'}
                          variant="orange"
                          size="md"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#F26522]" /> Nama Lengkap Rekruiter *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Sarah Wijaya"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#F26522]" /> Nama Perusahaan / Perusahaan
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: TechCorp Indonesia"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button type="submit" disabled={saving}>
                    <TextRollButton
                      text={saving ? 'Menyimpan...' : 'Simpan Profil Rekruiter'}
                      variant="orange"
                      size="md"
                    />
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
