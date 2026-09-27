'use client';

import { RiArrowLeftLine } from '@remixicon/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';

const areaCls =
  'block w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary outline-none transition-colors placeholder:text-text-placeholder hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring resize-none';

export default function EditJob() {
  const router = useRouter();
  const params = useParams();
  const _rawId = params.id;
  const id = Array.isArray(_rawId) ? _rawId[0] : _rawId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        toast.error('Gagal terhubung ke server.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataObj = {
        title: (e.target as any).title.value,
        expected_outcomes: (e.target as any).expected_outcomes.value,
        specific_skills: (e.target as any).specific_skills.value,
        compliance_criteria: (e.target as any).compliance_criteria.value,
        language: (e.target as any).language.value,
        location: (e.target as any).location.value,
        salary_range: (e.target as any).salary_range.value,
        job_type: (e.target as any).job_type.value,
      };
      await api.put(`/jobs/${id}`, formDataObj);

      toast.success('Posisi berhasil diperbarui!');
      setTimeout(() => router.push('/recruiter/jobs'), 1000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-accent-500 border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return <div className="p-10 text-center text-body-medium text-text-error-primary">Posisi tidak ditemukan.</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <Toaster position="top-right" />
      <div>
        <Link href="/recruiter/jobs" className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary outline-none transition-colors hover:text-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          <RiArrowLeftLine className="size-4" aria-hidden />
          Kembali ke Posisi Aktif
        </Link>
        <h1 className="mt-2 text-title-1-medium text-text-primary">
          Ubah Detail Posisi
        </h1>
        <p className="mt-1 text-body-medium text-text-secondary">
          Perbarui parameter posisi. Catatan: perubahan ini tidak me-regenerasi skenario simulasi AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="space-y-5 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Nama Posisi / Pekerjaan *"
              name="title"
              defaultValue={job.title}
              isRequired
              placeholder="Contoh: Senior Fullstack Engineer"
            />

            <div className="flex flex-col gap-1.5">
              <span className="text-body-medium text-text-primary">Bahasa Wawancara AI *</span>
              <Select aria-label="Bahasa wawancara AI" name="language" defaultSelectedKey={job.language}>
                <SelectItem id="English">English</SelectItem>
                <SelectItem id="Indonesian">Indonesian</SelectItem>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Input
              label="Lokasi Kerja *"
              name="location"
              defaultValue={job.location}
              isRequired
              placeholder="Contoh: Jakarta (Hybrid / Remote)"
            />
            <Input
              label="Rentang Gaji *"
              name="salary_range"
              defaultValue={job.salary_range}
              isRequired
              placeholder="Contoh: Rp 18-30 juta"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-body-medium text-text-primary">Tipe Pekerjaan *</span>
              <Select aria-label="Tipe pekerjaan" name="job_type" defaultSelectedKey={job.job_type}>
                <SelectItem id="Full-time">Full-time (Penuh Waktu)</SelectItem>
                <SelectItem id="Contract">Contract (Kontrak)</SelectItem>
                <SelectItem id="Internship">Internship (Magang)</SelectItem>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-expected-outcomes" className="text-body-medium text-text-primary">Hasil yang Diharapkan (6-12 Bulan) *</label>
            <textarea
              id="edit-expected-outcomes"
              required name="expected_outcomes" rows={2}
              defaultValue={job.expected_outcomes}
              className={areaCls}
              placeholder="Contoh: Menghasilkan arsitektur solusi yang scalable dan maintainable..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-specific-skills" className="text-body-medium text-text-primary">Keahlian Spesifik yang Dibutuhkan *</label>
            <textarea
              id="edit-specific-skills"
              required name="specific_skills" rows={2}
              defaultValue={job.specific_skills}
              className={areaCls}
              placeholder="Contoh: System Design, Python, React..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-compliance" className="text-body-medium text-text-primary">Kriteria Kepatuhan dan Non-Negosiable</label>
            <textarea
              id="edit-compliance"
              name="compliance_criteria" rows={2}
              defaultValue={job.compliance_criteria ?? ''}
              className={areaCls}
              placeholder="Contoh: Minimal 3 tahun pengalaman..."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="medium"
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
