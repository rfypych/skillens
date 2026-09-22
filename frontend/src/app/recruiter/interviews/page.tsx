'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { toast, Toaster } from 'react-hot-toast';
import {
  Calendar,
  CheckmarkOutline,
  CloseOutline,
  Time,
  Star,
  Location,
  Warning,
} from '@carbon/icons-react';
import TextRollButton from '@/components/TextRollButton';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  rejected: 'bg-red-50 text-red-700 border-red-200 font-semibold',
  completed: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Time className="w-3.5 h-3.5" />,
  accepted: <CheckmarkOutline className="w-3.5 h-3.5" />,
  rejected: <CloseOutline className="w-3.5 h-3.5" />,
  completed: <Star className="w-3.5 h-3.5" />,
};

export default function RecruiterInterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoringId, setScoringId] = useState<number | null>(null);
  const [scoreInput, setScoreInput] = useState<Record<number, { score: string; notes: string }>>({});
  const [schedulingAppId, setSchedulingAppId] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [schedLocation, setSchedLocation] = useState<string>('');
  const [schedNotes, setSchedNotes] = useState<string>('');
  const [isScheduling, setIsScheduling] = useState(false);

  const fetchInterviews = useCallback(async () => {
    try {
      const data = await api.get('/interviews/recruiter');
      setInterviews(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Gagal memuat daftar wawancara');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingAppId || !scheduledAt) return;
    setIsScheduling(true);
    try {
      await api.post('/interviews/', {
        application_id: parseInt(schedulingAppId),
        scheduled_at: new Date(scheduledAt).toISOString(),
        location: schedLocation || undefined,
        notes: schedNotes || undefined,
      });
      toast.success('Wawancara berhasil dijadwalkan! Kandidat telah diberi tahu.');
      setSchedulingAppId('');
      setScheduledAt('');
      setSchedLocation('');
      setSchedNotes('');
      fetchInterviews();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menjadwalkan wawancara');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleScore = async (interviewId: number) => {
    const { score, notes } = scoreInput[interviewId] || {};
    if (!score) return toast.error('Harap masukkan skor');
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      return toast.error('Skor harus antara 0 dan 100');
    }
    try {
      await api.put(`/interviews/${interviewId}/score`, {
        interview_score: numScore,
        score_notes: notes || undefined,
      });
      toast.success('Skor berhasil dikirim!');
      setScoringId(null);
      fetchInterviews();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirimkan skor');
    }
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="w-full space-y-10 font-sans">
      <Toaster position="top-right" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-1">
          Manajemen Wawancara
        </h1>
        <p className="text-gray-600 text-sm font-normal">Jadwalkan sesi wawancara dan berikan penilaian pasca-wawancara kandidat.</p>
      </motion.div>

      {/* Schedule New Interview */}
      <div className="bg-white border border-gray-200/80 p-8 rounded-2xl shadow-xs">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#F26522]" />
          Jadwalkan Sesi Wawancara Baru
        </h2>
        <form onSubmit={handleSchedule} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              ID Lamaran (Application ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={schedulingAppId}
              onChange={e => setSchedulingAppId(e.target.value)}
              placeholder="Contoh: 42"
              className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-xs font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
              Tanggal & Waktu <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              min={minDate}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-xs font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Lokasi / Tautan Video Meet</label>
            <input
              type="text"
              value={schedLocation}
              onChange={e => setSchedLocation(e.target.value)}
              placeholder="Contoh: Google Meet link atau Ruang A"
              className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-xs font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Catatan Untuk Kandidat</label>
            <input
              type="text"
              value={schedNotes}
              onChange={e => setSchedNotes(e.target.value)}
              placeholder="Contoh: Siapkan ringkasan arsitektur sistem"
              className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-xs font-medium"
            />
          </div>
          <div className="md:col-span-2 flex justify-end pt-2">
            <button type="submit" disabled={isScheduling}>
              <TextRollButton
                text={isScheduling ? 'Menjadwalkan...' : 'Jadwalkan Wawancara'}
                variant="orange"
                size="md"
              />
            </button>
          </div>
        </form>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Daftar Wawancara Terjadwal</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-white text-center">
            <Calendar className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">Belum ada wawancara yang dijadwalkan.</p>
          </div>
        ) : (
          interviews.map((iv, i) => (
            <motion.div
              key={iv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-200/80 p-6 rounded-2xl shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">
                      Lamaran #{iv.application_id}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[iv.status] || ''}`}>
                      {STATUS_ICONS[iv.status]} {iv.status}
                    </span>
                    {iv.interview_score !== null && iv.interview_score !== undefined && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#F26522] border border-orange-200">
                        <Star className="w-3.5 h-3.5" /> Skor: {iv.interview_score}/100
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-normal">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#F26522]" />
                      {new Date(iv.scheduled_at).toLocaleString()}
                    </span>
                    {iv.location && (
                      <span className="flex items-center gap-1.5">
                        <Location className="w-3.5 h-3.5 text-[#F26522]" />
                        {iv.location}
                      </span>
                    )}
                  </div>
                  {iv.notes && (
                    <p className="text-xs text-gray-600 italic">"{iv.notes}"</p>
                  )}
                </div>

                {/* Score Input */}
                {iv.status === 'accepted' && (
                  <div className="flex-shrink-0">
                    {scoringId === iv.id ? (
                      <div className="flex flex-col gap-2 p-4 border border-gray-200 bg-gray-50 rounded-2xl">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Skor (0-100)"
                          value={scoreInput[iv.id]?.score || ''}
                          onChange={e => setScoreInput(prev => ({ ...prev, [iv.id]: { ...prev[iv.id], score: e.target.value } }))}
                          className="w-40 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Catatan (opsional)"
                          value={scoreInput[iv.id]?.notes || ''}
                          onChange={e => setScoreInput(prev => ({ ...prev, [iv.id]: { ...prev[iv.id], notes: e.target.value } }))}
                          className="w-40 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleScore(iv.id)}
                            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-800"
                          >
                            Kirim
                          </button>
                          <button
                            onClick={() => setScoringId(null)}
                            className="px-3 py-1.5 border border-gray-200 text-xs font-semibold text-gray-600 rounded-full hover:bg-white"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setScoringId(iv.id)}
                      >
                        <TextRollButton text="Kirim Skor" variant="dark" size="sm" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
