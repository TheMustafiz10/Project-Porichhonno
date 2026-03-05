'use client';
import { useState, useMemo } from 'react';
import { RecyclingLogEntry, MOCK_ENTRIES } from '../../../shared/lib/types';
import CollapsibleSidebar from '../components/CollapsibleSidebar';
import PageHeader from '../components/PageHeader';
import QuickStatsBar from '../components/QuickStatsBar';
import LogEntryForm from '../components/LogEntryForm';
import RecyclingLogTable from '../components/RecyclingLogTable';
import FilterBar, { FilterState } from '../components/FilterBar';
import Pagination from '../components/Pagination';
import MaterialBreakdownMini from '../components/MaterialBreakdownMini';
import RecentAchievementToast from '../components/RecentAchievementToast';

const DEFAULT_FILTERS: FilterState = {
  materials: [],
  dateFrom: '',
  dateTo: '',
  method: '',
  search: '',
};

export default function MyLogsPage() {
  const [entries, setEntries] = useState<RecyclingLogEntry[]>(MOCK_ENTRIES);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [achievement, setAchievement] = useState<string | null>(null);

  function handleAdd(entry: RecyclingLogEntry) {
    setEntries((prev) => [entry, ...prev]);
    setPage(1);
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handleEdit(entry: RecyclingLogEntry) {
    // For now, scroll to form - full edit modal can be added later
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Edit entry:', entry.id);
  }

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filters.materials.length > 0 && !filters.materials.includes(e.materialType)) return false;
      if (filters.dateFrom && e.createdAt < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && e.createdAt > new Date(filters.dateTo + 'T23:59:59')) return false;
      if (filters.method && e.disposalMethod !== filters.method) return false;
      if (filters.search && !e.notes?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [entries, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handlePageChange(newPage: number) {
    setPage(Math.min(Math.max(1, newPage), totalPages));
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-green-50">
      <CollapsibleSidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader />
        <QuickStatsBar entries={entries} />

        {/* Middle row: Form + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <LogEntryForm onAdd={handleAdd} onAchievement={setAchievement} />
          </div>
          <div className="lg:col-span-1">
            <MaterialBreakdownMini entries={entries} />
          </div>
        </div>

        {/* Filter + Table + Pagination */}
        <FilterBar
          filters={filters}
          onChange={(f) => { setFilters(f); setPage(1); }}
          totalCount={entries.length}
          filteredCount={filtered.length}
        />
        <RecyclingLogTable entries={paginated} onEdit={handleEdit} onDelete={handleDelete} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <RecentAchievementToast message={achievement} onDismiss={() => setAchievement(null)} />
    </div>
  );
}

