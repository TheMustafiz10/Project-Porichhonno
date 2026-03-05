interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color?: "green" | "lime" | "emerald" | "teal";
}

const colorMap: Record<string, string> = {
  green: "bg-green-50 border-green-200 text-green-800",
  lime: "bg-lime-50 border-lime-200 text-lime-800",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
  teal: "bg-teal-50 border-teal-200 text-teal-800",
};

export default function StatCard({
  icon,
  label,
  value,
  sub,
  color = "green",
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-1 ${colorMap[color]}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium opacity-70">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-60">{sub}</p>}
    </div>
  );
}
