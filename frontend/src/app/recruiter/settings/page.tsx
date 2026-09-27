'use client';

import { RiCheckLine, RiTeamLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button, ButtonLink } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await api.get('/auth/me');
        setUser(data);
        setFullName(data.full_name || '');
        setCompanyName(data.company_name || '');
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
        full_name: fullName,
        company_name: companyName
      };
      const updated = await api.put('/auth/me', formData);
      setUser(updated);
      window.dispatchEvent(new Event('user-profile-updated'));
      toast.success('Profil berhasil diperbarui');
    } catch (err) {
      toast.error('Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <Toaster position="top-right" />
      <div>
        <p className="text-body-medium text-text-secondary">{t('settings.subtitle')}</p>
      </div>

      {(user?.role === 'recruiter' && !user?.parent_account_id || user?.role === 'admin') && (
        <div className="flex justify-end">
          <ButtonLink href="/recruiter/settings/team" variant="secondary" size="small" leadingIcon={RiTeamLine}>
            {t('settings.manage_team')}
          </ButtonLink>
        </div>
      )}

      <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card sm:p-8">
        <h3 className="border-b border-separator-border pb-3 text-title-3-semibold text-text-primary">{t('settings.profile_info')}</h3>
        {user ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                name="full_name"
                type="text"
                label={t('settings.full_name')}
                value={fullName}
                onChange={setFullName}
                isRequired
              />
              <Input
                name="company_name"
                type="text"
                label={t('settings.company_name')}
                value={companyName}
                onChange={setCompanyName}
                isRequired
              />
              <div className="md:col-span-2">
                <Input
                  name="email"
                  type="email"
                  label={t('settings.email')}
                  value={user.email || ''}
                  onChange={() => {}}
                  isDisabled
                  hint={t('settings.email_locked')}
                />
              </div>
            </div>

            <div className="border-t border-separator-border pt-6">
              <h3 className="text-title-3-semibold text-text-primary">{t('settings.language')}</h3>
              <p className="mb-4 mt-1 text-body-regular text-text-secondary">{t('settings.language_desc')}</p>
              <div className="flex flex-col gap-1.5 md:w-1/2">
                <span className="text-body-medium text-text-primary">Bahasa</span>
                <Select
                  aria-label={t('settings.language')}
                  selectedKey={language}
                  onSelectionChange={(k) => setLanguage(String(k) as 'en' | 'id')}
                >
                  <SelectItem id="id">Bahasa Indonesia</SelectItem>
                  <SelectItem id="en">English</SelectItem>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="medium" leadingIcon={RiCheckLine} disabled={isSubmitting}>
                {isSubmitting ? 'Simpan...' : t('settings.save')}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6 text-body-regular text-text-secondary">Memuat profil...</div>
        )}
      </div>
    </div>
  );
}
