'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import TextRollButton from '@/components/TextRollButton';

const inputCls =
  'block w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white text-sm text-gray-900 font-medium placeholder-gray-400';
const areaCls =
  'block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white text-sm text-gray-900 font-medium placeholder-gray-400 resize-none';
const labelCls =
  'block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider';

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return <div className="p-10 text-center text-red-500 text-sm font-medium">Posisi tidak ditemukan.</div>;
  }

  return (
    <div className="w-full font-sans">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/recruiter/jobs" className="text-xs font-semibold text-gray-500 hover:text-[#F26522] transition-colors">
          &larr; Kembali ke Posisi Aktif
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mt-2">
          Ubah Detail Posisi
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Perbarui parameter posisi. Catatan: perubahan ini tidak me-regenerasi skenario simulasi AI.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6 sm:p-8 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Nama Posisi / Pekerjaan *</label>
              <input
                required
                name="title"
                type="text"
                defaultValue={job.title}
                className={inputCls}
                placeholder="Contoh: Senior Fullstack Engineer"
              />
            </div>

            <div>
              <label className={labelCls}>Bahasa Wawancara AI *</label>
              <select name="language" defaultValue={job.language} className={inputCls}>
                <option value="English">English</option>
                <option value="Indonesian">Indonesian</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Lokasi Kerja *</label>
              <input required name="location" type="text" defaultValue={job.location} className={inputCls} placeholder="Contoh: Jakarta (Hybrid / Remote)" />
            </div>
            <div>
              <label className={labelCls}>Rentang Gaji *</label>
              <input required name="salary_range" type="text" defaultValue={job.salary_range} className={inputCls} placeholder="Contoh: Rp 18–30 juta" />
            </div>
            <div>
              <label className={labelCls}>Tipe Pekerjaan *</label>
              <select name="job_type" defaultValue={job.job_type} className={inputCls}>
                <option value="Full-time">Full-time (Penuh Waktu)</option>
                <option value="Contract">Contract (Kontrak)</option>
                <option value="Internship">Internship (Magang)</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Hasil yang Diharapkan (6–12 Bulan) *</label>
            <textarea
              required name="expected_outcomes" rows={2}
              defaultValue={job.expected_outcomes}
              className={areaCls}
              placeholder="Contoh: Menghasilkan arsitektur solusi yang scalable dan maintainable..."
            />
          </div>

          <div>
            <label className={labelCls}>Keahlian Spesifik yang Dibutuhkan *</label>
            <textarea
              required name="specific_skills" rows={2}
              defaultValue={job.specific_skills}
              className={areaCls}
              placeholder="Contoh: System Design, Python, React..."
            />
          </div>

          <div>
            <label className={labelCls}>Kriteria Kepatuhan & Non-Negosiable</label>
            <textarea
              name="compliance_criteria" rows={2}
              defaultValue={job.compliance_criteria ?? ''}
              className={areaCls}
              placeholder="Contoh: Minimal 3 tahun pengalaman..."
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end items-center gap-3 mt-6"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Batal
          </button>
          <TextRollButton
            text={isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            variant="orange"
            size="lg"
            type="submit"
            disabled={isSubmitting}
            className="justify-between"
          />
        </motion.div>
      </form>
    </div>
  );
}
