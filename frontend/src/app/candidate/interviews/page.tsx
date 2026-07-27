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
  Location,
  Warning,
  Star,
} from '@carbon/icons-react';
import TextRollButton from '@/components/TextRollButton';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  rejected: 'bg-red-50 text-red-700 border-red-200 font-semibold',
  completed: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
};

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<number | null>(null);

  const fetchInterviews = useCallback(async () => {
    try {
      const data = await api.get('/interviews/my');
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

  const handleRespond = async (interviewId: number, action: 'accept' | 'reject') => {
    setResponding(interviewId);
    try {
      await api.put(`/interviews/${interviewId}/respond?action=${action}`);
      toast.success(action === 'accept' ? 'Undangan wawancara diterima!' : 'Undangan wawancara ditolak.');
      fetchInterviews();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menanggapi');
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <Toaster position="top-right" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-1">
          Undangan Wawancara
        </h1>
        <p className="text-gray-600 text-sm font-normal">
          Tinjau dan tanggapi undangan sesi wawancara Anda di bawah ini.
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white text-center">
          <Calendar className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-900 font-bold">Belum ada undangan wawancara.</p>
          <p className="text-gray-500 text-sm mt-1 font-normal">
            Setelah tim HR menjadwalkan wawancara, undangan akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((iv, i) => (
            <motion.div
              key={iv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-gray-200/80 p-6 rounded-2xl shadow-xs space-y-4"
            >
              {/* Status badge */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[iv.status] || ''}`}>
                  {iv.status === 'pending' && <Time className="w-3.5 h-3.5" />}
                  {iv.status === 'accepted' && <CheckmarkOutline className="w-3.5 h-3.5" />}
                  {iv.status === 'rejected' && <CloseOutline className="w-3.5 h-3.5" />}
                  {iv.status === 'completed' && <Star className="w-3.5 h-3.5" />}
                  {iv.status}
                </span>
                <span className="text-xs text-gray-400 font-mono font-medium">Lamaran #{iv.application_id}</span>
              </div>

              {/* Interview details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <Calendar className="w-4 h-4 text-[#F26522]" />
                  {new Date(iv.scheduled_at).toLocaleString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                {iv.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Location className="w-4 h-4 text-[#F26522]" />
                    {iv.location}
                  </div>
                )}
                {iv.notes && (
                  <div className="flex items-start gap-2 text-sm text-gray-500 italic">
                    <Warning className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>"{iv.notes}"</span>
                  </div>
                )}
              </div>

              {/* Action buttons for pending */}
              {iv.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleRespond(iv.id, 'accept')}
                    disabled={responding === iv.id}
                  >
                    <TextRollButton text="Terima Wawancara" variant="orange" size="sm" />
                  </button>
                  <button
                    onClick={() => handleRespond(iv.id, 'reject')}
                    disabled={responding === iv.id}
                    className="px-5 py-2 border border-red-200 text-red-600 font-semibold text-xs rounded-full hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    Tolak Undangan
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
