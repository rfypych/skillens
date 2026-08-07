'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Add, Close, Flash, Group, UserAvatar } from '@carbon/icons-react';

// ── Types ───────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  archetype: 'analytical' | 'creative' | 'executor' | 'communicator' | 'stabilizer' | 'strategist';
}

export interface CandidateNode {
  name: string;
  archetype: string;
  fingerprint: {
    analytical_depth: number;
    communication_clarity: number;
    execution_velocity: number;
    integrity_index: number;
    creative_synthesis: number;
    pressure_resilience: number;
  };
}

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  role: string;
  archetype: TeamMember['archetype'] | 'candidate';
  isCandidate?: boolean;
  compatScore?: number; // 0-100 if candidate
}

interface Edge {
  from: string;
  to: string;
  strength: number; // 0-1
}

// ── Constants ────────────────────────────────────────────────────────────────

const ARCHETYPE_COLORS: Record<string, string> = {
  analytical:    '#6366F1',
  creative:      '#8B5CF6',
  executor:      '#F59E0B',
  communicator:  '#06B6D4',
  stabilizer:    '#10B981',
  strategist:    '#F26522',
  candidate:     '#111',
};

const ARCHETYPE_LABELS: Record<string, string> = {
  analytical:   'Analytical',
  creative:     'Creative',
  executor:     'Executor',
  communicator: 'Communicator',
  stabilizer:   'Stabilizer',
  strategist:   'Strategist',
};

// Compatibility matrix: how well archetypes work together (0-1)
const COMPAT: Record<string, Record<string, number>> = {
  analytical:   { analytical: 0.6, creative: 0.8, executor: 0.9, communicator: 0.7, stabilizer: 0.85, strategist: 0.9 },
  creative:     { analytical: 0.8, creative: 0.55, executor: 0.7, communicator: 0.85, stabilizer: 0.75, strategist: 0.8 },
  executor:     { analytical: 0.9, creative: 0.7, executor: 0.6, communicator: 0.8, stabilizer: 0.9, strategist: 0.75 },
  communicator: { analytical: 0.7, creative: 0.85, executor: 0.8, communicator: 0.55, stabilizer: 0.8, strategist: 0.85 },
  stabilizer:   { analytical: 0.85, creative: 0.75, executor: 0.9, communicator: 0.8, stabilizer: 0.5, strategist: 0.7 },
  strategist:   { analytical: 0.9, creative: 0.8, executor: 0.75, communicator: 0.85, stabilizer: 0.7, strategist: 0.5 },
};

function getCandidateArchetype(fp: CandidateNode['fingerprint']): TeamMember['archetype'] {
  const scores = [
    { key: 'analytical' as const,   val: fp.analytical_depth },
    { key: 'creative' as const,     val: fp.creative_synthesis },
    { key: 'executor' as const,     val: fp.execution_velocity },
    { key: 'communicator' as const, val: fp.communication_clarity },
    { key: 'stabilizer' as const,   val: fp.integrity_index },
    { key: 'strategist' as const,   val: fp.pressure_resilience },
  ];
  return scores.sort((a, b) => b.val - a.val)[0].key;
}

function calcCompatScore(candArchetype: string, teamMember: TeamMember): number {
  const base = COMPAT[candArchetype]?.[teamMember.archetype] ?? 0.5;
  return Math.round(base * 100);
}

