import { MaterialType, MATERIAL_COLORS, MATERIAL_LABELS } from '../../../shared/lib/types';

// Supports two usage patterns:
//   <MaterialBadge material="PLASTIC" />           (from /my-logs, uses lib/recycling-data types)
//   <MaterialBadge label="Aluminium" color="yellow" />  (from /calculator and other pages)

type TailwindColor = "green" | "lime" | "emerald" | "teal" | "yellow";

interface MaterialTypeProps {
  material: MaterialType;
  label?: never;
  color?: never;
}

interface LabelColorProps {
  label: string;
  color?: TailwindColor;
  material?: never;
}

type MaterialBadgeProps = MaterialTypeProps | LabelColorProps;

const tailwindColorMap: Record<TailwindColor, string> = {
  green: "bg-green-100 text-green-800 border-green-300",
  lime: "bg-lime-100 text-lime-800 border-lime-300",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-300",
  teal: "bg-teal-100 text-teal-800 border-teal-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

export default function MaterialBadge(props: MaterialBadgeProps) {
  if (props.material !== undefined) {
    // MaterialType-based variant (used by /my-logs components)
    const bgColor = MATERIAL_COLORS[props.material];
    const displayLabel = MATERIAL_LABELS[props.material];
    return (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
        style={{ backgroundColor: bgColor }}
      >
        {displayLabel}
      </span>
    );
  }

  // Label + tailwind color variant (used by /calculator and other pages)
  const cls = tailwindColorMap[props.color ?? "green"];
  return (
    <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${cls}`}>
      {props.label}
    </span>
  );
}

