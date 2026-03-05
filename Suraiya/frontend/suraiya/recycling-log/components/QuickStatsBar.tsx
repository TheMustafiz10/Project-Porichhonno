import StatCard from '../../../shared/components/ui/StatCard';
import { RecyclingLogEntry } from '../../../shared/lib/types';

interface QuickStatsBarProps {
  entries: RecyclingLogEntry[];
}

export default function QuickStatsBar({ entries }: QuickStatsBarProps) {
  const totalWeight = entries.reduce((sum, e) => sum + e.weightKg, 0);
  const totalCo2 = entries.reduce((sum, e) => sum + e.co2SavedKg, 0);
  const totalPoints = entries.reduce((sum, e) => sum + e.pointsEarned, 0);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <StatCard icon="🔄" value={entries.length} label="Total Entries" />
      <StatCard icon="⚖️" value={`${totalWeight.toFixed(1)} kg`} label="Total Weight" />
      <StatCard icon="🌿" value={`${totalCo2.toFixed(1)} kg`} label="CO₂ Saved" />
      <StatCard icon="🏆" value={totalPoints} label="Points Earned" />
    </div>
  );
}

