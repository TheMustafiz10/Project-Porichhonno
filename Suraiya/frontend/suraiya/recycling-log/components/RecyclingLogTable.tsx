'use client';
import { useState } from 'react';
import { RecyclingLogEntry } from '../../../shared/lib/types';
import MaterialBadge from '../../../shared/components/ui/MaterialBadge';

type SortKey = keyof Pick<RecyclingLogEntry, 'createdAt' | 'materialType' | 'weightKg' | 'disposalMethod' | 'pointsEarned' | 'co2SavedKg'>;

interface RecyclingLogTableProps {
  entries: RecyclingLogEntry[];
  onEdit: (entry: RecyclingLogEntry) => void;
  onDelete: (id: string) => void;
}

export default function RecyclingLogTable({ entries, onEdit, onDelete }: RecyclingLogTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(false); }
  }

  const sorted = [...entries].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    let cmp = 0;
    if (va instanceof Date && vb instanceof Date) cmp = va.getTime() - vb.getTime();
    else if (typeof va === 'number' && typeof vb === 'number') cmp = va - vb;
    else cmp = String(va).localeCompare(String(vb));
    return sortAsc ? cmp : -cmp;
  });

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="text-slate-300 ml-1">↕</span>;
    return <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-5xl mb-4">🌱</p>
        <p className="text-lg font-medium">No entries yet! Start logging your recycling.</p>
        <p className="text-sm mt-1">Use the form above to add your first entry.</p>
      </div>
    );
  }

  const thClass = "px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-green-700 whitespace-nowrap";

  return (
    <div className="overflow-x-auto rounded-2xl border border-green-100 shadow-sm bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-green-50 border-b border-green-100">
          <tr>
            <th className={thClass} onClick={() => toggleSort('createdAt')}>Date<SortIcon k="createdAt" /></th>
            <th className={thClass} onClick={() => toggleSort('materialType')}>Material<SortIcon k="materialType" /></th>
            <th className={thClass} onClick={() => toggleSort('weightKg')}>Weight (kg)<SortIcon k="weightKg" /></th>
            <th className={thClass} onClick={() => toggleSort('disposalMethod')}>Method<SortIcon k="disposalMethod" /></th>
            <th className={thClass} onClick={() => toggleSort('pointsEarned')}>Points<SortIcon k="pointsEarned" /></th>
            <th className={thClass} onClick={() => toggleSort('co2SavedKg')}>CO₂ Saved<SortIcon k="co2SavedKg" /></th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((entry) => (
            <tr key={entry.id} className="hover:bg-green-50 transition-colors">
              <td className="px-3 py-3 text-slate-700 whitespace-nowrap">
                {entry.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
              <td className="px-3 py-3">
                <MaterialBadge material={entry.materialType} />
              </td>
              <td className="px-3 py-3 text-slate-700">{entry.weightKg.toFixed(1)}</td>
              <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{entry.disposalMethod}</td>
              <td className="px-3 py-3 font-semibold text-yellow-600">{entry.pointsEarned}</td>
              <td className="px-3 py-3 text-emerald-700">{entry.co2SavedKg.toFixed(2)} kg</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(entry)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-green-700 hover:bg-green-100 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  {confirmDelete === entry.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { onDelete(entry.id); setConfirmDelete(null); }}
                        className="px-2 py-0.5 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-xs hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(entry.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

