'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  RiAddFill,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiMapPinLine,
  RiStarFill,
  RiTimeLine,
} from '@remixicon/react';
import { api } from '@/lib/api';
import { toast, Toaster } from 'react-hot-toast';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { Input } from '@/components/base/input/input';

const STATUS_CHIP: Record<string, 'yellow' | 'lime' | 'rose' | 'blue'> = {
  pending: 'yellow',
  accepted: 'lime',
  rejected: 'rose',
  completed: 'blue',
};

const STATUS_ICON = {
  pending: RiTimeLine,
  accepted: RiCheckLine,
  rejected: RiCloseLine,
  completed: RiStarFill,
} as const;

const nativeFieldClass =
  'w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary outline-none transition-colors placeholder:text-text-placeholder hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring';

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
      toast.success('Skor berhasil dikirim');
      setScoringId(null);
      fetchInterviews();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirimkan skor');
    }
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="flex w-full flex-col gap-4">
      <Toaster position="top-right" />

      <div className="flex flex-col gap-1 px-1">
        
        <p className="text-body-medium text-text-secondary">Jadwalkan sesi wawancara dan berikan penilaian pasca-wawancara kandidat.</p>
      </div>

      <section className="flex w-full flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card sm:p-5">
        <h3 className="inline-flex items-center gap-2 text-body-1-medium text-text-primary">
          <RiCalendarLine className="size-5 text-foreground-icon-secondary" aria-hidden />
          Jadwalkan Sesi Wawancara Baru
        </h3>
        <form onSubmit={handleSchedule} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="iv-app-id" className="text-caption-1-semibold text-text-secondary">
              ID lamaran <span className="text-text-error-primary">*</span>
            </label>
            <input
              id="iv-app-id"
              type="number"
              value={schedulingAppId}
              onChange={e => setSchedulingAppId(e.target.value)}
              placeholder="Contoh: 42"
              className={nativeFieldClass}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="iv-when" className="text-caption-1-semibold text-text-secondary">
              Tanggal dan Waktu <span className="text-text-error-primary">*</span>
            </label>
            <input
              id="iv-when"
              type="datetime-local"
              value={scheduledAt}
              min={minDate}
              onChange={e => setScheduledAt(e.target.value)}
              className={nativeFieldClass}
              required
            />
          </div>
          <Input
            label="Lokasi / Tautan Video Meet"
            placeholder="Contoh: Google Meet link atau Ruang A"
            value={schedLocation}
            onChange={setSchedLocation}
          />
          <Input
            label="Catatan Untuk Kandidat"
            placeholder="Contoh: Siapkan ringkasan arsitektur sistem"
            value={schedNotes}
            onChange={setSchedNotes}
          />
          <div className="flex justify-end md:col-span-2">
            <Button variant="primary" size="medium" leadingIcon={RiAddFill} type="submit" disabled={isScheduling}>
              {isScheduling ? 'Menjadwalkan…' : 'Jadwalkan Wawancara'}
            </Button>
          </div>
        </form>
      </section>

      <div className="flex flex-col gap-3">
        <h3 className="px-1 text-body-1-medium text-text-primary">Daftar Wawancara Terjadwal</h3>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 animate-pulse rounded-3xl bg-background-secondary-default" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border-button-default bg-background-primary-default px-6 py-14 text-center">
            <RiCalendarLine className="size-10 text-foreground-icon-quaternary" aria-hidden />
            <p className="text-body-medium text-text-secondary">Belum ada wawancara yang dijadwalkan.</p>
          </div>
        ) : (
          interviews.map((iv) => {
            const StatusIcon = STATUS_ICON[iv.status as keyof typeof STATUS_ICON] ?? RiTimeLine;
            return (
              <section
                key={iv.id}
                className="flex w-full flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-body-medium tabular-nums text-text-primary">Lamaran #{iv.application_id}</span>
                    <Chip variant="bold" color={STATUS_CHIP[iv.status] ?? 'neutral'}>
                      <span className="inline-flex items-center gap-1">
                        <StatusIcon className="size-3.5" aria-hidden />{iv.status}
                      </span>
                    </Chip>
                    {iv.interview_score !== null && iv.interview_score !== undefined && (
                      <Chip variant="bold" color="orange">
                        <span className="inline-flex items-center gap-1">
                          <RiStarFill className="size-3.5" aria-hidden />Skor: {iv.interview_score}/100
                        </span>
                      </Chip>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-regular text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <RiCalendarLine className="size-4" aria-hidden />
                      {new Date(iv.scheduled_at).toLocaleString()}
                    </span>
                    {iv.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <RiMapPinLine className="size-4" aria-hidden />
                        {iv.location}
                      </span>
                    )}
                  </div>
                  {iv.notes && (
                    <p className="text-body-regular text-text-secondary italic">"{iv.notes}"</p>
                  )}
                </div>

                {iv.status === 'accepted' && (
                  <div className="shrink-0">
                    {scoringId === iv.id ? (
                      <div className="flex w-56 flex-col gap-2 rounded-2xl border border-border-button-default bg-background-secondary-default p-3">
                        <Input
                          aria-label="Skor wawancara 0 sampai 100"
                          placeholder="Skor (0-100)"
                          value={scoreInput[iv.id]?.score || ''}
                          onChange={(v) => setScoreInput(prev => ({ ...prev, [iv.id]: { score: v, notes: prev[iv.id]?.notes ?? '' } }))}
                        />
                        <Input
                          aria-label="Catatan skor"
                          placeholder="Catatan (opsional)"
                          value={scoreInput[iv.id]?.notes || ''}
                          onChange={(v) => setScoreInput(prev => ({ ...prev, [iv.id]: { score: prev[iv.id]?.score ?? '', notes: v } }))}
                        />
                        <div className="flex gap-2 pt-1">
                          <Button variant="primary" size="small" onClick={() => handleScore(iv.id)} className="flex-1">
                            Kirim
                          </Button>
                          <Button variant="secondary" size="small" onClick={() => setScoringId(null)} className="flex-1">
                            Batal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="secondary" size="small" onClick={() => setScoringId(iv.id)}>
                        Kirim Skor
                      </Button>
                    )}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
