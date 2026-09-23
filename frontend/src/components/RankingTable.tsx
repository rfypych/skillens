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
import { ArrowDown, ArrowUp, CaretSort, Checkmark, ChevronRight, Warning } from '@carbon/icons-react';
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
  if (dir === 'asc') return <ArrowUp className="w-3.5 h-3.5" />;
  if (dir === 'desc') return <ArrowDown className="w-3.5 h-3.5" />;
  return <CaretSort className="w-3.5 h-3.5 opacity-40" />;
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={cx(
      'inline-flex px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border',
      status === 'interview' && 'bg-purple-50 text-purple-700 border-purple-200',
      status === 'hired' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
      status === 'rejected' && 'bg-red-50 text-red-700 border-red-200',
      status === 'evaluated' && 'bg-blue-50 text-blue-700 border-blue-200',
      !['interview', 'hired', 'rejected', 'evaluated'].includes(status) && 'bg-gray-100 text-gray-700 border-gray-200',
    )}>
      {status === 'evaluated' ? 'Tes Selesai' : status}
    </span>
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
          <span className="font-bold font-mono text-gray-900">
            #{scoreRank.get(row.original.id) ?? '–'}
          </span>
        ),
      },
      {
        id: 'name',
        header: 'Pelamar / Kandidat',
        accessorFn: (app) => app.user?.full_name || 'Kandidat (Pelamar)',
        cell: ({ row }) => (
          <div>
            <div className="font-bold text-gray-900">{row.original.user?.full_name || 'Kandidat (Pelamar)'}</div>
            <div className="text-xs text-gray-500">{row.original.user?.email || 'email@kandidat.com'}</div>
          </div>
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
            <span className={cx('text-base font-bold font-mono', passed ? 'text-emerald-700' : 'text-red-600')}>
              {score} / 100
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-normal">Belum Mengikuti Tes</span>
          );
        },
      },
      {
        id: 'kkm',
        header: 'Status KKM',
        enableSorting: false,
        cell: ({ row }) => {
          const score = row.original.assessment_results?.[0]?.overall_score ?? null;
          if (score === null) return <span className="text-xs text-gray-400">-</span>;
          const passed = score >= kkmScore;
          return (
            <span className={cx(
              'inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border',
              passed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200',
            )}>
              {passed ? <Checkmark className="w-3.5 h-3.5" /> : <Warning className="w-3.5 h-3.5" />}
              {passed ? 'LULUS KKM' : 'DI BAWAH KKM'}
            </span>
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
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 border border-red-200 rounded-full">
                  <Warning className="w-3.5 h-3.5" /> Terdeteksi ({result?.tab_switches ?? 0} Pindah Tab)
                </span>
            );
          }
          if (result) {
            return (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Checkmark className="w-3.5 h-3.5 text-emerald-600" /> Bersih / Jujur
              </span>
            );
          }
          return <span className="text-xs text-gray-400">-</span>;
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
                <button
                  onClick={() => onInvite(app.id)}
                  className="px-4 py-2 bg-[#F26522] hover:bg-[#e05a1a] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-xs whitespace-nowrap"
                >
                  Undang Wawancara
                </button>
              )}
              <Link
                href={`/recruiter/candidates/${app.id}`}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full hover:border-[#F26522] transition-colors flex items-center gap-1 shadow-xs whitespace-nowrap"
              >
                Detail <ChevronRight className="w-3.5 h-3.5" />
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
    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
        <p className="text-xs text-gray-500 font-medium">
          {table.getFilteredRowModel().rows.length} kandidat
          {query && <> · filter: “{query}”</>}
        </p>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            placeholder="Cari nama atau email…"
            aria-label="Cari kandidat"
            className="w-full sm:w-64 pl-4 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:border-transparent transition-colors bg-white font-medium"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table aria-label="Peringkat kandidat" className="min-w-[960px]">
          <TableHeader>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <TableColumn key={header.id}>
                {header.column.getCanSort() ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex cursor-pointer items-center gap-1 hover:text-gray-900 transition-colors"
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
              <div className="flex h-32 items-center justify-center text-sm text-gray-400">
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
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            Halaman {pagination.pageIndex + 1} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-200 text-gray-700 hover:border-[#F26522] transition-colors disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-200 text-gray-700 hover:border-[#F26522] transition-colors disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
