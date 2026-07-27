'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Add, ArrowLeft, TrashCan } from '@carbon/icons-react';
import Link from 'next/link';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';
import TextRollButton from '@/components/TextRollButton';

export default function TeamSettingsPage() {
  const [subAccounts, setSubAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const target = e.target as any;
      const formData = {
        full_name: target.full_name.value,
        email: target.email.value,
        password: target.password.value,
      };
      await api.post('/auth/sub-accounts', formData);
      toast.success('Anggota tim berhasil ditambahkan!');
      target.reset();
      fetchSubAccounts();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan anggota tim.');
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
        <Link href="/recruiter/settings" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Pengaturan
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-1">Manajemen Tim</h1>
        <p className="text-gray-600 text-sm font-normal">Kelola dan undang anggota tim untuk berkolaborasi dalam evaluasi kandidat.</p>
      </motion.div>

      {/* Add New Team Member Form */}
      <div className="p-8 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100">Undang Anggota Tim Baru</h3>
        <form onSubmit={handleCreateAccount} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Nama Lengkap *</label>
              <input 
                type="text" 
                name="full_name"
                placeholder="Alex Morgan"
                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Email *</label>
              <input 
                type="email" 
                name="email"
                placeholder="alex@company.com"
                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Kata Sandi Awal *</label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] text-sm"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isSubmitting}>
              <TextRollButton text={isSubmitting ? 'Menambahkan...' : 'Tambah Anggota Tim'} variant="orange" size="md" />
            </button>
          </div>
        </form>
      </div>

      {/* Team Roster */}
      <div className="p-8 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-100">Daftar Anggota Tim</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(n => <div key={n} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : subAccounts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-normal text-sm">
            Belum ada anggota tim tambahan.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {subAccounts.map((acc) => (
              <div key={acc.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{acc.full_name}</p>
                  <p className="text-xs text-gray-500 font-mono">{acc.email}</p>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {acc.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
