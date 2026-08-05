'use client';

import { Close, Dashboard, Logout, Menu, Notification, Settings } from '@carbon/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import clsx from 'clsx';
import SponsorLogos from '@/components/SponsorLogos';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import OnboardingWizardModal from '@/components/OnboardingWizardModal';


const sidebarLinks = [
  { nameKey: 'sidebar.dashboard', href: '/candidate/dashboard', icon: Dashboard },
  { nameKey: 'sidebar.interviews', href: '/candidate/interviews', icon: Notification },
  { nameKey: 'sidebar.profile', href: '/candidate/profile', icon: Settings },
];

function CandidateLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Candidate');
  const [userInitials, setUserInitials] = useState('CA');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { t } = useLanguage();

  const isPublicAssessmentPage = pathname.includes('/candidate/test/') || 
                                 pathname.includes('/candidate/apply/') || 
                                 pathname.includes('/candidate/instructions/');

  useEffect(() => {
    if (isPublicAssessmentPage) return;

    const fetchUser = () => {
      api.get('/auth/me').then((data: any) => {
        if (data?.role !== 'candidate') {
          router.push('/login');
          return;
        }
        setUserData(data);
        if (data?.full_name) {
          setUserName(data.full_name);
          const parts = data.full_name.split(' ');
          setUserInitials(parts.map((p: string) => p[0]).join('').toUpperCase().slice(0, 2));
        }

        // Auto open wizard if profile data (name or CV) is missing
        if (!data?.full_name || !data?.profile?.resume_url) {
          setShowWizard(true);
        }
      }).catch(() => {
        router.push('/login');
      });
    };

    fetchUser();
    window.addEventListener('user-profile-updated', fetchUser);
    return () => window.removeEventListener('user-profile-updated', fetchUser);
  }, [router, isPublicAssessmentPage]);


  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      router.push('/login');
    }
  };

  if (isPublicAssessmentPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex overflow-hidden relative font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={clsx(
        "w-64 bg-white border-r border-gray-200/80 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 shadow-sm",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <Link href="/candidate/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/skillens-logo-text.png" alt="Skillens" className="h-8 w-auto object-contain" />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 flex flex-col gap-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/candidate/dashboard' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.nameKey}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium",
                  isActive
                    ? "bg-gray-900 text-white shadow-xs"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{t(link.nameKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <Link href="/candidate/profile">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer mb-1 font-medium text-sm">
              <Settings className="w-4 h-4" />
              <span>{t('sidebar.profile')}</span>
            </div>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-red-50 text-red-600 transition-colors cursor-pointer font-medium text-sm">
            <Logout className="w-4 h-4" />
            <span>{t('sidebar.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen w-full relative z-10">
        {/* Top Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium text-gray-500">{t('header.welcome_back')}</span>
              <span className="font-bold text-gray-900">{userName}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <Notification className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{t('header.candidate')}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#F26522] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>

        {/* Footer Logos */}
        <div className="w-full bg-white border-t border-gray-200/60">
          <SponsorLogos />
        </div>
      </main>

      <OnboardingWizardModal
        isOpen={showWizard}
        userRole="candidate"
        initialData={userData}
        onComplete={() => setShowWizard(false)}
      />
    </div>
  );
}


export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CandidateLayoutContent>{children}</CandidateLayoutContent>
    </LanguageProvider>
  );
}
