interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  earned: boolean;
}

export default function AchievementBadge({
  icon,
  title,
  description,
  earned,
}: AchievementBadgeProps) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col items-center text-center gap-2 transition-all ${
        earned
          ? "bg-green-50 border-green-300 shadow-sm"
          : "bg-gray-50 border-gray-200 opacity-50"
      }`}
    >
      <span className="text-3xl">{icon}</span>
      <p className="text-sm font-semibold text-green-900">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
      {earned && (
        <span className="mt-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">
          Earned
        </span>
      )}
    </div>
  );
}
