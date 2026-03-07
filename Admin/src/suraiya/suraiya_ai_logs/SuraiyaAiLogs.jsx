import { useEffect, useState } from 'react';
import { deleteLog, exportLogsToCSV, getAllLogs, getAnalytics } from './suraiya_ai_admin.service';

function SuraiyaAiLogs() {
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: 'all',
    isHelpful: 'all',
    search: '',
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getAllLogs(filters);
        setLogs(response.data.logs || []);
        setPagination(response.data.pagination || pagination);
      } catch (apiError) {
        setError(apiError?.message || 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await getAnalytics();
        setAnalytics(response.data || null);
      } catch (_apiError) {
        setAnalytics(null);
      }
    };

    loadAnalytics();
  }, []);

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, page: 1, [key]: value }));
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this log?')) {
      return;
    }

    await deleteLog(id);
    setFilters((prev) => ({ ...prev }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">EcoCycle Green Admin</h1>
          <p className="text-emerald-100">AI Assistant Logs and Analytics</p>
        </header>

        {analytics && (
          <section className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow">Total: {analytics.totalQueries ?? 0}</div>
            <div className="rounded-xl bg-white p-4 shadow">Helpful: {analytics.feedback?.helpful ?? 0}</div>
            <div className="rounded-xl bg-white p-4 shadow">Not Helpful: {analytics.feedback?.notHelpful ?? 0}</div>
            <div className="rounded-xl bg-white p-4 shadow">
              Avg Time: {analytics.responseTime?.avgTime ? `${Math.round(analytics.responseTime.avgTime)}ms` : 'N/A'}
            </div>
          </section>
        )}

        <section className="rounded-xl bg-white p-4 shadow">
          <div className="grid gap-3 md:grid-cols-5">
            <input
              value={filters.search}
              onChange={(event) => onFilterChange('search', event.target.value)}
              placeholder="Search"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <select
              value={filters.category}
              onChange={(event) => onFilterChange('category', event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="all">All categories</option>
              <option value="organic">Organic</option>
              <option value="recyclable">Recyclable</option>
              <option value="hazardous">Hazardous</option>
              <option value="non-recyclable">Non-recyclable</option>
              <option value="general">General</option>
              <option value="unknown">Unknown</option>
            </select>
            <select
              value={filters.isHelpful}
              onChange={(event) => onFilterChange('isHelpful', event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="all">All feedback</option>
              <option value="true">Helpful</option>
              <option value="false">Not helpful</option>
              <option value="null">No feedback</option>
            </select>
            <select
              value={filters.limit}
              onChange={(event) => onFilterChange('limit', Number(event.target.value))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <button
              type="button"
              onClick={() => exportLogsToCSV(filters)}
              className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white"
            >
              Export CSV
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Helpful</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td className="px-4 py-4" colSpan={5}>Loading...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td className="px-4 py-4 text-red-700" colSpan={5}>{error}</td>
                  </tr>
                )}
                {!loading && !error && logs.length === 0 && (
                  <tr>
                    <td className="px-4 py-4" colSpan={5}>No logs found</td>
                  </tr>
                )}
                {!loading && !error &&
                  logs.map((log) => (
                    <tr key={log._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{log.userQuestion}</td>
                      <td className="px-4 py-3">{log.wasteCategory}</td>
                      <td className="px-4 py-3">{String(log.isHelpful)}</td>
                      <td className="px-4 py-3">{log.responseTime ?? 'N/A'} ms</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onDelete(log._id)}
                          className="rounded-md bg-red-100 px-3 py-1 text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="flex items-center justify-between rounded-xl bg-white p-4 shadow">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <div className="space-x-2">
            <button
              type="button"
              disabled={filters.page <= 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={filters.page >= pagination.pages}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SuraiyaAiLogs;
