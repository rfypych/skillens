'use client';
import { Checkmark, CheckmarkOutline, Code, CurrencyDollar, Edit, List, Location, Locked, MagicWand, Portfolio, SettingsAdjust, TextBold, TextItalic, View } from '@carbon/icons-react';


import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';


import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';

export default function JobAssessmentReview() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<any>(null);
  const [assessment, setAssessment] = useState<{scenario_prompt: string, hidden_prompt: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [activeTab, setActiveTab] = useState<'assessment' | 'details'>('assessment');

  // Job Details Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    salary_range: '',
    description: '',
    expected_outcomes: '',
    specific_skills: ''
  });

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('scenario-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = promptValue;
    const selectedText = text.substring(start, end);
    
    const leadingSpaces = selectedText.match(/^\s*/)?.[0] || '';
    const trailingSpaces = selectedText.match(/\s*$/)?.[0] || '';
    const trimmedSelectedText = selectedText.substring(leadingSpaces.length, selectedText.length - trailingSpaces.length);
    
    const textToInsert = leadingSpaces + prefix + trimmedSelectedText + suffix + trailingSpaces;
    
    textarea.focus();
    textarea.setSelectionRange(start, end);
    
    // Use execCommand to preserve the browser's native Undo/Redo stack (Ctrl+Z / Ctrl+Y)
    let success = false;
    try {
      success = document.execCommand('insertText', false, textToInsert);
    } catch (e) {}

    // Fallback if execCommand is not supported
    if (!success) {
      const newText = text.substring(0, start) + textToInsert + text.substring(end);
      setPromptValue(newText);
    }
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + leadingSpaces.length + prefix.length, 
        end - trailingSpaces.length + prefix.length
      );
    }, 0);
  };

  useEffect(() => {


    let isMounted = true;

    const fetchInitialJob = async () => {
      try {
        const jobRes = await api.get(`/jobs/${jobId}`);
        if (isMounted) {
          setJob(jobRes);
          setJobForm({
            title: jobRes.title || '',
            location: jobRes.location || '',
            salary_range: jobRes.salary_range || '',
            description: jobRes.description || '',
            expected_outcomes: jobRes.expected_outcomes || '',
            specific_skills: jobRes.specific_skills || ''
          });
        }
      } catch (err: any) {
        if (err.message && err.message.includes('403')) {
          router.push('/login');
        }
        console.error(err);
      }
    };
    
    fetchInitialJob();
    return () => {
      isMounted = false;
    };
  }, [jobId, router]);

  useEffect(() => {
    let isMounted = true;
    let interval: any;

    const fetchAssessment = async () => {
      try {
        const assessmentRes = await api.get(`/assessment/job/${jobId}`);
        if (isMounted) {
          setAssessment(assessmentRes);
          // Set prompt value only on first load so user edits aren't wiped
          setPromptValue((prev) => prev || assessmentRes.scenario_prompt);
          setLoading(false);
          if (interval) clearInterval(interval);
          
          // Refetch job to get the AI-generated job description if any
          const jobRes = await api.get(`/jobs/${jobId}`);
          setJob(jobRes);
          setJobForm({
            title: jobRes.title || '',
            location: jobRes.location || '',
            salary_range: jobRes.salary_range || '',
            description: jobRes.description || '',
            expected_outcomes: jobRes.expected_outcomes || '',
            specific_skills: jobRes.specific_skills || ''
          });
        }
      } catch (err) {
        // Assessment not ready yet
        if (isMounted && !interval) {
          interval = setInterval(fetchAssessment, 3000);
        }
      }
    };

    fetchAssessment();

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [jobId]);

  const handleSaveAssessment = async () => {
    setSaving(true);
    try {
      await api.put(`/assessment/job/${jobId}`, { scenario_prompt: promptValue });
      toast.success("Assessment saved successfully!");
      setActiveTab('details');
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveJobDetails = async () => {
    setSaving(true);
    try {
      await api.put(`/jobs/${jobId}`, jobForm);
      setJob({ ...job, ...jobForm });
      toast.success("Job details updated successfully!");
      router.push('/recruiter/jobs');
    } catch (err) {
      toast.error("Failed to update job details.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (!job?.magic_link_token) return;
    const link = `${window.location.origin}/candidate/apply/${job.magic_link_token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Magic link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <ThinkingIndicator />
    </div>
  );

  return (
    <div className="w-full space-y-8 pb-12 font-sans">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-secondary mb-2 flex items-center gap-3">
            {job?.title || 'Job Overview'}
            <span className="px-3 py-1 rounded-none bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-widest leading-none">Active</span>
          </h1>
          <p className="text-brand-gray-dark text-base md:text-lg">
            Manage job metadata and the AI assessment scenario.
          </p>
        </div>
        
        {job?.magic_link_token && (
          <button 
            onClick={handleCopyLink}
            className="w-full md:w-auto flex items-center justify-center gap-2 text-sm font-bold bg-brand-white border border-brand-gray-light px-5 py-2.5 rounded-none hover:border-brand-primary hover:text-brand-primary transition-colors shadow-none text-brand-secondary"
          >
            {copied ? <CheckmarkOutline className="w-5 h-5 text-green-500" /> : <Locked className="w-5 h-5" />}
            {copied ? 'Copied Magic Link!' : 'Copy Magic Link'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-gray-light/30 pb-px">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'assessment' 
              ? 'border-brand-primary text-brand-primary' 
              : 'border-transparent text-brand-gray-dark hover:text-brand-secondary hover:border-brand-gray-light'
          }`}
        >
          <SettingsAdjust className="w-4 h-4" />
          Assessment Setup
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'details' 
              ? 'border-brand-primary text-brand-primary' 
              : 'border-transparent text-brand-gray-dark hover:text-brand-secondary hover:border-brand-gray-light'
          }`}
        >
          <Portfolio className="w-4 h-4" />
          Job Details
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {!assessment ? (
              <div className="bg-brand-white rounded-none p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-brand-gray-light/40">
                <div className="w-16 h-16 rounded-none bg-brand-gray-light/10 border border-brand-gray-light/20 flex items-center justify-center mb-5">
                  <ThinkingIndicator />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-secondary mb-2">Generating Micro-Simulation...</h3>
                <p className="text-brand-gray-dark text-sm max-w-sm leading-relaxed">
                  The AI is analyzing your expected outcomes and specific skills to craft a highly contextual real-world scenario. This may take a few seconds.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-brand-white p-6 rounded-none border border-brand-gray-light/30 shadow-none">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                        <h3 className="font-display font-bold text-brand-secondary flex items-center gap-2">
                          <div className="p-1.5 bg-brand-accent/20 text-brand-secondary rounded-none">
                            <MagicWand className="w-4 h-4" />
                          </div>
                          AI-Generated Scenario Prompt
                        </h3>
                        
                        <div className="flex bg-brand-gray-light/10 p-1 rounded-none border border-brand-gray-light/20">
                          <button
                            onClick={() => setViewMode('edit')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-none transition-all ${viewMode === 'edit' ? 'bg-brand-white text-brand-secondary shadow-none' : 'text-brand-gray-dark hover:text-brand-secondary'}`}
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setViewMode('preview')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-none transition-all ${viewMode === 'preview' ? 'bg-brand-white text-brand-secondary shadow-none' : 'text-brand-gray-dark hover:text-brand-secondary'}`}
                          >
                            <View className="w-3.5 h-3.5" /> Preview
                          </button>
                        </div>
                      </div>

                      {viewMode === 'edit' ? (
                        <div className="border border-brand-gray-light rounded-none overflow-hidden focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all">
                          <div className="bg-brand-gray-light/10 border-b border-brand-gray-light px-3 py-2 flex items-center gap-2">
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('**', '**')} className="p-1.5 text-brand-gray-dark hover:text-brand-secondary hover:bg-brand-gray-light/20 rounded-none transition-colors" title="TextBold">
                              <TextBold className="w-4 h-4" />
                            </button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('*', '*')} className="p-1.5 text-brand-gray-dark hover:text-brand-secondary hover:bg-brand-gray-light/20 rounded-none transition-colors" title="TextItalic">
                              <TextItalic className="w-4 h-4" />
                            </button>
                            <div className="w-px h-5 bg-brand-gray-light/50 mx-1" />
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('- ')} className="p-1.5 text-brand-gray-dark hover:text-brand-secondary hover:bg-brand-gray-light/20 rounded-none transition-colors" title="Bullet List">
                              <List className="w-4 h-4" />
                            </button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertFormat('```\n', '\n```')} className="p-1.5 text-brand-gray-dark hover:text-brand-secondary hover:bg-brand-gray-light/20 rounded-none transition-colors" title="Code Block">
                              <Code className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            id="scenario-editor"
                            value={promptValue}
                            onChange={(e) => setPromptValue(e.target.value)}
                            className="w-full h-[300px] md:h-[450px] p-4 md:p-5 bg-brand-white text-sm text-brand-secondary font-mono leading-relaxed focus:outline-none resize-y"
                            placeholder="Write your scenario in Markdown format..."
                          />
                        </div>
                      ) : (
                        <div className="w-full h-[355px] md:h-[505px] p-4 md:p-6 bg-brand-white border border-brand-gray-light rounded-none overflow-y-auto">
                          <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-brand-primary prose-headings:font-display prose-headings:font-bold prose-headings:text-brand-secondary">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {promptValue || '*No content to preview.*'}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-brand-gray-dark mt-4">
                        This text will be presented to candidates exactly as formatted here. You can tweak the questions or use Markdown to format it.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-brand-white p-6 rounded-none border border-brand-gray-light/30 shadow-none relative overflow-hidden group">
                      <h3 className="font-display font-bold text-brand-secondary mb-3 flex items-center gap-2 relative z-10">
                        <div className="p-1.5 bg-red-50 text-red-600 rounded-none">
                          <Locked className="w-4 h-4" />
                        </div>
                        Anti-Cheat Protection
                      </h3>
                      <p className="text-sm text-brand-gray-dark leading-relaxed mb-5 relative z-10">
                        The Scooby-Doo method (prompt injection trap) has been armed. If a candidate copies the scenario into ChatGPT, the AI will secretly trigger a flagged word.
                      </p>
                      <div className="bg-brand-white border border-red-200 rounded-none p-4 shadow-none relative z-10">
                        <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider block mb-1">Trigger Word</span>
                        <span className="font-mono text-base font-bold text-red-700">{assessment.hidden_prompt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Link href="/recruiter/jobs">
                    <button className="px-6 py-3 rounded-none font-bold text-brand-gray-dark hover:text-brand-secondary hover:bg-brand-gray-light/20 transition-colors text-sm">
                      Back to Roles
                    </button>
                  </Link>
                  <button 
                    onClick={handleSaveAssessment}
                    disabled={saving}
                    className="px-6 py-3 rounded-none font-bold bg-brand-primary hover:bg-brand-dark-teal text-brand-white shadow-none hover:shadow-none hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 text-sm"
                  >
                    {saving ? (
                      <ThinkingIndicator />
                    ) : (
                      <Checkmark className="w-4 h-4" />
                    )}
                    <span>Save & Next</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-brand-white p-8 rounded-none border border-brand-gray-light/30 shadow-none"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-brand-secondary mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full px-4 py-3 border border-brand-gray-light rounded-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-secondary mb-2">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Location className="h-5 w-5 text-brand-gray-dark" />
                    </div>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 border border-brand-gray-light rounded-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-brand-secondary mb-2">Salary Range</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CurrencyDollar className="h-5 w-5 text-brand-gray-dark" />
                    </div>
                    <input
                      type="text"
                      value={jobForm.salary_range}
                      onChange={(e) => setJobForm({...jobForm, salary_range: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 border border-brand-gray-light rounded-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-secondary mb-2">Job Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  className="w-full h-32 px-4 py-3 border border-brand-gray-light rounded-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-secondary mb-2">Expected Outcomes (KPIs)</label>
                <textarea
                  value={jobForm.expected_outcomes}
                  onChange={(e) => setJobForm({...jobForm, expected_outcomes: e.target.value})}
                  className="w-full h-32 px-4 py-3 border border-brand-gray-light rounded-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-secondary mb-2">Specific Skills</label>
                <textarea
                  value={jobForm.specific_skills}
                  onChange={(e) => setJobForm({...jobForm, specific_skills: e.target.value})}
                  className="w-full h-24 px-4 py-3 border border-brand-gray-light rounded-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-y"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-brand-gray-light/30">
              <Link href="/recruiter/jobs">
                <button className="px-6 py-3 rounded-none font-bold text-brand-gray-dark hover:text-brand-secondary hover:bg-brand-gray-light/20 transition-colors text-sm">
                  Back to Roles
                </button>
              </Link>
              <button 
                onClick={handleSaveJobDetails}
                disabled={saving}
                className="px-6 py-3 rounded-none font-bold bg-brand-secondary hover:bg-brand-dark-teal text-brand-white shadow-none hover:shadow-none hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 text-sm"
              >
                {saving ? (
                  <ThinkingIndicator />
                ) : (
                  <Checkmark className="w-4 h-4" />
                )}
                <span>Save & Close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
