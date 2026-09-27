'use client';

import { RiArrowLeftLine, RiBriefcaseLine, RiCheckLine, RiFileTextLine, RiMailLine, RiUserLine } from '@remixicon/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Textarea } from '@/components/base/textarea/textarea';
import { Select, SelectItem } from '@/components/base/select/select';

export default function CandidateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { language, setLanguage } = useLanguage();

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
      toast.success('Profil berhasil diperbarui');
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12">
      <div className="h-20 animate-pulse rounded-3xl bg-background-tertiary-default" />
      <div className="h-96 animate-pulse rounded-3xl border border-border-button-default bg-background-primary-default p-8" />
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <Toaster position="top-right" />

      <div>
        <Link href="/candidate/dashboard" className="mb-4 inline-flex items-center gap-2 text-body-medium text-text-secondary transition-colors hover:text-text-primary">
          <RiArrowLeftLine className="size-4" aria-hidden />
          Kembali ke Dasbor
        </Link>
        
        <p className="text-body-regular text-text-secondary">Kelola informasi pribadi dan ringkasan resume Anda.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
        <form onSubmit={handleSave} className="space-y-8 p-6 sm:p-8">
          {/* Basic Info */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 border-b border-separator-border pb-3 text-title-3-semibold text-text-primary">
              <RiUserLine className="size-5 text-accent-500" aria-hidden />
              Informasi Dasar
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Nama Lengkap"
                value={formData.full_name}
                onChange={(v) => setFormData({ ...formData, full_name: v })}
              />
              <Input
                label="Alamat Email"
                value={formData.email}
                isDisabled
                leadingIcon={RiMailLine}
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 border-b border-separator-border pb-3 text-title-3-semibold text-text-primary">
              <RiFileTextLine className="size-5 text-accent-500" aria-hidden />
              Detail Profesional dan Resume
            </h3>
            <div className="space-y-4">
              <Textarea
                label="Bio Singkat"
                value={formData.profile.bio}
                onChange={(v) => setFormData({ ...formData, profile: { ...formData.profile, bio: v } })}
                placeholder="Saya adalah software engineer yang berfokus pada pengembangan aplikasi AI skala besar..."
                rows={3}
              />
              <Textarea
                label="Ringkasan Pengalaman Kerja"
                value={formData.profile.experience}
                onChange={(v) => setFormData({ ...formData, profile: { ...formData.profile, experience: v } })}
                placeholder="5 tahun di TechCorp (Backend), 2 tahun di Startup Inc (Fullstack)..."
                rows={4}
              />
              <div>
                <span className="mb-1.5 block text-body-medium text-text-primary">CV / Resume</span>

                {/* Current stored CV indicator */}
                {formData.profile.resume_url && (
                  <div className="mb-3 flex items-center justify-between rounded-2xl border border-border-button-default bg-background-secondary-default p-3.5">
                    <div className="flex items-center gap-2.5">
                      <RiCheckLine className="size-4 shrink-0 text-accent-600" aria-hidden />
                      <div>
                        <p className="text-body-medium text-text-primary">CV Tersimpan</p>
                        <p className="max-w-[200px] truncate font-mono text-caption-1-medium text-text-secondary">
                          {formData.profile.resume_url.split('/').pop()}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL || '/api'}${formData.profile.resume_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-medium text-accent-600 underline"
                    >
                      Lihat
                    </a>
                  </div>
                )}

                {/* Upload new CV */}
                <div className="group relative">
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
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-border-button-default bg-background-primary-default px-4 py-3 transition-all group-hover:border-accent-500 group-hover:bg-background-secondary-default">
                    <RiBriefcaseLine className="size-4 text-foreground-icon-secondary" aria-hidden />
                    <div>
                      <p className="text-body-medium text-text-primary">
                        {formData.profile.resume_url ? 'Ganti CV (Opsional)' : 'Unggah CV / Resume'}
                      </p>
                      <p className="text-caption-1-medium text-text-tertiary">PDF saja - Maks 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="mb-4 border-b border-separator-border pb-3 text-title-3-semibold text-text-primary">
              Bahasa Platform
            </h3>
            <div className="w-full md:w-1/2">
              <Select
                aria-label="Bahasa platform"
                selectedKey={language}
                onSelectionChange={(k) => setLanguage(String(k) as 'en' | 'id')}
              >
                <SelectItem id="id">Bahasa Indonesia</SelectItem>
                <SelectItem id="en">English</SelectItem>
              </Select>
            </div>
          </div>

          <div className="flex justify-end border-t border-separator-border pt-6">
            <Button type="submit" variant="primary" size="medium" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
