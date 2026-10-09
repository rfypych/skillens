'use client';

import {
  RiAlertLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiFileTextLine,
  RiInformationLine,
  RiSendPlaneLine,
  RiShieldCheckLine,
  RiTimeLine,
} from '@remixicon/react';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import type { ChatMessage } from '@/types/api';
import { cx } from '@/utils/cx';
import { Button } from '@/components/base/buttons/button';
import { IconButton } from '@/components/base/buttons/icon-button';
import { Chip } from '@/components/base/badges/chip';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';

const NATIVE_TEXTAREA_CLASSES =
  'w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary outline-none placeholder:text-text-placeholder hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring resize-none disabled:opacity-50';

export default function CandidateAssessment() {
  const params = useParams();
  const router = useRouter();
  const _rawAppId = params.app_id;
  const appId = Array.isArray(_rawAppId) ? _rawAppId[0] : _rawAppId;

  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [promptData, setPromptData] = useState<{ scenario_prompt: string; hidden_prompt: string } | null>(null);

  // Chat State
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Telemetry & UI States
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [keystrokeMetrics, setKeystrokeMetrics] = useState({ total_chars: 0, backspace_count: 0 });
  const [replayHistory, setReplayHistory] = useState<{ time: number; chat: ChatMessage[]; input: string }[]>([]);
  const lastSnapshotRef = useRef('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPasteWarning, setShowPasteWarning] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  // Max Turns Calculation (4 user answers max)
  const userTurnsCount = messages.filter((m) => m.role === 'user').length;
  const isMaxTurnsReached = userTurnsCount >= 4;

  const [promptError, setPromptError] = useState(false);

  useEffect(() => {
    api
      .get(`/assessment/${appId}/prompt`)
      .then((data) => {
        setPromptData(data);
        setMessages([{ role: 'assistant', content: data.scenario_prompt }]);
      })
      .catch(() => {
        setPromptError(true);
      });
  }, [appId, router]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted || !promptData) return;
    if (timeLeft === 1) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted, promptData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabHidden(true);
        if (!submitted) {
          setTabSwitches((prev) => prev + 1);
        }
      } else {
        setIsTabHidden(false);
        if (!submitted) {
          setShowTabWarning(true);
          setTimeout(() => setShowTabWarning(false), 4000);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submitted]);

  useEffect(() => {
    if (submitted) return;
    const stateStr = JSON.stringify({ chat: messages, input: currentInput });
    if (stateStr !== lastSnapshotRef.current) {
      setReplayHistory((prev) => [...prev, { time: Date.now(), chat: messages, input: currentInput }]);
      lastSnapshotRef.current = stateStr;
    }
  }, [messages, currentInput, submitted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteCount((prev) => prev + 1);
    setShowPasteWarning(true);
    setTimeout(() => setShowPasteWarning(false), 4000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMaxTurnsReached) return;
    if (e.key === 'Backspace') {
      setKeystrokeMetrics((prev) => ({ ...prev, backspace_count: prev.backspace_count + 1 }));
    } else if (e.key.length === 1) {
      setKeystrokeMetrics((prev) => ({ ...prev, total_chars: prev.total_chars + 1 }));
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!currentInput.trim() || isAiTyping || isMaxTurnsReached) return;
    const newMessages = [...messages, { role: 'user', content: currentInput }];
    setMessages(newMessages);
    setCurrentInput('');
    setIsAiTyping(true);

    try {
      const res = await api.post(`/assessment/${appId}/chat`, { messages: newMessages });
      if (res.reply) setMessages([...newMessages, { role: 'assistant', content: res.reply }]);
    } catch {
    } finally {
      setIsAiTyping(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (isSubmitting || submitted) return;
    setIsSubmitting(true);
    setShowSubmitConfirm(false);
    try {
      const timeTaken = 15 * 60 - timeLeft;
      const finalAnswer = JSON.stringify(messages);
      const backspace_ratio =
        keystrokeMetrics.total_chars > 0
          ? keystrokeMetrics.backspace_count / keystrokeMetrics.total_chars
          : 100;

      await api.post(`/assessment/${appId}/submit`, {
        answer: finalAnswer,
        tab_switches: tabSwitches,
        copy_paste_attempts: pasteCount,
        time_taken_seconds: timeTaken,
        keystroke_metrics: JSON.stringify({ ...keystrokeMetrics, backspace_ratio }),
        replay_history: JSON.stringify(replayHistory),
      });
      setSubmitted(true);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    const handleDownloadReport = async () => {
      try {
        const [fp, app] = await Promise.all([
          api.get(`/biosphere/fingerprint/${appId}`).catch(() => null),
          api.get(`/applications/${appId}`).catch(() => null),
        ]);
        const blob = new Blob([JSON.stringify({ application_id: appId, fingerprint: fp, application: app, exported_at: new Date().toISOString() }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `skillens-report-${appId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        alert('Report belum tersedia. Tunggu evaluasi AI selesai lalu unduh dari dasbor.');
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-full p-4 relative overflow-hidden font-app">
        <div className="bg-background-primary-default border border-border-button-default max-w-lg w-full rounded-3xl p-10 text-center shadow-card relative overflow-hidden">
          <div className="size-16 bg-background-secondary-default text-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-separator-border">
            <RiCheckLine className="size-8" aria-hidden />
          </div>
          <h2 className="text-title-1-medium text-text-primary mb-3">Evaluasi Berhasil Dikirim</h2>
          <p className="text-body-regular text-text-secondary leading-relaxed mb-8">
            Terima kasih telah menyelesaikan sesi evaluasi AI. Hasil performa dan telemetry Anda telah tersimpan secara aman.
            Personal Skill dan Competency Report (radar) dapat diunduh dari dasbor setelah evaluasi selesai.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="medium" onClick={() => router.push('/candidate/dashboard')}>
              Kembali Ke Dasbor
            </Button>
            <Button variant="secondary" size="medium" leadingIcon={RiFileTextLine} onClick={handleDownloadReport}>
              Unduh Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (promptError) {
    return (
      <div className="min-h-screen bg-background-full flex flex-col items-center justify-center gap-4 p-6 text-center font-app">
        <div className="bg-background-primary-default rounded-2xl border border-border-button-default shadow-card px-8 py-10 max-w-md">
          <h2 className="text-title-2-medium text-text-primary">Sesi Ujian Tidak Tersedia</h2>
          <p className="text-body-regular text-text-secondary mt-2 leading-relaxed">
            Tautan ujian ini sudah dikumpulkan, kedaluwarsa, atau bukan milik akun Anda. Kembali ke dashboard untuk melihat status lamaran.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="primary" size="medium" onClick={() => router.push('/candidate/dashboard')}>
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!promptData) {
    return (
      <div className="min-h-screen bg-background-full flex flex-col items-center justify-center gap-6 font-app">
        <ThinkingIndicator statusText="Menyiapkan Sesi Ujian Aman..." />
      </div>
    );
  }

  const progressPercentage = Math.min((userTurnsCount / 4) * 100, 100);
  const isCriticalTime = timeLeft <= 120;

  return (
    <div className="min-h-screen bg-background-full text-text-primary flex flex-col h-screen font-app">
      {/* ── SECURITY TAB OVERLAY ── */}
      {isTabHidden && (
        <div className="fixed inset-0 bg-background-primary-default/95 z-[100] flex flex-col items-center justify-center p-6 text-center">
          <RiErrorWarningLine className="size-20 text-text-error-primary mb-4" aria-hidden />
          <h2 className="text-title-1-medium text-text-primary mb-2">Peringatan Pengawasan Telemetry</h2>
          <p className="text-body-regular text-text-secondary max-w-md leading-relaxed">
            Anda terdeteksi meninggalkan jendela evaluasi. Peristiwa perpindahan tab dicatat oleh AI Proctored Security.
          </p>
        </div>
      )}

      {/* ── WARNING TOAST NOTIFICATIONS ── */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
        {showPasteWarning && (
          <div className="bg-background-primary-default border border-border-error-default px-4 py-3 rounded-2xl shadow-card flex items-center gap-3">
            <RiAlertLine className="size-5 text-text-error-primary shrink-0" aria-hidden />
            <span className="text-body-medium text-text-primary">Paste dinonaktifkan untuk menjaga otentisitas jawaban.</span>
          </div>
        )}

        {showTabWarning && (
          <div className="bg-background-primary-default border border-border-button-default px-4 py-3 rounded-2xl shadow-card flex items-center gap-3">
            <RiErrorWarningLine className="size-5 text-accent-600 shrink-0" aria-hidden />
            <span className="text-body-medium text-text-primary">Peringatan: Pindah tab ({tabSwitches}x) terekam dalam telemetry.</span>
          </div>
        )}
      </div>

      {/* ── TOP HEADER BAR ── */}
      <header className="bg-background-primary-default border-b border-separator-border px-6 py-3.5 flex items-center justify-between z-20 shadow-card">
        <div className="flex items-center gap-4">
          <img src="/skillens-logo-text.png" alt="Skillens" className="h-7 w-auto object-contain" />
          <div className="h-4 w-px bg-separator-border hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <RiShieldCheckLine className="size-4 text-accent-600" aria-hidden />
            <span className="text-body-medium text-text-primary">Ruang Evaluator AI</span>
            <Chip variant="caption" color="lime">Live Terpantau</Chip>
          </div>
        </div>

        {/* Center: Turn Status Pill */}
        <div className="hidden md:flex items-center gap-3 bg-background-secondary-default px-4 py-1.5 rounded-full border border-separator-border">
          <span className="text-body-regular text-text-secondary">Progres Evaluasi:</span>
          <span className="text-body-medium text-accent-600 tabular-nums">
            {userTurnsCount} / 4 Pertanyaan
          </span>
        </div>

        {/* Right: Timer & Submit */}
        <div className="flex items-center gap-4">
          <div
            className={cx(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-body-medium tabular-nums transition-all outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring',
              isCriticalTime
                ? 'bg-background-primary-default text-text-error-primary border-border-error-default'
                : 'bg-background-secondary-default text-text-primary border-separator-border',
            )}
          >
            <RiTimeLine className={cx('size-4', isCriticalTime ? 'text-text-error-primary' : 'text-accent-600')} aria-hidden />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <span className={cx(isMaxTurnsReached && 'animate-bounce')}>
            <Button variant="primary" size="small" onClick={() => setShowSubmitConfirm(true)}>
              {isMaxTurnsReached ? '✓ Kirim Jawaban' : 'Kirim Ujian'}
            </Button>
          </span>
        </div>
      </header>

      {/* ── SPLIT WORKSPACE CONTENT ── */}
      <div className="flex-1 flex overflow-hidden p-4 sm:p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* LEFT PANEL: Case Study & Guidelines */}
        <div className="hidden lg:flex lg:w-1/3 flex-col bg-background-primary-default rounded-3xl border border-border-button-default shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-separator-border bg-background-secondary-default flex items-center justify-between">
            <div className="flex items-center gap-2 text-caption-1-medium text-text-primary uppercase">
              <RiFileTextLine className="size-4 text-accent-600" aria-hidden />
              Studi Kasus Evaluasi
            </div>
            <span className="text-caption-1-medium text-text-tertiary tabular-nums">ID: #{String(appId || '').slice(0, 6)}</span>
          </div>


          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-body-regular text-text-secondary leading-relaxed">
            <div className="p-4 bg-background-secondary-default rounded-2xl border border-separator-border space-y-2">
              <div className="text-body-medium text-text-primary flex items-center gap-1.5">
                <RiInformationLine className="size-4 text-accent-600" aria-hidden /> Instruksi Ujian:
              </div>
              <ul className="list-disc list-inside space-y-1 text-body-regular text-text-secondary">
                <li>Jawab setiap pertanyaan studi kasus dengan analisis mendalam.</li>
                <li>Maksimal 4 pertukaran instruksi dengan Evaluator AI.</li>
                <li>Pengawasan telemetry mencatat perpindahan tab dan aktivitas mengetik.</li>
              </ul>
            </div>

            <div className="prose prose-sm max-w-none text-text-primary">
              <div className="text-body-medium text-text-primary mb-2">Skenario Masalah:</div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {promptData.scenario_prompt}
              </ReactMarkdown>
            </div>
          </div>

          {/* Left Panel Footer Telemetry Badge */}
          <div className="p-4 bg-background-secondary-default border-t border-separator-border flex items-center justify-between text-caption-1-medium text-text-secondary">
            <span>Perpindahan Tab: <strong className="text-text-primary tabular-nums">{tabSwitches}</strong></span>
            <span>Upaya Paste: <strong className="text-text-primary tabular-nums">{pasteCount}</strong></span>
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Chat Workspace */}
        <div className="flex-1 flex flex-col bg-background-primary-default rounded-3xl border border-border-button-default shadow-card overflow-hidden">
          {/* Top Progress Line */}
          <div className="bg-background-secondary-default h-1.5 w-full overflow-hidden">
            <div
              className="bg-accent-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={cx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className="flex gap-3 max-w-[85%] sm:max-w-[78%]">
                  {m.role === 'assistant' && (
                    <div className="size-8 rounded-full bg-accent-500 text-text-white flex items-center justify-center text-caption-1-medium shrink-0 mt-0.5 shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={cx(
                      'p-4 sm:p-5 rounded-2xl text-body-regular leading-relaxed',
                      m.role === 'user'
                        ? 'bg-background-tertiary-default text-text-primary rounded-tr-none'
                        : 'bg-background-secondary-default text-text-primary border border-separator-border rounded-tl-none',
                    )}
                  >
                    {m.role === 'assistant' && i === 0 && (
                      <div className="text-caption-1-medium text-accent-600 uppercase mb-2">
                        SKENARIO INTERAKTIF EVALUATOR AI
                      </div>
                    )}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>

                  {m.role === 'user' && (
                    <div className="size-8 rounded-full bg-background-tertiary-default text-text-primary border border-separator-border flex items-center justify-center text-caption-1-medium shrink-0 mt-0.5 shadow-xs">
                      Anda
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex justify-start items-center gap-3">
                <div className="size-8 rounded-full bg-accent-500 text-text-white flex items-center justify-center text-caption-1-medium shrink-0">
                  AI
                </div>
                <ThinkingIndicator statusText="Evaluator AI sedang menganalisis dan menyusun balasan..." />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box / Completion Banner */}
          {isMaxTurnsReached ? (
            <div className="p-5 border-t border-separator-border bg-accent-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-accent-500 text-text-white flex items-center justify-center text-body-medium shadow-sm">
                  ✓
                </div>
                <div>
                  <h4 className="text-body-medium text-text-primary">Sesi Wawancara Evaluasi Selesai</h4>
                  <p className="text-caption-1-medium text-text-secondary">
                    Seluruh pertanyaan evaluasi telah dijawab. Silakan klik <strong className="text-text-primary">Kirim Jawaban</strong> untuk menyelesaikan ujian.
                  </p>
                </div>
              </div>
              <Button variant="primary" size="medium" onClick={() => setShowSubmitConfirm(true)}>
                Kirim Ujian
              </Button>
            </div>
          ) : (
            <div className="p-4 border-t border-separator-border bg-background-primary-default space-y-2">
              <div className="relative">
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder="Ketik jawaban dan analisis Anda di sini..."
                  rows={3}
                  disabled={isAiTyping}
                  className={cx(NATIVE_TEXTAREA_CLASSES, 'pr-14')}
                  aria-label="Jawaban evaluasi"
                />
                <span className="absolute right-3.5 bottom-3.5">
                  <IconButton
                    icon={RiSendPlaneLine}
                    size="small"
                    aria-label="Kirim jawaban"
                    onClick={handleSend}
                    disabled={!currentInput.trim() || isAiTyping}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between text-caption-1-medium text-text-tertiary px-2">
                <span>Tekan <kbd className="bg-background-secondary-default text-text-secondary px-1.5 py-0.5 rounded border border-separator-border">Enter ↵</kbd> untuk mengirim</span>
                <span className="tabular-nums">{currentInput.length} karakter</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-background-tertiary-default/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background-primary-default rounded-3xl p-8 max-w-md w-full border border-border-button-default shadow-card space-y-5">
            <h3 className="text-title-2-medium text-text-primary">Selesaikan dan Kirim Evaluasi?</h3>
            <p className="text-body-regular text-text-secondary leading-relaxed">
              Apakah Anda yakin ingin mengirimkan hasil jawaban dan telemetry sesi ini sekarang? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="small" onClick={() => setShowSubmitConfirm(false)}>
                Kembali Ke Soal
              </Button>
              <Button variant="primary" size="small" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Ya, Kirim'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
