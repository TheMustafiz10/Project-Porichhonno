'use client';
import { MaterialType, DisposalMethod, MATERIAL_LABELS } from '../../../shared/lib/types';

const MATERIAL_OPTIONS: MaterialType[] = ['PAPER', 'PLASTIC', 'METAL', 'GLASS', 'ELECTRONICS', 'ORGANIC'];
const DISPOSAL_OPTIONS: DisposalMethod[] = ['Drop-off Bin', 'Scheduled Pickup', 'Community Collection', 'Self-delivered'];

export interface FilterState {
  materials: MaterialType[];
  dateFrom: string;
  dateTo: string;
  method: DisposalMethod | '';
  search: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export default function FilterBar({ filters, onChange, totalCount, filteredCount }: FilterBarProps) {
  function toggleMaterial(m: MaterialType) {
    const next = filters.materials.includes(m)
      ? filters.materials.filter((x) => x !== m)
      : [...filters.materials, m];
    onChange({ ...filters, materials: next });
  }

  function clearAll() {
    onChange({ materials: [], dateFrom: '', dateTo: '', method: '', search: '' });
  }

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 mb-4">
      <div className="flex flex-wrap gap-3 items-start">
        {/* Material multi-select */}
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-xs font-semibold text-slate-500 mr-1">Material:</span>
          {MATERIAL_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => toggleMaterial(m)}
              className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                filters.materials.includes(m)
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-green-400'
              }`}
            >
              {MATERIAL_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold text-slate-500">From:</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="rounded border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <span className="font-semibold text-slate-500">To:</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="rounded border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Disposal method */}
        <select
          value={filters.method}
          onChange={(e) => onChange({ ...filters, method: e.target.value as DisposalMethod | '' })}
          className="rounded border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="">All Methods</option>
          {DISPOSAL_OPTIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search notes..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="rounded border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 min-w-0 flex-1"
        />

        {/* Clear */}
        <button
          onClick={clearAll}
          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Showing <span className="font-semibold text-green-700">{filteredCount}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> entries
      </p>
    </div>
  );
}

