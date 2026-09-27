'use client';

import {
  RiCalendarLine,
  RiCloseLine,
  RiDashboardLine,
  RiEditLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiUserLine,
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

function selectedKey(pathname: string): string {
  if (pathname.startsWith('/candidate/interviews')) return 'interviews';
  if (pathname.startsWith('/candidate/profile')) return 'profile';
  return 'dashboard';
}

function pageTitle(pathname: string, t: (k: string) => string): string {
  if (pathname.startsWith('/candidate/interviews')) return t('sidebar.interviews');
  if (pathname.startsWith('/candidate/profile')) return t('sidebar.profile');
  if (pathname.startsWith('/candidate/job')) return 'Detail Lowongan';
  return t('sidebar.dashboard');
}

function CandidateShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Candidate');
  const [userInitials, setUserInitials] = useState('CA');
  const [navOpen, setNavOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { t } = useLanguage();
  const selected = selectedKey(pathname ?? '');
  const title = pageTitle(pathname ?? '', t);

  const CANDIDATE_NAV: DashboardNavItem[] = [
    { key: 'dashboard', label: t('sidebar.dashboard'), icon: RiDashboardLine, href: '/candidate/dashboard' },
    { key: 'interviews', label: t('sidebar.interviews'), icon: RiCalendarLine, href: '/candidate/interviews' },
    { key: 'profile', label: t('sidebar.profile'), icon: RiUserLine, href: '/candidate/profile' },
  ];

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

        // Only open wizard if not dismissed in current session AND profile data is incomplete
        const isDismissed = typeof window !== 'undefined' && sessionStorage.getItem('onboarding_wizard_dismissed') === 'true';
        if (!isDismissed && (!data?.full_name || !data?.profile?.resume_url)) {
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

  if (isPublicAssessmentPage) {
    return <>{children}</>;
  }

  const accountUsers = [{ initials: userInitials, color: 'neutral' as const, name: userName }];

  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3 font-boardui">
      <DashboardSidebar
        items={CANDIDATE_NAV}
        selected={selected}
        displayName={userName}
        displayInitials={userInitials}
        settingsHref="/candidate/profile"
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
              items={CANDIDATE_NAV}
              selected={selected}
              displayName={userName}
              displayInitials={userInitials}
              settingsHref="/candidate/profile"
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
              <BreadcrumbItem href="/candidate/dashboard">
                <Avatar size="xs" color="blue" initials="S" />
                Skillens
              </BreadcrumbItem>
              <BreadcrumbItem href="/candidate/profile">
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
                <Link href="/candidate/profile" className={cx('contents')}>
                  <Button variant="secondary" size="medium" leadingIcon={RiEditLine}>
                    Edit Profil
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
        userRole="candidate"
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


export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CandidateShell>{children}</CandidateShell>
    </LanguageProvider>
  );
}