function compatColor(score: number): string {
  if (score >= 75) return '#10B981';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

function layoutNodes(members: TeamMember[], hasCandidate: boolean, w: number, h: number): Node[] {
  const nodes: Node[] = [];
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.32;

  members.forEach((m, i) => {
    const angle = (2 * Math.PI * i) / members.length - Math.PI / 2;
    nodes.push({
      id: m.id,
      x: cx + Math.cos(angle) * R,
      y: cy + Math.sin(angle) * R,
      label: m.name,
      role: m.role,
      archetype: m.archetype,
    });
  });

  if (hasCandidate) {
    nodes.push({ id: 'candidate', x: cx, y: cy, label: 'Kandidat', role: 'Calon Anggota', archetype: 'candidate', isCandidate: true });
  }

  return nodes;
}

function buildEdges(nodes: Node[], candidate: CandidateNode | null): Edge[] {
  const edges: Edge[] = [];
  const memberNodes = nodes.filter(n => !n.isCandidate);

  // Member-to-member edges
  for (let i = 0; i < memberNodes.length; i++) {
    for (let j = i + 1; j < memberNodes.length; j++) {
      const a = memberNodes[i].archetype as string;
      const b = memberNodes[j].archetype as string;
      edges.push({ from: memberNodes[i].id, to: memberNodes[j].id, strength: COMPAT[a]?.[b] ?? 0.5 });
    }
  }

  // Candidate edges
  if (candidate) {
    const candArch = getCandidateArchetype(candidate.fingerprint);
    memberNodes.forEach(m => {
      const score = calcCompatScore(candArch, { id: m.id, name: m.label, role: m.role, archetype: m.archetype as TeamMember['archetype'] });
      edges.push({ from: 'candidate', to: m.id, strength: score / 100 });
    });
  }

  return edges;
}

// ── SVG Graph ────────────────────────────────────────────────────────────────

interface GraphProps {
  members: TeamMember[];
  candidate: CandidateNode | null;
  width: number;
  height: number;
}

function NetworkGraph({ members, candidate, width, height }: GraphProps) {
  const nodes = layoutNodes(members, !!candidate, width, height);
  const edges = buildEdges(nodes, candidate);
  const [hovered, setHovered] = useState<string | null>(null);

  // Annotate candidate compat scores onto nodes
  if (candidate) {
    const candArch = getCandidateArchetype(candidate.fingerprint);
    nodes.forEach(n => {
      if (!n.isCandidate) {
        n.compatScore = calcCompatScore(candArch, { id: n.id, name: n.label, role: n.role, archetype: n.archetype as TeamMember['archetype'] });
      }
    });
  }

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const NODE_R = 24;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map((e, i) => {
        const a = nodeMap[e.from];
        const b = nodeMap[e.to];
        if (!a || !b) return null;
        const isCandidateEdge = e.from === 'candidate' || e.to === 'candidate';
        const color = isCandidateEdge ? compatColor(Math.round(e.strength * 100)) : '#D1D5DB';
        const opacity = isCandidateEdge ? 0.8 : 0.4 + e.strength * 0.3;
        const width_line = isCandidateEdge ? 2 : 1;
        const dashArray = isCandidateEdge ? 'none' : '4 3';

        return (
          <line
            key={i}
            x1={a.x} y1={a.y}
            x2={b.x} y2={b.y}
            stroke={color}
            strokeWidth={width_line}
            strokeOpacity={opacity}
            strokeDasharray={dashArray}
            filter={isCandidateEdge ? 'url(#glow)' : undefined}
            style={{ transition: 'all 0.6s ease' }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const color = node.isCandidate
          ? '#111'
          : candidate && node.compatScore !== undefined
            ? compatColor(node.compatScore)
            : ARCHETYPE_COLORS[node.archetype] ?? '#6B7280';

        const isHovered = hovered === node.id;

        return (
          <g
            key={node.id}
            transform={`translate(${node.x},${node.y})`}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer', filter: isHovered ? 'url(#glow)' : undefined }}
          >
            {/* Glow ring when candidate node */}
            {node.isCandidate && (
              <circle
                r={NODE_R + 6}
                fill="none"
                stroke="#F26522"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.5}
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0" to="360"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Compat pulse ring */}
            {candidate && !node.isCandidate && node.compatScore !== undefined && (
              <circle
                r={NODE_R + 4}
                fill={compatColor(node.compatScore)}
                opacity={0.15}
                style={{ transition: 'all 0.6s ease' }}
              />
            )}

            {/* Main circle */}
            <circle
              r={isHovered ? NODE_R * 1.12 : NODE_R}
              fill={color}
              style={{ transition: 'r 0.2s ease' }}
            />

            {/* Initials */}
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize={node.isCandidate ? 10 : 11}
              fontWeight="700"
              fontFamily="Inter, sans-serif"
              letterSpacing={node.isCandidate ? 0 : 0.5}
            >
              {node.isCandidate ? '?' : node.label.slice(0, 2).toUpperCase()}
            </text>

            {/* Name label below */}
            <text
              y={NODE_R + 14}
              textAnchor="middle"
              fill="#111"
              fontSize={10}
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {node.label.split(' ')[0]}
            </text>
            <text
              y={NODE_R + 25}
              textAnchor="middle"
              fill="#6B7280"
              fontSize={9}
              fontFamily="Inter, sans-serif"
            >
              {node.isCandidate ? 'Kandidat' : ARCHETYPE_LABELS[node.archetype]}
            </text>

            {/* Compat score badge */}
            {candidate && !node.isCandidate && node.compatScore !== undefined && (
              <g transform={`translate(${NODE_R - 8}, ${-NODE_R + 4})`}>
                <rect x={-2} y={-8} width={22} height={14} rx={7} fill={compatColor(node.compatScore)} />
                <text
                  textAnchor="middle"
                  x={9}
                  y={1}
                  fill="white"
                  fontSize={8}
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {node.compatScore}%
                </text>
              </g>
            )}

            {/* Hover tooltip */}
            {isHovered && (
              <g transform={`translate(0, ${-NODE_R - 18})`}>
                <rect x={-40} y={-14} width={80} height={18} rx={9} fill="#111" />
                <text textAnchor="middle" y={-2} fill="white" fontSize={9} fontFamily="Inter, sans-serif" fontWeight="600">
                  {node.role}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  candidate?: CandidateNode | null;
  defaultMembers?: TeamMember[];
}

const DEFAULT_MEMBERS: TeamMember[] = [
  { id: 'tm1', name: 'Reza A.',    role: 'Engineering Lead',    archetype: 'analytical' },
  { id: 'tm2', name: 'Sari B.',    role: 'Product Manager',     archetype: 'strategist' },
  { id: 'tm3', name: 'Dian C.',    role: 'UX Designer',         archetype: 'creative' },
  { id: 'tm4', name: 'Budi D.',    role: 'QA Engineer',         archetype: 'stabilizer' },
];

export default function TeamDNAGraph({ candidate = null, defaultMembers = DEFAULT_MEMBERS }: Props) {
  const [members, setMembers]     = useState<TeamMember[]>(defaultMembers);
  const [showAdd, setShowAdd]     = useState(false);
  const [newName, setNewName]     = useState('');
  const [newRole, setNewRole]     = useState('');
  const [newArch, setNewArch]     = useState<TeamMember['archetype']>('executor');
  const [injected, setInjected]   = useState(false);
  const containerRef              = useRef<HTMLDivElement>(null);
  const [dims, setDims]           = useState({ w: 480, h: 380 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setDims({ w: width, h: Math.max(300, width * 0.75) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const addMember = () => {
    if (!newName.trim()) return;
    setMembers(prev => [...prev, {
      id: `tm${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Team Member',
      archetype: newArch,
    }]);
    setNewName(''); setNewRole(''); setShowAdd(false);
  };

  const removeMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));

  const teamHealthScore = useCallback(() => {
    if (members.length < 2) return 100;
    let total = 0, count = 0;
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        total += (COMPAT[members[i].archetype]?.[members[j].archetype] ?? 0.5) * 100;
        count++;
      }
    }
    return Math.round(total / count);
  }, [members]);

  const health = teamHealthScore();
  const healthColor = health >= 70 ? '#10B981' : health >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#10B981] flex items-center justify-center">
            <Group className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Team DNA Network</h3>
            <p className="text-[11px] text-gray-500 font-normal">
              Visualisasi sinergi kognitif tim — {members.length} anggota aktif
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Team Health Score */}
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Team Health</p>
            <p className="text-lg font-bold" style={{ color: healthColor }}>{health}<span className="text-xs text-gray-400">/100</span></p>
          </div>

          <button
            onClick={() => setShowAdd(v => !v)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            title="Tambah anggota tim"
          >
            <Add className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Add member form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-100"
          >
            <div className="px-6 py-4 bg-gray-50/60 flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nama</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Budi Santoso"
                  className="px-3 py-2 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] bg-white w-36"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Peran</label>
                <input
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  placeholder="Frontend Engineer"
                  className="px-3 py-2 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] bg-white w-40"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tipe Kognitif</label>
                <select
                  value={newArch}
                  onChange={e => setNewArch(e.target.value as TeamMember['archetype'])}
                  className="px-3 py-2 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26522] bg-white"
                >
                  {Object.entries(ARCHETYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={addMember}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-700 transition-colors"
              >
                Tambah
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graph */}
      <div ref={containerRef} className="px-4 pt-6 pb-2">
        <NetworkGraph members={members} candidate={injected ? candidate ?? null : null} width={dims.w} height={dims.h} />
      </div>

      {/* Inject toggle */}
      {candidate && (
        <div className="px-6 pb-5 flex items-center justify-between">
          <p className="text-[11px] text-gray-500 font-normal">
            {injected
              ? 'Kandidat dimasukkan ke simulasi tim. Warna menunjukkan tingkat kompatibilitas.'
              : 'Masukkan kandidat ke dalam simulasi tim untuk melihat dampaknya.'}
          </p>
          <button
            onClick={() => setInjected(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              injected
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-gradient-to-r from-[#F26522] to-[#8B5CF6] text-white shadow-sm hover:opacity-90'
            }`}
          >
            <Flash className="w-3.5 h-3.5" />
            {injected ? 'Keluarkan Kandidat' : 'Injeksi ke Tim'}
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="px-6 pb-4 pt-2 border-t border-gray-50 flex flex-wrap gap-4">
        {[
          { color: '#10B981', label: '≥75% Kompatibel' },
          { color: '#F59E0B', label: '50–74% Moderat' },
          { color: '#EF4444', label: '<50% Risiko Friksi' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            <span className="text-[10px] text-gray-500 font-medium">{l.label}</span>
          </div>
        ))}

        {/* Member chips */}
        <div className="flex-1" />
        <div className="flex flex-wrap gap-2">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
              <div className="w-2 h-2 rounded-full" style={{ background: ARCHETYPE_COLORS[m.archetype] }} />
              {m.name.split(' ')[0]}
              <button onClick={() => removeMember(m.id)} className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors">
                <Close className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
