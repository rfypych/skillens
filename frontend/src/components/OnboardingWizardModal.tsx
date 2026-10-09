'use client';

import { useState } from 'react';
import {
  RiBuildingLine,
  RiCheckDoubleLine,
  RiCloseLine,
  RiFileUploadLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from '@remixicon/react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Input } from '@/components/base/input/input';
import { cx } from '@/utils/cx';

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

const nativeAreaClass =
  'w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary outline-none transition-colors placeholder:text-text-placeholder hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring';

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

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('onboarding_wizard_dismissed', 'true');
    }
    onComplete();
  };

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
      toast.success('CV / Resume berhasil diunggah');
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

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_wizard_dismissed', 'true');
      }
      window.dispatchEvent(new Event('user-profile-updated'));
      toast.success('Setup data profil selesai');
      onComplete();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const stepHeader = (
    done: boolean,
    num: number,
    title: string,
    open: boolean,
    onOpen: () => void,
  ) => (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={open}
      className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left outline-none transition-colors hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
    >
      <span className="flex items-center gap-3">
        {done ? (
          <RiCheckDoubleLine className="size-5 shrink-0 text-accent-600" aria-hidden />
        ) : (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-border-button-default text-caption-1-semibold text-text-tertiary">
            {num}
          </span>
        )}
        <span className={cx('text-body-medium', done ? 'text-text-primary' : 'text-text-secondary')}>
          {title}
        </span>
      </span>
      {open ? (
        <RiArrowUpSLine className="size-5 text-foreground-icon-tertiary" aria-hidden />
      ) : (
        <RiArrowDownSLine className="size-5 text-foreground-icon-tertiary" aria-hidden />
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-app">
      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default text-text-primary shadow-dropdown">
        <div className="flex items-center justify-between border-b border-separator-border px-6 py-5">
          <h2 className="text-title-3-semibold text-text-primary">
            {userRole === 'candidate' ? 'Setup Data Profil dan CV' : 'Setup Profil Rekruiter'}
          </h2>
          <IconButton icon={RiCloseLine} size="small" aria-label="Tutup" onClick={dismiss} />
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-6">
          <div className="overflow-hidden rounded-2xl border border-border-button-default">
            {stepHeader(isStep1Complete, 1, 'Informasi Dasar dan Pengalaman', activeStep === 1, () => setActiveStep(1))}

            {activeStep === 1 && (
              <div className="flex flex-col gap-4 border-t border-separator-border bg-background-primary-default p-5">
                <Input
                  label="Nama Lengkap *"
                  placeholder="Masukkan nama lengkap Anda…"
                  value={fullName}
                  onChange={setFullName}
                />

                {userRole === 'candidate' ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ob-bio" className="text-body-medium text-text-primary">Bio Singkat</label>
                      <textarea
                        id="ob-bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Ringkasan singkat latar belakang dan minat profesional Anda…"
                        rows={3}
                        className={cx(nativeAreaClass, 'resize-none')}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ob-exp" className="text-body-medium text-text-primary">Ringkasan Pengalaman Kerja</label>
                      <textarea
                        id="ob-exp"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Contoh: 3 tahun di TechCorp (Backend), 2 tahun di Startup Inc (Fullstack)…"
                        rows={4}
                        className={cx(nativeAreaClass, 'resize-y')}
                      />
                    </div>
                  </>
                ) : (
                  <Input
                    label="Nama Perusahaan / Organisasi"
                    placeholder="Masukkan nama perusahaan Anda…"
                    value={companyName}
                    onChange={setCompanyName}
                    leadingIcon={RiBuildingLine}
                  />
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => {
                      if (!fullName.trim()) {
                        toast.error('Silakan isi Nama Lengkap terlebih dahulu');
                        return;
                      }
                      setActiveStep(2);
                    }}
                  >
                    Lanjut ke Upload CV
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border-button-default">
            {stepHeader(isStep2Complete, 2, userRole === 'candidate' ? 'Unggah CV / Resume' : 'Detail Tambahan', activeStep === 2, () => setActiveStep(2))}

            {activeStep === 2 && (
              <div className="flex flex-col gap-4 border-t border-separator-border bg-background-primary-default p-5">
                {userRole === 'candidate' ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-body-medium text-text-primary">File CV / Resume (PDF / DOCX) *</span>
                    <div className="rounded-2xl border-2 border-dashed border-border-button-default bg-background-secondary-default p-6 text-center transition-colors hover:border-border-button-hover">
                      <RiFileUploadLine className="mx-auto mb-2 size-7 text-foreground-icon-tertiary" aria-hidden />
                      <p className="text-body-medium text-text-primary">
                        {uploading ? 'Mengunggah file…' : 'Pilih File Resume'}
                      </p>
                      <p className="mt-1 text-body-regular text-text-tertiary">PDF, DOC, DOCX (Maks 5MB)</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        aria-label="Pilih file resume"
                        className="mt-3 block w-full cursor-pointer text-body-regular text-text-secondary file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-accent-500 file:px-4 file:py-2 file:text-body-medium file:text-white hover:file:bg-accent-600"
                      />
                    </div>

                    {resumeUrl && (
                      <div className="flex items-center justify-between rounded-2xl bg-status-lime-background p-3 text-body-regular text-status-lime-text">
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <RiCheckDoubleLine className="size-4 shrink-0" aria-hidden />
                          <span className="max-w-[200px] truncate">
                            {resumeFileName || 'CV Terpasang'}
                          </span>
                        </span>
                        <Chip variant="caption" color="lime">Terpasang</Chip>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-body-regular leading-relaxed text-text-secondary">
                    Data profil rekruiter akan digunakan untuk menyesuaikan peran pekerjaan yang Anda publikasikan di Skillens Platform.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-separator-border bg-background-secondary-default px-6 py-4">
          <Button variant="secondary" size="small" onClick={dismiss}>
            Nanti Saja
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="small" onClick={dismiss}>
              Batal
            </Button>
            <Button variant="primary" size="small" onClick={() => handleSubmit()} disabled={saving || uploading}>
              {saving ? 'Menyimpan…' : 'Simpan dan Masuk'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
