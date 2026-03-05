"use client";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- Mock Data ---
const materialBreakdown = [
  { name: "Plastic", value: 28, color: "#0d9488" },
  { name: "Paper", value: 24, color: "#65a30d" },
  { name: "Glass", value: 18, color: "#16a34a" },
  { name: "Metal", value: 15, color: "#ca8a04" },
  { name: "Cardboard", value: 10, color: "#84cc16" },
  { name: "Electronics", value: 5, color: "#4ade80" },
];

const weeklyTrend = [
  { week: "Jan W1", kg: 4.2 },
  { week: "Jan W2", kg: 6.1 },
  { week: "Jan W3", kg: 5.5 },
  { week: "Jan W4", kg: 7.8 },
  { week: "Feb W1", kg: 6.9 },
  { week: "Feb W2", kg: 8.3 },
  { week: "Feb W3", kg: 7.1 },
  { week: "Feb W4", kg: 9.5 },
];

const monthlyComparison = [
  { month: "Sep", recycled: 18, target: 25 },
  { month: "Oct", recycled: 22, target: 25 },
  { month: "Nov", recycled: 30, target: 25 },
  { month: "Dec", recycled: 25, target: 25 },
  { month: "Jan", recycled: 29, target: 30 },
  { month: "Feb", recycled: 38, target: 30 },
];

const widgets = [
  { icon: "♻️", label: "Items This Month", value: "142", color: "bg-green-100 text-green-800 border-green-300" },
  { icon: "⚖️", label: "Weight Recycled", value: "38.5 kg", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { icon: "🌍", label: "CO₂ Offset", value: "22.3 kg", color: "bg-teal-100 text-teal-800 border-teal-300" },
  { icon: "💧", label: "Water Saved", value: "1,200 L", color: "bg-lime-100 text-lime-800 border-lime-300" },
];

export default function DashboardCharts() {
  return (
    <div className="flex flex-col gap-8">
      {/* Summary widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {widgets.map((w) => (
          <div
            key={w.label}
            className={`rounded-xl border p-4 flex flex-col gap-1 ${w.color}`}
          >
            <span className="text-2xl">{w.icon}</span>
            <p className="text-xs font-medium opacity-70">{w.label}</p>
            <p className="text-2xl font-bold">{w.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-green-200 p-5">
          <h2 className="text-base font-semibold text-green-900 mb-4">
            Material Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={materialBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {materialBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-xl border border-green-200 p-5">
          <h2 className="text-base font-semibold text-green-900 mb-4">
            Weekly Recycling Trend (kg)
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="kg"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ fill: "#16a34a" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-green-200 p-5">
        <h2 className="text-base font-semibold text-green-900 mb-4">
          Monthly Recycled vs Target (kg)
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="recycled" fill="#16a34a" name="Recycled (kg)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#bbf7d0" name="Target (kg)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
