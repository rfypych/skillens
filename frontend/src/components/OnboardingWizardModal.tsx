'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckmarkFilled,
  ChevronDown,
  ChevronUp,
  Close,
  Document,
  Upload,
  User,
  Building,
} from '@carbon/icons-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

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
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [fullName, setFullName] = useState(initialData?.full_name || '');
  const [bio, setBio] = useState(initialData?.profile?.bio || '');
  const [experience, setExperience] = useState(initialData?.profile?.experience || '');
  const [companyName, setCompanyName] = useState(initialData?.profile?.company_name || '');
  const [resumeUrl, setResumeUrl] = useState(initialData?.profile?.resume_url || '');
  const [resumeFileName, setResumeFileName] = useState(
    initialData?.profile?.resume_url ? initialData.profile.resume_url.split('/').pop() : ''
  );

  if (!isOpen) return null;

  const isStep1Complete = !!fullName.trim();
  const isStep2Complete = userRole === 'candidate' ? !!resumeUrl : !!companyName.trim();

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Silakan isi Nama Lengkap Anda');
      setActiveStep(1);
      return;
    }

    if (userRole === 'candidate' && !resumeUrl) {
      toast.error('Silakan unggah CV / Resume Anda terlebih dahulu');
      setActiveStep(2);
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/me', {
        full_name: fullName.trim(),
        profile: {
          bio: bio.trim(),
          experience: experience.trim(),
          resume_url: resumeUrl,
          company_name: companyName.trim(),
        },
      });

      // Mark as dismissed BEFORE dispatching event so fetchUser won't re-open wizard
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_wizard_dismissed', 'true');
      }
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="bg-white rounded-[2rem] border border-gray-200/90 shadow-2xl max-w-lg w-full overflow-hidden text-gray-900"
        >
          {/* Header Bar */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              {userRole === 'candidate' ? 'Setup Data Profil & CV' : 'Setup Profil Rekruiter'}
            </h2>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('onboarding_wizard_dismissed', 'true');
                }
                onComplete();
              }}
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Close className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* ── STEP 1 ACCORDION ITEM ── */}
            <div className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="w-full px-5 py-4 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {isStep1Complete ? (
                    <CheckmarkFilled className="w-5 h-5 text-[#F26522] flex-shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                      1
                    </span>
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      isStep1Complete ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Informasi Dasar & Pengalaman
                  </span>
                </div>
                {activeStep === 1 ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {activeStep === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 border-t border-gray-100 bg-white space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Masukkan nama lengkap Anda..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900"
                      />
                    </div>

                    {userRole === 'candidate' ? (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Bio Singkat
                          </label>
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Ringkasan singkat latar belakang dan minat profesional Anda..."
                            className="w-full h-20 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900 resize-none font-normal"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Ringkasan Pengalaman Kerja
                          </label>
                          <textarea
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="Contoh: 3 tahun di TechCorp (Backend), 2 tahun di Startup Inc (Fullstack)..."
                            className="w-full h-24 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900 resize-y font-normal"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nama Perusahaan / Organisasi
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Masukkan nama perusahaan Anda..."
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm text-gray-900"
                        />
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!fullName.trim()) {
                            toast.error('Silakan isi Nama Lengkap terlebih dahulu');
                            return;
                          }
                          setActiveStep(2);
                        }}
                        className="px-5 py-2 bg-[#F26522] hover:bg-[#d85415] text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        Lanjut ke Upload CV →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── STEP 2 ACCORDION ITEM ── */}
            <div className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full px-5 py-4 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {isStep2Complete ? (
                    <CheckmarkFilled className="w-5 h-5 text-[#F26522] flex-shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                      2
                    </span>
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      isStep2Complete ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {userRole === 'candidate' ? 'Unggah CV / Resume' : 'Detail Tambahan'}
                  </span>
                </div>
                {activeStep === 2 ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {activeStep === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 border-t border-gray-100 bg-white space-y-4"
                  >
                    {userRole === 'candidate' ? (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          File CV / Resume (PDF / DOCX) *
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#F26522] transition-colors bg-gray-50/50">
                          <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-700">
                            {uploading ? 'Mengunggah file...' : 'Pilih File Resume'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Maks 5MB)</p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="mt-3 block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#F26522] file:text-white hover:file:bg-[#d85415] cursor-pointer"
                          />
                        </div>

                        {resumeUrl && (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-medium">
                            <span className="truncate max-w-[200px]">
                              ✓ {resumeFileName || 'CV Terpasang'}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                              TERPASANG
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Data profil rekruiter akan digunakan untuk menyesuaikan peran pekerjaan yang Anda publikasikan di Skillens Platform.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('onboarding_wizard_dismissed', 'true');
                }
                onComplete();
              }}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5"
            >
              Nanti Saja
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('onboarding_wizard_dismissed', 'true');
                  }
                  onComplete();
                }}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={saving || uploading}
                className="px-5 py-2 bg-[#F26522] hover:bg-[#d85415] text-white text-xs font-semibold rounded-full transition-colors disabled:opacity-50 shadow-xs"
              >
                {saving ? 'Menyimpan...' : 'Simpan & Masuk'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
