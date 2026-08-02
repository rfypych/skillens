'use client';

import { Aperture, CheckmarkOutline, Renew, Security, SendAlt, Time, Warning, WarningHex } from '@carbon/icons-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import TextRollButton from '@/components/TextRollButton';

export default function CandidateAssessment() {
  const params = useParams();
  const router = useRouter();
  const appId = params.app_id;

  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [promptData, setPromptData] = useState<{ scenario_prompt: string; hidden_prompt: string } | null>(null);

  const MAX_TURNS = 8;

  // Chat State
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Telemetry & UI States
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [keystrokeMetrics, setKeystrokeMetrics] = useState({ total_chars: 0, backspace_count: 0 });
  const [replayHistory, setReplayHistory] = useState<{ time: number; chat: any[]; input: string }[]>([]);
  const lastSnapshotRef = useRef('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPasteWarning, setShowPasteWarning] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  useEffect(() => {
    api.get(`/assessment/${appId}/prompt`)
      .then(data => {
        setPromptData(data);
        setMessages([{ role: 'assistant', content: data.scenario_prompt }]);
      })
      .catch(console.error);
  }, [appId, router]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted || !promptData) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted, promptData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabHidden(true);
        if (!submitted) {
          setTabSwitches(prev => prev + 1);
        }
      } else {
        setIsTabHidden(false);
        if (!submitted) {
          setShowTabWarning(true);
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
      setReplayHistory(prev => [...prev, { time: Date.now(), chat: messages, input: currentInput }]);
      lastSnapshotRef.current = stateStr;
    }
  }, [messages, currentInput, submitted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault(); 
    setPasteCount(prev => prev + 1);
    setShowPasteWarning(true);
    setTimeout(() => setShowPasteWarning(false), 4000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      setKeystrokeMetrics(prev => ({ ...prev, backspace_count: prev.backspace_count + 1 }));
    } else if (e.key.length === 1) {
      setKeystrokeMetrics(prev => ({ ...prev, total_chars: prev.total_chars + 1 }));
    }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSend = async () => {
    if (!currentInput.trim() || isAiTyping) return;
    const newMessages = [...messages, { role: 'user', content: currentInput }];
    setMessages(newMessages);
    setCurrentInput('');
    setIsAiTyping(true);
    
    if (newMessages.length >= MAX_TURNS) {
      setIsAiTyping(false);
      return;
    }

    try {
      const res = await api.post(`/assessment/${appId}/chat`, { messages: newMessages });
      if (res.reply) setMessages([...newMessages, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
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
      const timeTaken = (15 * 60) - timeLeft;
      const finalAnswer = JSON.stringify(messages);
      const backspace_ratio = keystrokeMetrics.total_chars > 0
        ? keystrokeMetrics.backspace_count / keystrokeMetrics.total_chars
        : 100;

      await api.post(`/assessment/${appId}/submit`, {
        answer: finalAnswer,
        tab_switches: tabSwitches,
        copy_paste_attempts: pasteCount,
        time_taken_seconds: timeTaken,
        keystroke_metrics: JSON.stringify({ ...keystrokeMetrics, backspace_ratio }),
        replay_history: JSON.stringify(replayHistory)
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFEFEF] p-4 font-sans relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200/80 max-w-lg w-full rounded-2xl p-10 text-center shadow-xs relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
            <CheckmarkOutline className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">Evaluasi Berhasil Dikirim</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Terima kasih telah menyelesaikan sesi evaluasi AI. Hasil performa dan telemetry Anda telah tersimpan secara aman.
          </p>
          <button onClick={() => router.push('/candidate/dashboard')}>
            <TextRollButton text="Kembali Ke Dasbor" variant="orange" size="md" />
          </button>
        </motion.div>
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

  const progressPercentage = Math.min((messages.length / MAX_TURNS) * 100, 100);
  const isCriticalTime = timeLeft <= 60;

  return (
    <div className={`min-h-screen text-gray-900 flex flex-col h-screen font-sans transition-colors duration-500 ${isCriticalTime ? 'bg-red-50' : 'bg-[#EFEFEF]'}`}>
      
      {/* Tab Switch Overlay */}
      <AnimatePresence>
        {isTabHidden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 z-[100] flex flex-col items-center justify-center p-6 text-center"
          >
            <WarningHex className="w-20 h-20 text-red-600 mb-4 animate-pulse" />
            <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Peringatan Integritas</h2>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              Anda telah meninggalkan jendela ujian. Peristiwa ini dicatat oleh sistem pengawasan telemetry.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex items-center justify-between z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <img src="/skillens-logo-text.png" alt="Skillens" className="h-7 w-auto object-contain" />
          <div className="pl-2 border-l border-gray-200">
            <h1 className="font-semibold text-sm text-gray-900">Ruang Evaluator AI</h1>
            <p className="text-[11px] text-gray-500">Sesi Simulasi Studi Kasus Real-Time</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold ${isCriticalTime ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-900'}`}>
            <Time className="w-4 h-4 text-[#F26522]" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button onClick={() => setShowSubmitConfirm(true)}>
            <TextRollButton text="Kirim Jawaban" variant="orange" size="sm" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Left: Chat & Simulation Area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-gray-100 h-1.5 w-full overflow-hidden">
            <div className="bg-[#F26522] h-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900 border border-gray-100'
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isAiTyping && (
              <div className="flex justify-start">
                <ThinkingIndicator statusText="Evaluator AI sedang mengetik balasan..." />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="relative">
              <textarea
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Ketik jawaban Anda di sini (Tekan Enter untuk mengirim)..."
                rows={3}
                className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] resize-none"
              />
              <button
                onClick={handleSend}
                disabled={!currentInput.trim() || isAiTyping}
                className="absolute right-4 bottom-4 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-30"
              >
                <SendAlt className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200 shadow-xl space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Kirim Sesi Ujian?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Apakah Anda yakin ingin menyelesaikan dan mengirimkan sesi evaluasi ini sekarang?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Batal
                </button>
                <button onClick={handleSubmit} disabled={isSubmitting}>
                  <TextRollButton text={isSubmitting ? 'Mengirim...' : 'Ya, Kirim Sekarang'} variant="orange" size="sm" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
