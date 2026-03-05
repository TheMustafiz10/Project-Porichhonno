'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RecyclingLogEntry, MaterialType, MATERIAL_COLORS, MATERIAL_LABELS } from '../../../shared/lib/types';

interface MaterialBreakdownMiniProps {
  entries: RecyclingLogEntry[];
}

export default function MaterialBreakdownMini({ entries }: MaterialBreakdownMiniProps) {
  // Aggregate by material
  const totals: Partial<Record<MaterialType, number>> = {};
  for (const e of entries) {
    totals[e.materialType] = (totals[e.materialType] ?? 0) + e.weightKg;
  }

  const data = Object.entries(totals).map(([material, value]) => ({
    name: MATERIAL_LABELS[material as MaterialType],
    value: parseFloat((value as number).toFixed(2)),
    color: MATERIAL_COLORS[material as MaterialType],
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-green-100 shadow-md p-6 flex items-center justify-center text-slate-400 text-sm h-full">
        No data yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-md p-6">
      <h2 className="text-lg font-bold text-green-800 mb-4">📊 Material Breakdown</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} kg`, 'Weight']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

