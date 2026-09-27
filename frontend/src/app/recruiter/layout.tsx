'use client';

import {
  RiAddFill,
  RiBarChartLine,
  RiBriefcaseLine,
  RiCalendarLine,
  RiCloseLine,
  RiDashboardLine,
  RiFilter3Fill,
  RiGroupLine,
  RiMenuLine,
} from '@remixicon/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { DashboardSidebar, type DashboardNavItem } from '@/components/application/dashboard/dashboard-sidebar';
import { NotificationBell } from '@/components/application/app-shell/notification-bell';
import { Avatar } from '@/components/base/avatar/avatar';
import { Breadcrumb, BreadcrumbItem } from '@/components/base/breadcrumb/breadcrumb';
import { Button } from '@/components/base/buttons/button';
import { IconButton } from '@/components/base/buttons/icon-button';
import { cx } from '@/utils/cx';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import OnboardingWizardModal from '@/components/OnboardingWizardModal';

const RECRUITER_NAV: DashboardNavItem[] = [
  { key: 'command', label: 'Dasbor', icon: RiDashboardLine, href: '/recruiter' },
  { key: 'jobs', label: 'Lowongan Aktif', icon: RiBriefcaseLine, href: '/recruiter/jobs' },
  { key: 'candidates', label: 'Kandidat', icon: RiGroupLine, href: '/recruiter/candidates' },
  { key: 'interviews', label: 'Wawancara', icon: RiCalendarLine, href: '/recruiter/interviews' },
  { key: 'metrics', label: 'Analitik', icon: RiBarChartLine, href: '/recruiter/metrics' },
];

function selectedKey(pathname: string): string {
  if (pathname.startsWith('/recruiter/jobs')) return 'jobs';
  if (pathname.startsWith('/recruiter/candidates')) return 'candidates';
  if (pathname.startsWith('/recruiter/interviews')) return 'interviews';
  if (pathname.startsWith('/recruiter/metrics')) return 'metrics';
  if (pathname.startsWith('/recruiter/settings')) return 'settings';
  return 'command';
}

function pageTitle(pathname: string, t: (k: string) => string): string {
  if (pathname.startsWith('/recruiter/jobs/new')) return 'Buat Lowongan Baru';
  if (pathname.startsWith('/recruiter/jobs')) return 'Lowongan Aktif';
  if (pathname.startsWith('/recruiter/candidates')) return 'Kandidat';
  if (pathname.startsWith('/recruiter/interviews')) return 'Wawancara';
  if (pathname.startsWith('/recruiter/metrics')) return 'Analitik';
  if (pathname.startsWith('/recruiter/settings')) return 'Pengaturan';
  return 'Dasbor';
}

function RecruiterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Recruiter');
  const [userInitials, setUserInitials] = useState('RC');
  const [navOpen, setNavOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { t } = useLanguage();
  const selected = selectedKey(pathname ?? '');
  const title = pageTitle(pathname ?? '', t);

  useEffect(() => {
    const fetchUser = () => {
      api.get('/auth/me').then((data: any) => {
        if (data?.role !== 'recruiter' && data?.role !== 'admin') {
          router.push('/login');
          return;
        }
        setUserData(data);
        if (data?.full_name) {
          setUserName(data.full_name);
          const parts = data.full_name.split(' ');
          setUserInitials(parts.map((p: string) => p[0]).join('').toUpperCase().slice(0, 2));
        }
        const isDismissed = typeof window !== 'undefined' && sessionStorage.getItem('onboarding_wizard_dismissed') === 'true';
        if (!isDismissed && (!data?.full_name || data?.full_name === 'Recruiter')) {
          setShowWizard(true);
        }
      }).catch(() => {
        router.push('/login');
      });
    };
    fetchUser();
    window.addEventListener('user-profile-updated', fetchUser);
    return () => window.removeEventListener('user-profile-updated', fetchUser);
  }, [router]);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
    } finally {
      router.push('/login');
    }
  };

  const accountUsers = [{ initials: userInitials, color: 'neutral' as const, name: userName }];

  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3 font-boardui">
      <DashboardSidebar
        items={RECRUITER_NAV}
        selected={selected}
        displayName={userName}
        displayInitials={userInitials}
        settingsHref="/recruiter/settings"
        showSupport={false}
        showThemeToggle={false}
        showTeamMenu={false}
        menuUsers={accountUsers}
        onSignOut={handleLogout}
        className="hidden lg:flex"
      />

      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Tutup navigasi"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/40"
          />
          <div className="relative flex h-full p-3">
            <DashboardSidebar
              mobile
              items={RECRUITER_NAV}
              selected={selected}
              displayName={userName}
              displayInitials={userInitials}
              settingsHref="/recruiter/settings"
              showSupport={false}
              showThemeToggle={false}
              showTeamMenu={false}
              menuUsers={accountUsers}
              onSignOut={handleLogout}
              onClose={() => setNavOpen(false)}
              className="flex"
            />
          </div>
        </div>
      )}

      <main className="relative flex min-h-0 min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-background-full sm:pt-3 font-boardui">
        <div className="flex w-full max-w-[1300px] flex-col gap-2.5">
          <header className="flex w-full flex-col gap-2">
            <Breadcrumb>
              <BreadcrumbItem href="/recruiter">
                <Avatar size="xs" color="blue" initials="S" />
                Skillens
              </BreadcrumbItem>
              <BreadcrumbItem href="/recruiter">
                <Avatar size="xs" color="neutral" initials={userInitials} />
                {userName}
              </BreadcrumbItem>
              <BreadcrumbItem current icon={RiDashboardLine}>
                {title}
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex w-full flex-wrap items-end justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <IconButton
                  icon={navOpen ? RiCloseLine : RiMenuLine}
                  size="medium"
                  aria-label="Buka navigasi"
                  onClick={() => setNavOpen((open) => !open)}
                  className="lg:hidden"
                />
                <h1 className="px-1 text-title-2-medium whitespace-nowrap text-text-primary">
                  {title}
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <NotificationBell />
                <Link href="/recruiter/candidates" className={cx('contents')}>
                  <Button variant="secondary" size="medium" leadingIcon={RiFilter3Fill}>
                    Filter
                  </Button>
                </Link>
                <Link href="/recruiter/jobs/new" className={cx('contents')}>
                  <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
                    Buat Lowongan
                  </Button>
                </Link>
              </div>
            </div>
          </header>
          <div className="flex w-full flex-col gap-4 pb-4">{children}</div>
        </div>
      </main>

      <OnboardingWizardModal
        isOpen={showWizard}
        userRole="recruiter"
        initialData={userData}
        onComplete={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('onboarding_wizard_dismissed', 'true');
          }
          setShowWizard(false);
        }}
      />
    </div>
  );
}

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <RecruiterShell>{children}</RecruiterShell>
    </LanguageProvider>
  );
}
