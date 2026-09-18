'use client';

import {
  CheckmarkOutline,
  Document,
  Information,
  Security,
  SendAlt,
  Time,
  WarningAlt,
  WarningHex,
} from '@carbon/icons-react';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import type { ChatMessage } from '@/types/api';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import TextRollButton from '@/components/TextRollButton';

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
      <div className="min-h-screen flex items-center justify-center bg-[#EFEFEF] p-4 font-sans relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200/80 max-w-lg w-full rounded-3xl p-10 text-center shadow-xl relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
            <CheckmarkOutline className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">Evaluasi Berhasil Dikirim</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Terima kasih telah menyelesaikan sesi evaluasi AI. Hasil performa dan telemetry Anda telah tersimpan secara aman.
            Personal Skill &amp; Competency Report (radar) dapat diunduh dari dasbor setelah evaluasi selesai.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push('/candidate/dashboard')}>
              <TextRollButton text="Kembali Ke Dasbor" variant="orange" size="md" />
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-6 py-3 rounded-full border border-gray-300 text-sm font-bold text-gray-800 hover:border-[#F26522] hover:text-[#F26522] transition-colors"
            >
              Unduh Report
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (promptError) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center gap-4 font-sans p-6 text-center">
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm px-8 py-10 max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Sesi Ujian Tidak Tersedia</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Tautan ujian ini sudah dikumpulkan, kedaluwarsa, atau bukan milik akun Anda. Kembali ke dashboard untuk melihat status lamaran.
          </p>
          <div className="mt-6 flex justify-center">
            <TextRollButton text="Kembali ke Dashboard" variant="orange" size="lg" onClick={() => router.push('/candidate/dashboard')} className="justify-between" />
          </div>
        </div>
      </div>
    );
  }

  if (!promptData) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center gap-6 font-sans">
        <ThinkingIndicator statusText="Menyiapkan Sesi Ujian Aman..." />
      </div>
    );
  }

  const progressPercentage = Math.min((userTurnsCount / 4) * 100, 100);
  const isCriticalTime = timeLeft <= 120;

  return (
    <div className={`min-h-screen text-gray-900 flex flex-col h-screen font-sans transition-colors duration-500 ${isCriticalTime ? 'bg-red-50/40' : 'bg-[#f4f4f5]'}`}>
      {/* ── SECURITY TAB OVERLAY ── */}
      <AnimatePresence>
        {isTabHidden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 z-[100] flex flex-col items-center justify-center p-6 text-center backdrop-blur-md"
          >
            <WarningHex className="w-20 h-20 text-red-600 mb-4 animate-pulse" />
            <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Peringatan Pengawasan Telemetry</h2>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              Anda terdeteksi meninggalkan jendela evaluasi. Peristiwa perpindahan tab dicatat oleh AI Proctored Security.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WARNING TOAST NOTIFICATIONS ── */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {showPasteWarning && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-red-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium border border-red-700"
            >
              <WarningAlt className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Paste dinonaktifkan untuk menjaga otentisitas jawaban.</span>
            </motion.div>
          )}

          {showTabWarning && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-amber-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium border border-amber-700"
            >
              <WarningHex className="w-5 h-5 text-amber-300 shrink-0" />
              <span>Peringatan: Pindah tab ({tabSwitches}x) terekam dalam telemetry.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── TOP HEADER BAR ── */}
      <header className="bg-white border-b border-gray-200/90 px-6 py-3.5 flex items-center justify-between z-20 shadow-xs">
        <div className="flex items-center gap-4">
          <img src="/skillens-logo-text.png" alt="Skillens" className="h-7 w-auto object-contain" />
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <Security className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-700">Ruang Evaluator AI</span>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              PROCTORED LIVE
            </span>
          </div>
        </div>

        {/* Center: Turn Status Pill */}
        <div className="hidden md:flex items-center gap-3 bg-gray-100/80 px-4 py-1.5 rounded-full border border-gray-200/70">
          <span className="text-xs text-gray-600 font-medium">Progres Evaluasi:</span>
          <span className="text-xs font-bold font-mono text-[#F26522]">
            {userTurnsCount} / 4 Pertanyaan
          </span>
        </div>

        {/* Right: Timer & Submit */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
              isCriticalTime
                ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                : 'bg-gray-100 text-gray-900 border border-gray-200'
            }`}
          >
            <Time className="w-4 h-4 text-[#F26522]" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button onClick={() => setShowSubmitConfirm(true)} className={isMaxTurnsReached ? 'animate-bounce' : ''}>
            <TextRollButton
              text={isMaxTurnsReached ? '✓ Kirim Jawaban' : 'Kirim Ujian'}
              variant="orange"
              size="sm"
            />
          </button>
        </div>
      </header>

      {/* ── SPLIT WORKSPACE CONTENT ── */}
      <div className="flex-1 flex overflow-hidden p-4 sm:p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* LEFT PANEL: Case Study & Guidelines */}
        <div className="hidden lg:flex lg:w-1/3 flex-col bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
              <Document className="w-4 h-4 text-[#F26522]" />
              Studi Kasus Evaluasi
            </div>
            <span className="text-[11px] text-gray-400 font-mono">ID: #{String(appId || '').slice(0, 6)}</span>
          </div>


          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-sm text-gray-700 leading-relaxed font-normal">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-2">
              <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                <Information className="w-4 h-4 text-[#F26522]" /> Instruksi Ujian:
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Jawab setiap pertanyaan studi kasus dengan analisis mendalam.</li>
                <li>Maksimal 4 pertukaran instruksi dengan Evaluator AI.</li>
                <li>Pengawasan telemetry mencatat perpindahan tab & aktivitas mengetik.</li>
              </ul>
            </div>

            <div className="prose prose-sm max-w-none text-gray-800">
              <div className="font-semibold text-gray-900 mb-2 text-base">Skenario Masalah:</div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {promptData.scenario_prompt}
              </ReactMarkdown>
            </div>
          </div>

          {/* Left Panel Footer Telemetry Badge */}
          <div className="p-4 bg-gray-50/80 border-t border-gray-100 text-xs flex items-center justify-between text-gray-500">
            <span>Perpindahan Tab: <strong className="text-gray-900 font-mono">{tabSwitches}</strong></span>
            <span>Upaya Paste: <strong className="text-gray-900 font-mono">{pasteCount}</strong></span>
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Chat Workspace */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
          {/* Top Progress Line */}
          <div className="bg-gray-100 h-1.5 w-full overflow-hidden">
            <div
              className="bg-[#F26522] h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex gap-3 max-w-[85%] sm:max-w-[78%]">
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[#F26522] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gray-900 text-white rounded-tr-none'
                        : 'bg-gray-50 text-gray-900 border border-gray-200/70 rounded-tl-none'
                    }`}
                  >
                    {m.role === 'assistant' && i === 0 && (
                      <div className="text-[11px] font-semibold text-[#F26522] uppercase tracking-wider mb-2">
                        SKENARIO INTERAKTIF EVALUATOR AI
                      </div>
                    )}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                      Anda
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F26522] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  AI
                </div>
                <ThinkingIndicator statusText="Evaluator AI sedang menganalisis & menyusun balasan..." />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box / Completion Banner */}
          {isMaxTurnsReached ? (
            <div className="p-5 border-t border-gray-200 bg-[#F26522]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F26522] text-white flex items-center justify-center font-bold text-base shadow-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Sesi Wawancara Evaluasi Selesai</h4>
                  <p className="text-xs text-gray-600">
                    Seluruh pertanyaan evaluasi telah dijawab. Silakan klik <strong className="text-gray-900 font-semibold">Kirim Jawaban</strong> untuk menyelesaikan ujian.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSubmitConfirm(true)}>
                <TextRollButton text="Kirim Ujian Sekarang" variant="orange" size="md" />
              </button>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-100 bg-white space-y-2">
              <div className="relative">
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder="Ketik jawaban & analisis Anda di sini..."
                  rows={3}
                  disabled={isAiTyping}
                  className="w-full p-4 pr-14 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] resize-none disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!currentInput.trim() || isAiTyping}
                  className="absolute right-3.5 bottom-3.5 p-2.5 bg-gray-900 hover:bg-[#F26522] text-white rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-gray-900"
                >
                  <SendAlt className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 px-2">
                <span>Tekan <kbd className="font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">Enter ↵</kbd> untuk mengirim</span>
                <span>{currentInput.length} karakter</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans"
          >
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-200 shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Selesaikan & Kirim Evaluasi?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Apakah Anda yakin ingin mengirimkan hasil jawaban dan telemetry sesi ini sekarang? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full"
                >
                  Kembali Ke Soal
                </button>
                <button onClick={handleSubmit} disabled={isSubmitting}>
                  <TextRollButton
                    text={isSubmitting ? 'Mengirim...' : 'Ya, Kirim Sekarang'}
                    variant="orange"
                    size="sm"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
