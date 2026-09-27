'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  RiArrowDownLine,
  RiArrowRightSLine,
  RiArrowUpLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiExpandUpDownLine,
  RiSearchLine,
} from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { Input } from '@/components/base/input/input';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/base/table/table';
import { cx } from '@/utils/cx';

interface RankApp {
  id: number;
  status: string;
  user?: { full_name?: string; email?: string } | null;
  assessment_results?: {
    overall_score?: number | null;
    ai_cheating_detected?: boolean;
    tab_switches?: number;
    claim_vs_evidence_label?: string;
  }[] | null;
}

interface RankingTableProps {
  apps: RankApp[];
  kkmScore: number;
  onInvite: (appId: number) => void;
}

function SortIcon({ dir }: { dir: false | 'asc' | 'desc' }) {
  if (dir === 'asc') return <RiArrowUpLine className="w-3.5 h-3.5" />;
  if (dir === 'desc') return <RiArrowDownLine className="w-3.5 h-3.5" />;
  return <RiExpandUpDownLine className="w-3.5 h-3.5 opacity-40" />;
}

function StatusPill({ status }: { status: string }) {
  const color: 'purple' | 'lime' | 'rose' | 'blue' | 'neutral' =
    status === 'interview' ? 'purple'
    : status === 'hired' ? 'lime'
    : status === 'rejected' ? 'rose'
    : status === 'evaluated' ? 'blue'
    : 'neutral';
  return (
    <Chip variant="bold" color={color}>
      {status === 'evaluated' ? 'Tes Selesai' : status}
    </Chip>
  );
}

