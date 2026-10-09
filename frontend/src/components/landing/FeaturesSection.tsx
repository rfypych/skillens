'use client';

import { RiArrowRightUpLine } from '@remixicon/react';import { LinkButton } from '@/components/base/buttons/link-button';
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
import { SegmentedControl, SegmentedControlItem } from '@/components/base/segmented-control/segmented-control';
import { Switch } from '@/components/base/switch/switch';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { DotPulse } from '@/components/landing/DotPulse';
import CognitiveFingerprintRadar from '@/components/CognitiveFingerprintRadar';

function CardShell({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[19rem] flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card">
      <div className="overflow-hidden rounded-2xl border border-separator-border bg-background-secondary-default p-3">
        {children}
      </div>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <h3 className="text-body-1-medium text-text-primary">{title}</h3>
        <p className="text-body-regular text-text-secondary">{desc}</p>
      </div>
    </div>
  );
}

function DemoTable() {
  const rows = [
    { initials: 'AP', name: 'Arka Pratama', score: 87.5, chip: 'Highly Validated', color: 'lime' as const },
    { initials: 'SM', name: 'Sinta Maharani', score: 79.2, chip: 'Hidden Gem', color: 'lime' as const },
    { initials: 'RZ', name: 'Rafi Zaidan', score: 45, chip: 'Terindikasi Kecurangan', color: 'rose' as const },
  ];
  return (
    <Table aria-label="Contoh peringkat" size="sm" containerClassName="w-full">
      <TableHeader>
        <TableColumn id="name" isRowHeader>Kandidat</TableColumn>
        <TableColumn>Skor</TableColumn>
        <TableColumn>Label</TableColumn>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.name}>
            <TableCell>
              <span className="flex items-center gap-2">
                <Avatar size="sm" color="neutral" initials={r.initials} />
                <span className="text-body-medium text-text-primary">{r.name}</span>
              </span>
            </TableCell>
            <TableCell>
              <span className="text-body-medium tabular-nums text-text-primary">{r.score}</span>
            </TableCell>
            <TableCell>
              <Chip variant="bold" color={r.color}>{r.chip}</Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DemoStats() {
  const stats = [
    { label: 'Simulasi selesai', value: '3,400+', delta: '+12%', color: 'lime' as const },
    { label: 'Kecurangan dicegah', value: '312', delta: 'otomatis', color: 'lime' as const },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1 rounded-xl bg-background-primary-default p-3">
          <span className="text-caption-1-semibold text-text-tertiary">{s.label}</span>
          <span className="text-title-3-semibold tabular-nums text-text-primary">{s.value}</span>
          <Chip variant="caption" color={s.color} className="self-start">{s.delta}</Chip>
        </div>
      ))}
    </div>
  );
}

function DemoTelemetry() {
  const bars = [38, 62, 45, 80, 55, 70, 42, 66, 50, 74, 58, 64, 48, 72, 52];
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-end gap-1 h-14" aria-hidden>
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-full rounded-full bg-accent-500/70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Chip variant="caption" color="neutral">WPM: 84</Chip>
        <Chip variant="caption" color="neutral">Backspace: 4.1%</Chip>
        <Chip variant="caption" color="lime">Paste: 0</Chip>
      </div>
    </div>
  );
}

function DemoControls() {
  return (
    <div className="flex flex-col gap-3">
      <SegmentedControl defaultSelectedKeys={['mingguan']} aria-label="Periode">
        <SegmentedControlItem id="harian">Harian</SegmentedControlItem>
        <SegmentedControlItem id="mingguan">Mingguan</SegmentedControlItem>
        <SegmentedControlItem id="bulanan">Bulanan</SegmentedControlItem>
      </SegmentedControl>
      <Switch defaultSelected>
        <span className="text-body-regular text-text-primary">Notifikasi hasil baru</span>
      </Switch>
      <Checkbox defaultSelected={false}>
        <span className="text-body-regular text-text-primary">Tampilkan skor ke kandidat</span>
      </Checkbox>
    </div>
  );
}

const DEMO_FP = {
  analytical_depth: 92,
  communication_clarity: 81,
  execution_velocity: 76,
  integrity_index: 95,
  creative_synthesis: 68,
  pressure_resilience: 84,
};

export function FeaturesSection() {
  return (
    <section id="features" className="w-full max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-7 py-4 md:py-6 font-app">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4 px-1">
        <div className="flex flex-col gap-1.5">
          <p className="text-caption-1-semibold text-text-tertiary">
            Komponen interaktif
          </p>
          <h2 className="text-title-2-medium text-text-primary max-w-xl">
            Segalanya hidup, langsung bisa dicoba.
          </h2>
        </div>
        <LinkButton href="/signup" variant="secondary" size="small" trailingIcon={RiArrowRightUpLine}>
          Mulai Evaluasi
        </LinkButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <CardShell title="Tabel peringkat" desc="Urut, saring, dan telusuri data kompleks dalam tabel responsif.">
          <DemoTable />
        </CardShell>
        <CardShell title="Kartu stat" desc="Angka utama, delta jujur, dan konteks dalam sekejap.">
          <DemoStats />
        </CardShell>
        <CardShell title="Indikator thinking" desc="Penanda AI sedang berpikir, mengetik, dan menilai.">
          <div className="flex items-center justify-center py-6">
            <DotPulse label="Menilai jawaban…" />
          </div>
        </CardShell>
        <CardShell title="Telemetri live" desc="Sinyal perilaku yang terekam saat kandidat mengetik.">
          <DemoTelemetry />
        </CardShell>
        <CardShell title="Kontrol formulir" desc="Pilihan periode, sakelar, dan kotak cek yang langsung merespons.">
          <DemoControls />
        </CardShell>
        <CardShell title="Radar fingerprint" desc="Enam dimensi kompetensi dalam satu tatapan.">
          <div className="flex items-center justify-center">
            <CognitiveFingerprintRadar fingerprint={DEMO_FP} size={210} />
          </div>
        </CardShell>
      </div>
    </section>
  );
}
