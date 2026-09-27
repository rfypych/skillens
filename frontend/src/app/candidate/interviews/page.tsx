'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast, Toaster } from 'react-hot-toast';
import {
  RiAlertLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiMapPinLine,
  RiStarLine,
  RiTimeLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';

const STATUS_CHIP: Record<string, 'yellow' | 'lime' | 'rose' | 'blue'> = {
  pending: 'yellow',
  accepted: 'lime',
  rejected: 'rose',
  completed: 'blue',
};

const STATUS_ICON: Record<string, typeof RiTimeLine> = {
  pending: RiTimeLine,
  accepted: RiCheckLine,
  rejected: RiCloseLine,
  completed: RiStarLine,
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
      toast.success(action === 'accept' ? 'Undangan wawancara diterima.' : 'Undangan wawancara ditolak.');
      fetchInterviews();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menanggapi');
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Toaster position="top-right" />

      <div>

        <p className="text-body-regular text-text-secondary">
          Tinjau dan tanggapi undangan sesi wawancara Anda di bawah ini.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 animate-pulse rounded-3xl bg-background-tertiary-default" />)}
        </div>
      ) : interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border-button-default bg-background-primary-default px-6 py-20 text-center">
          <RiCalendarLine className="mb-4 size-12 text-foreground-icon-tertiary" aria-hidden />
          <p className="text-title-3-semibold text-text-primary">Belum ada undangan wawancara.</p>
          <p className="mt-1 text-body-regular text-text-secondary">
            Setelah tim HR menjadwalkan wawancara, undangan akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((iv) => {
            const StatusIcon = STATUS_ICON[iv.status] ?? RiTimeLine;
            return (
              <div
                key={iv.id}
                className="space-y-4 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card"
              >
                {/* Status badge */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Chip variant="bold" color={STATUS_CHIP[iv.status] ?? 'neutral'}>
                    <span className="inline-flex items-center gap-1.5">
                      <StatusIcon className="size-3.5" aria-hidden />
                      {iv.status}
                    </span>
                  </Chip>
                  <span className="font-mono text-caption-1-medium text-text-tertiary">Lamaran #{iv.application_id}</span>
                </div>

                {/* Interview details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-body-medium text-text-primary">
                    <RiCalendarLine className="size-4 text-accent-500" aria-hidden />
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
                    <div className="flex items-center gap-2 text-body-regular text-text-secondary">
                      <RiMapPinLine className="size-4 text-accent-500" aria-hidden />
                      {iv.location}
                    </div>
                  )}
                  {iv.notes && (
                    <div className="flex items-start gap-2 text-body-regular text-text-secondary italic">
                      <RiAlertLine className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>&quot;{iv.notes}&quot;</span>
                    </div>
                  )}
                </div>

                {/* Action buttons for pending */}
                {iv.status === 'pending' && (
                  <div className="flex gap-3 border-t border-separator-border pt-4">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleRespond(iv.id, 'accept')}
                      disabled={responding === iv.id}
                    >
                      Terima Wawancara
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleRespond(iv.id, 'reject')}
                      disabled={responding === iv.id}
                    >
                      Tolak Undangan
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
