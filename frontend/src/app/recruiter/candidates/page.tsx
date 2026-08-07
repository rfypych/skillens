'use client';

import { Archive, CheckmarkOutline, CloseOutline, Filter, Idea, Search, Security, Warning } from '@carbon/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import clsx from 'clsx';
import TextRollButton from '@/components/TextRollButton';

interface AssessmentResult {
  overall_score: number | null;
  ai_cheating_detected: boolean;
  tab_switches: number;
  copy_paste_attempts: number;
  claim_vs_evidence_label: string | null;
}

interface Application {
  id: number;
  status: string;
  created_at: string;
  job?: { title: string };
  user?: { full_name: string; email: string } | null;
  assessment_results: AssessmentResult[];
}

const candidateName = (app: Application): string => app.user?.full_name || 'Kandidat Tamu';
const candidateEmail = (app: Application): string => app.user?.email || '';
const candidateInitials = (app: Application): string =>
  (candidateName(app).split(' ').map(n => n[0]).join('') || 'GT').slice(0, 2).toUpperCase();

export default function CandidatesPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/applications')
      .then(data => {
        if (Array.isArray(data)) setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = applications.filter(app =>
    candidateName(app).toLowerCase().includes(search.toLowerCase()) ||
    `APP-${app.id}`.toLowerCase().includes(search.toLowerCase()) ||
    (app.job?.title ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleArchive = async (id: number) => {
    if (!confirm('Arsipkan kandidat ini?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Gagal mengarsipkan');
    }
  };

  const getLabelStyle = (label: string | null, isCheat: boolean) => {
    if (isCheat || label === 'Likely Fabricated' || label === 'Fabricated')
      return 'bg-red-50 text-red-700 border-red-200';
    if (label === 'Hidden Gem')
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (label === 'Highly Validated')
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (label === 'Validated' || label === 'Solid Match')
      return 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
    return 'bg-amber-50 text-amber-800 border-amber-300';
  };

  return (
    <div className="w-full flex flex-col space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Daftar Kandidat</h1>
          <p className="text-gray-600 text-sm font-normal">Laporan bukti otentik dan evaluasi perilaku AI kandidat.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:bg-white transition-all"
            placeholder="Cari berdasarkan nama, ID, atau posisi..."
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-xs">
            <Filter className="w-4 h-4 text-[#F26522]" />
            Filter Kandidat
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider font-medium border-b border-gray-100">
                <th className="px-6 py-4">Kandidat</th>
                <th className="px-6 py-4">Posisi & Tanggal</th>
                <th className="px-6 py-4">Label AI</th>
                <th className="px-6 py-4">Skor Bukti</th>
                <th className="px-6 py-4 w-1/4">Telemetri Peringatan</th>
                <th className="px-6 py-4 text-right">Laporan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm font-medium">Memuat data kandidat...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm font-medium">Tidak ada kandidat ditemukan.</td></tr>
              )}
              {filtered.map((app, index) => {
                const latest = app.assessment_results?.[app.assessment_results.length - 1];
                const score = latest?.overall_score ?? null;
                const label = latest?.claim_vs_evidence_label ?? null;
                const isCheat = latest?.ai_cheating_detected ?? false;
                const tabSwitches = latest?.tab_switches ?? 0;
                const pastes = latest?.copy_paste_attempts ?? 0;
                const displayLabel = isCheat ? 'Terindikasi Kecurangan' : label ?? 'Menunggu';

                const telemetryClean = !isCheat && tabSwitches <= 2 && pastes === 0;
                const telemetryText = isCheat
                  ? 'Kode hasil AI ditempel'
                  : tabSwitches > 5 ? `Perpindahan tab tinggi (${tabSwitches}x)` : 
                    pastes > 0 ? `${pastes} peristiwa paste terdeteksi` : 'Bersih';

                return (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="hover:bg-gray-50/80 transition-colors group text-sm"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {candidateInitials(app)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{candidateName(app)}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">APP-{app.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{app.job?.title ?? 'N/A'}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {new Date(app.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getLabelStyle(label, isCheat)}`}>
                        {displayLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900 w-6">{score !== null ? score.toFixed(0) : '-'}</span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[100px] overflow-hidden">
                          {score !== null && (
                            <div
                              className={clsx('h-1.5 rounded-full', score >= 80 ? 'bg-[#F26522]' : score >= 60 ? 'bg-teal-600' : 'bg-red-500')}
                              style={{ width: `${score}%` }}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {telemetryClean ? (
                        <span className="text-gray-600 flex items-center gap-1 text-xs font-normal">
                          <CheckmarkOutline className="w-3.5 h-3.5 text-emerald-600" />
                          Bersih
                        </span>
                      ) : (
                        <span className="text-red-700 flex items-start gap-1 text-xs font-semibold">
                          <Security className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          {telemetryText}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleArchive(app.id)}
                          className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                          title="Arsipkan"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <Link href={`/recruiter/candidates/${app.id}`}>
                          <TextRollButton
                            text="Laporan"
                            variant="dark"
                            size="sm"
                          />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-normal">
          <span>Menampilkan {filtered.length} dari {applications.length} kandidat</span>
        </div>
      </div>
    </div>
  );
}
