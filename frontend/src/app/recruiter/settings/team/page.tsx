'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import { RiAddLine, RiArrowLeftLine } from '@remixicon/react';
import Link from 'next/link';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { Input } from '@/components/base/input/input';

export default function TeamSettingsPage() {
  const [subAccounts, setSubAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchSubAccounts();
  }, []);

  const fetchSubAccounts = async () => {
    try {
      const data = await api.get('/auth/sub-accounts');
      setSubAccounts(data);
    } catch (err) {
      toast.error('Gagal memuat akun tim.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = {
        full_name: fullName,
        email: email,
        password: password,
      };
      await api.post('/auth/sub-accounts', formData);
      toast.success('Anggota tim berhasil ditambahkan');
      setFullName('');
      setEmail('');
      setPassword('');
      fetchSubAccounts();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan anggota tim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <Toaster position="top-right" />
      <div>
        <Link href="/recruiter/settings" className="mb-4 inline-flex items-center gap-1.5 text-body-medium text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          <RiArrowLeftLine className="size-4" aria-hidden />
          Kembali ke Pengaturan
        </Link>
        <h1 className="text-title-1-medium text-text-primary">Manajemen Tim</h1>
        <p className="mt-1 text-body-regular text-text-secondary">Kelola dan undang anggota tim untuk berkolaborasi dalam evaluasi kandidat.</p>
      </div>

      {/* Add New Team Member Form */}
      <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card sm:p-8">
        <h3 className="border-b border-separator-border pb-3 text-title-3-semibold text-text-primary">Undang anggota tim</h3>
        <form onSubmit={handleCreateAccount} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              name="full_name"
              type="text"
              label="Nama Lengkap *"
              placeholder="Alex Morgan"
              value={fullName}
              onChange={setFullName}
              isRequired
            />
            <Input
              name="email"
              type="email"
              label="Email *"
              placeholder="alex@company.com"
              value={email}
              onChange={setEmail}
              isRequired
            />
            <Input
              name="password"
              type="password"
              label="Kata Sandi Awal *"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={setPassword}
              isRequired
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="medium" leadingIcon={RiAddLine} disabled={isSubmitting}>
              {isSubmitting ? 'Menambahkan...' : 'Tambah Anggota Tim'}
            </Button>
          </div>
        </form>
      </div>

      {/* Team Roster */}
      <div className="space-y-6 rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card sm:p-8">
        <h3 className="border-b border-separator-border pb-3 text-title-3-semibold text-text-primary">Anggota tim</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(n => <div key={n} className="h-16 animate-pulse rounded-2xl bg-background-secondary-default" />)}
          </div>
        ) : subAccounts.length === 0 ? (
          <div className="py-12 text-center text-body-regular text-text-secondary">
            Belum ada anggota tim tambahan.
          </div>
        ) : (
          <div className="divide-y divide-separator-border">
            {subAccounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-body-medium text-text-primary">{acc.full_name}</p>
                  <p className="text-body-regular text-text-secondary">{acc.email}</p>
                </div>
                <Chip variant="caption" color="neutral">
                  {acc.role}
                </Chip>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
