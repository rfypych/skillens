'use client';

import { Checkmark } from '@carbon/icons-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import TextRollButton from '@/components/TextRollButton';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await api.get('/auth/me');
        setUser(data);
      } catch {
      }
    };
    fetchMe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = {
        full_name: (e.target as any).full_name.value,
        company_name: (e.target as any).company_name.value
      };
      const updated = await api.put('/auth/me', formData);
      setUser(updated);
      window.dispatchEvent(new Event('user-profile-updated'));
      toast.success('Profil berhasil diperbarui!');
    } catch (err) {
      toast.error('Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 font-sans">
      <Toaster position="top-right" />
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-1">{t('settings.title')}</h1>
        <p className="text-gray-600 text-sm font-normal">{t('settings.subtitle')}</p>
      </motion.div>

      {(user?.role === 'recruiter' && !user?.parent_account_id || user?.role === 'admin') && (
        <div className="flex justify-end mb-4">
          <Link href="/recruiter/settings/team">
            <TextRollButton text={t('settings.manage_team')} variant="orange" size="md" />
          </Link>
        </div>
      )}

      <div className="p-8 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100">{t('settings.profile_info')}</h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t('settings.full_name')}</label>
                <input 
                  type="text" 
                  name="full_name"
                  defaultValue={user.full_name || ''} 
                  className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t('settings.company_name')}</label>
                <input 
                  type="text" 
                  name="company_name"
                  defaultValue={user.company_name || ''} 
                  className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{t('settings.email')}</label>
                <input 
                  type="email" 
                  disabled
                  defaultValue={user.email} 
                  className="w-full bg-gray-100 border border-gray-200 rounded-full px-4 py-2.5 text-gray-500 cursor-not-allowed text-sm font-mono"
                />
                <p className="text-xs text-gray-400 mt-1 font-normal">{t('settings.email_locked')}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('settings.language')}</h3>
              <p className="text-sm text-gray-500 mb-4 font-normal">{t('settings.language_desc')}</p>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
                className="w-full md:w-1/2 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm font-medium"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={isSubmitting}>
                <TextRollButton text={isSubmitting ? 'Simpan...' : t('settings.save')} variant="orange" size="md" />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-gray-500">Memuat profil...</div>
        )}
      </div>
    </div>
  );
}
