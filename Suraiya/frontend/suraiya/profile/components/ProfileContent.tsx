import AchievementBadge from "../../../shared/components/ui/AchievementBadge";

const badges = [
  { icon: "🌟", title: "First Log", description: "Logged your first recycling entry", earned: true },
  { icon: "🔥", title: "7-Day Streak", description: "Recycled 7 days in a row", earned: true },
  { icon: "💧", title: "Water Saver", description: "Saved 100L of water equivalent", earned: true },
  { icon: "🌲", title: "Tree Planter", description: "Offset CO₂ equal to planting 5 trees", earned: true },
  { icon: "♻️", title: "100 Items", description: "Recycled 100 individual items", earned: true },
  { icon: "⚡", title: "Energy Star", description: "Saved 50 kWh of energy equivalent", earned: false },
  { icon: "🦋", title: "Eco Warrior", description: "Completed 30 days of recycling", earned: false },
  { icon: "🏆", title: "Top Recycler", description: "Reached 1,000 eco points", earned: false },
];

const progressStats = [
  { label: "Monthly Target", current: 38.5, target: 50, unit: "kg" },
  { label: "Eco Points", current: 1240, target: 2000, unit: "pts" },
  { label: "Streak", current: 12, target: 30, unit: "days" },
  { label: "Items Recycled", current: 142, target: 200, unit: "items" },
];

export function UserBanner() {
  return (
    <div className="bg-green-700 rounded-xl p-6 flex items-center gap-5 text-white shadow-lg">
      <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-4xl shadow-lg">
        🌿
      </div>
      <div>
        <h2 className="text-2xl font-bold">Suraiya S.</h2>
        <p className="text-green-200 text-sm mt-0.5">Eco Enthusiast · Member since Jan 2026</p>
        <div className="flex gap-3 mt-3 flex-wrap">
          <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-semibold text-white">
            🏆 1,240 pts
          </span>
          <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-semibold text-white">
            🔥 12-day streak
          </span>
          <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-semibold text-white">
            🏅 5 badges
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProfileContent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-green-900 mb-4">
          📊 Progress Towards Goals
        </h2>
        <div className="flex flex-col gap-4">
          {progressStats.map((stat) => {
            const percentage = Math.min((stat.current / stat.target) * 100, 100);
            return (
              <div key={stat.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-800 font-medium">{stat.label}</span>
                  <span className="text-green-600 font-semibold">
                    {stat.current} / {stat.target} {stat.unit}
                  </span>
                </div>
                <div className="w-full bg-green-100 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-0.5 text-right">{percentage.toFixed(0)}% complete</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-green-900 mb-4">
          🏅 Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <AchievementBadge key={badge.title} {...badge} />
          ))}
        </div>
      </div>
    </div>
  );
}

