'use client';

import Link from 'next/link';
import {
  RiArrowRightUpLine,
  RiGroupLine,
  RiLineChartLine,
  RiShieldCheckLine,
  RiSparklingLine,
} from '@remixicon/react';
import { StatCards } from '@/components/application/dashboard/stat-cards';
import { Avatar } from '@/components/base/avatar/avatar';
import { Chip } from '@/components/base/badges/chip';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/base/table/table';

const PREVIEW_STATS = [
  { icon: RiGroupLine, label: 'Simulasi selesai', value: '3,400+', delta: '+12%', deltaColor: 'lime' as const },
  { icon: RiLineChartLine, label: 'Rata-rata skor bukti', value: '78', delta: 'skala 100', deltaColor: 'neutral' as const },
  { icon: RiShieldCheckLine, label: 'Kecurangan dicegah', value: '312', delta: 'otomatis', deltaColor: 'lime' as const },
  { icon: RiSparklingLine, label: 'Hidden gems', value: '46', delta: 'kandidat unggul', deltaColor: 'lime' as const },
];

const PREVIEW_ROWS = [
  { initials: 'AP', name: 'Arka Pratama', id: 'APP-51', score: 87.5, chip: 'Highly Validated' as const, color: 'lime' as const },
  { initials: 'SM', name: 'Sinta Maharani', id: 'APP-52', score: 79.2, chip: 'Hidden Gem' as const, color: 'lime' as const },
  { initials: 'RZ', name: 'Rafi Zaidan', id: 'APP-53', score: 45, chip: 'Terindikasi Kecurangan' as const, color: 'rose' as const },
];

export function PreviewSection() {
  return (
    <section className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-6 md:py-10 font-boardui">
      <div className="flex flex-col gap-2 mb-6 px-1">
        <p className="text-caption-1-semibold text-text-tertiary">
          Pratinjau dasbor
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-title-1-medium text-text-primary max-w-xl">
            Satu layar untuk seluruh bukti seleksi.
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring whitespace-nowrap"
          >
            Coba langsung
            <RiArrowRightUpLine className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Bingkai browser */}
      <div className="overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
        <div className="flex items-center gap-1.5 border-b border-separator-border bg-background-secondary-default px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-background-tertiary-default" aria-hidden />
          <span className="size-2.5 rounded-full bg-background-tertiary-default" aria-hidden />
          <span className="size-2.5 rounded-full bg-background-tertiary-default" aria-hidden />
          <span className="ml-3 hidden rounded-md bg-background-tertiary-default px-3 py-1 text-caption-1-semibold text-text-tertiary sm:block">
            skillens.ai/recruiter
          </span>
        </div>

        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <StatCards variant="plain" stats={PREVIEW_STATS} />

          <div className="overflow-hidden rounded-2xl border border-border-button-default">
            <Table aria-label="Contoh peringkat kandidat" size="sm" containerClassName="w-full">
              <TableHeader>
                <TableColumn id="name" isRowHeader>Kandidat</TableColumn>
                <TableColumn>Skor Bukti</TableColumn>
                <TableColumn>Label AI</TableColumn>
              </TableHeader>
              <TableBody>
                {PREVIEW_ROWS.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <Avatar size="sm" color="neutral" initials={row.initials} />
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-body-medium text-text-primary">{row.name}</span>
                          <span className="text-caption-1-medium tabular-nums text-text-tertiary">{row.id}</span>
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="text-body-medium tabular-nums text-text-primary">{row.score}</span>
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-background-tertiary-default">
                          <span className="block h-full rounded-full bg-accent-500" style={{ width: `${row.score}%` }} />
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip variant="bold" color={row.color}>{row.chip}</Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
