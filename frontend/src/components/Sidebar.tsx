'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dashboard,
  User,
  Archive,
  Settings,
  Logout,
  Add,
  Menu,
} from '@carbon/icons-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Overview', href: '/recruiter', icon: Dashboard },
  { name: 'Roles', href: '/recruiter/jobs', icon: Archive },
  { name: 'Candidates', href: '/recruiter/candidates', icon: User },
  { name: 'Settings', href: '/recruiter/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      animate={{ width: expanded ? 220 : 60 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="relative flex flex-col h-screen bg-brand-secondary text-brand-white sticky top-0 z-30 flex-shrink-0 border-r border-brand-gray-dark"
      style={{ minWidth: expanded ? 220 : 60, overflow: 'hidden' }}
    >
      {/* ── Top: hamburger + logotype ─────────────────────── */}
      <div className="flex items-center h-16 border-b border-white/10 px-3 flex-shrink-0 gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-9 h-9 flex items-center justify-center rounded-none hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-brand-white/60" />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-baseline gap-0.5 whitespace-nowrap overflow-hidden"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">
                Skill
              </span>
              <span className="text-[16px] font-bold text-white/50 tracking-tight">
                Lens
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── New Role CTA ────────────────────────────────────── */}
      <div className="px-3 py-3 border-b border-white/10 flex-shrink-0">
        <Link href="/recruiter/jobs/new">
          {expanded ? (
            <motion.div
              layout
              className="flex items-center gap-2 w-full cursor-pointer rounded-none px-3 py-2.5 bg-brand-primary text-brand-white font-bold text-[11px] uppercase tracking-widest hover:bg-brand-dark-teal transition-colors whitespace-nowrap"
            >
              <Add className="w-3.5 h-3.5 flex-shrink-0" />
              Post a Role
            </motion.div>
          ) : (
            <motion.div
              layout
              className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-none bg-brand-primary text-brand-white hover:bg-brand-dark-teal transition-colors mx-auto"
              title="Post a Role"
            >
              <Add size={18} />
            </motion.div>
          )}
        </Link>
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {expanded && (
          <div className="px-2 pb-2 pt-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25 whitespace-nowrap">
              Workspace
            </span>
          </div>
        )}

        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname?.startsWith(`${item.href}/`) && item.href !== '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center rounded-none transition-all duration-150 relative',
                expanded ? 'gap-3 px-3 py-2.5' : 'justify-center w-9 h-9 mx-auto',
                isActive
                  ? 'bg-brand-white text-brand-dark font-semibold'
                  : 'text-brand-white/50 hover:bg-brand-dark-teal hover:text-brand-white'
              )}
              title={!expanded ? item.name : undefined}
            >
              {/* Active indicator — right edge pill */}
              {isActive && !expanded && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute -right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-accent rounded-none"
                />
              )}

              <item.icon
                className={clsx(
                  'flex-shrink-0 transition-colors',
                  expanded ? 'w-4 h-4' : 'w-[18px] h-[18px]',
                  isActive ? 'text-brand-dark' : 'text-brand-white/40 group-hover:text-brand-white'
                )}
              />

              {expanded && (
                <span className="text-[13px] truncate whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer: logout ──────────────────────────────────── */}
      <div className="px-2 py-3 border-t border-white/10 flex-shrink-0">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className={clsx(
            'group flex items-center rounded-none transition-colors duration-150 text-brand-white/40 hover:bg-red-900/20 hover:text-red-400',
            expanded ? 'gap-3 px-3 py-2.5 w-full' : 'justify-center w-9 h-9 mx-auto'
          )}
          title={!expanded ? 'Log out' : undefined}
        >
          <Logout className="w-4 h-4 flex-shrink-0" />
          {expanded && (
            <span className="text-[13px] whitespace-nowrap">Log out</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