export default function RankingTable({ apps, kkmScore, onInvite }: RankingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'score', desc: true }]);
  const [query, setQuery] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

  // Stable leaderboard rank: position in score-descending order (nulls last),
  // independent of the user's current sort — rank always means score rank.
  const scoreRank = useMemo(() => {
    const ordered = [...apps].sort((a, b) => {
      const sa = a.assessment_results?.[0]?.overall_score;
      const sb = b.assessment_results?.[0]?.overall_score;
      if (sa == null && sb == null) return 0;
      if (sa == null) return 1;
      if (sb == null) return -1;
      return sb - sa;
    });
    return new Map(ordered.map((app, i) => [app.id, i + 1]));
  }, [apps]);

  const columns = useMemo<ColumnDef<RankApp>[]>(
    () => [
      {
        id: 'rank',
        header: 'Peringkat',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-body-medium tabular-nums text-text-primary">
            #{scoreRank.get(row.original.id) ?? '–'}
          </span>
        ),
      },
      {
        id: 'name',
        header: 'Pelamar / Kandidat',
        accessorFn: (app) => app.user?.full_name || 'Kandidat (Pelamar)',
        cell: ({ row }) => (
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-body-medium text-text-primary">{row.original.user?.full_name || 'Kandidat (Pelamar)'}</span>
            <span className="truncate text-caption-1-medium text-text-tertiary">{row.original.user?.email || 'email@kandidat.com'}</span>
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status Pendaftaran',
        enableSorting: false,
        cell: ({ row }) => <StatusPill status={row.original.status} />,
      },
      {
        id: 'score',
        header: `Skor AI (KKM: ${kkmScore})`,
        accessorFn: (app) => app.assessment_results?.[0]?.overall_score ?? -1,
        cell: ({ row }) => {
          const score = row.original.assessment_results?.[0]?.overall_score ?? null;
          const passed = score !== null && score >= kkmScore;
          return score !== null ? (
            <span className={cx('text-body-medium tabular-nums', passed ? 'text-status-lime-text' : 'text-status-rose-text')}>
              {score} / 100
            </span>
          ) : (
            <span className="text-body-regular text-text-tertiary">Belum Mengikuti Tes</span>
          );
        },
      },
      {
        id: 'kkm',
        header: 'Status KKM',
        enableSorting: false,
        cell: ({ row }) => {
          const score = row.original.assessment_results?.[0]?.overall_score ?? null;
          if (score === null) return <span className="text-body-regular text-text-tertiary">-</span>;
          const passed = score >= kkmScore;
          return (
            <Chip variant="bold" color={passed ? 'lime' : 'rose'}>
              <span className="inline-flex items-center gap-1">
                {passed ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiErrorWarningLine className="size-3.5" aria-hidden />}
                {passed ? 'Lulus KKM' : 'Di bawah KKM'}
              </span>
            </Chip>
          );
        },
      },
      {
        id: 'fraud',
        header: 'Deteksi Kecurangan',
        enableSorting: false,
        cell: ({ row }) => {
          const result = row.original.assessment_results?.[0];
          const cheating = result?.ai_cheating_detected || ((result?.tab_switches ?? 0) > 3);
          if (cheating) {
            return (
              <Chip variant="bold" color="rose">
                <span className="inline-flex items-center gap-1">
                  <RiErrorWarningLine className="size-3.5" aria-hidden />Terdeteksi ({result?.tab_switches ?? 0} Pindah Tab)
                </span>
              </Chip>
            );
          }
          if (result) {
            return (
              <span className="inline-flex items-center gap-1 text-body-regular text-status-lime-text">
                <RiCheckLine className="size-3.5" aria-hidden />Bersih / Jujur
              </span>
            );
          }
          return <span className="text-body-regular text-text-tertiary">-</span>;
        },
      },
      {
        id: 'actions',
        header: 'Aksi',
        enableSorting: false,
        cell: ({ row }) => {
          const app = row.original;
          const score = app.assessment_results?.[0]?.overall_score ?? null;
          const passed = score !== null && score >= kkmScore;
          return (
            <div className="flex items-center justify-end gap-2">
              {passed && app.status !== 'interview' && (
                <Button variant="primary" size="xs" onClick={() => onInvite(app.id)} className="whitespace-nowrap">
                  Undang Wawancara
                </Button>
              )}
              <Link
                href={`/recruiter/candidates/${app.id}`}
                className="inline-flex items-center gap-0.5 whitespace-nowrap text-body-medium text-accent-600 outline-none transition-colors hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                Detail <RiArrowRightSLine className="size-3.5" aria-hidden />
              </Link>
            </div>
          );
        },
      },
    ],
    [kkmScore, onInvite, scoreRank],
  );

  const table = useReactTable({
    data: apps,
    columns,
    state: { sorting, globalFilter: query, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _col, filter) => {
      const q = String(filter).toLowerCase();
      const u = row.original.user || {};
      return (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    },
  });

  const rows = table.getRowModel().rows;
  const totalPages = table.getPageCount();

  return (
    <div className="overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default shadow-card">
      <div className="flex flex-col justify-between gap-3 border-b border-separator-border p-4 sm:flex-row sm:items-center">
        <p className="text-body-regular text-text-secondary">
          {table.getFilteredRowModel().rows.length} kandidat
          {query && <> - filter: "{query}"</>}
        </p>
        <Input
          value={query}
          onChange={(v) => table.setGlobalFilter(v)}
          placeholder="Cari nama atau email…"
          aria-label="Cari kandidat"
          leadingIcon={RiSearchLine}
          className="w-full sm:max-w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <Table aria-label="Peringkat kandidat" className="min-w-[960px]">
          <TableHeader>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <TableColumn key={header.id} id={header.id} isRowHeader={header.id === 'name'}>
                {header.column.getCanSort() ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex cursor-pointer items-center gap-1 text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                    aria-label={`Urutkan ${header.column.id}`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIcon dir={header.column.getIsSorted()} />
                  </button>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            renderEmptyState={() => (
              <div className="flex h-32 items-center justify-center text-body-regular text-text-tertiary">
                Tidak ada kandidat yang cocok dengan pencarian.
              </div>
            )}
          >
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-separator-border px-4 py-3">
          <p className="text-body-regular tabular-nums text-text-secondary">
            Halaman {pagination.pageIndex + 1} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Sebelumnya
            </Button>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
