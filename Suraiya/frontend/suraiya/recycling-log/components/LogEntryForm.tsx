'use client';
import { useState } from 'react';
import {
  MaterialType,
  DisposalMethod,
  MATERIAL_LABELS,
  POINTS_PER_KG,
  CO2_PER_KG,
  RecyclingLogEntry,
} from '../../../shared/lib/types';

interface LogEntryFormProps {
  onAdd: (entry: RecyclingLogEntry) => void;
  onAchievement?: (message: string) => void;
}

const MATERIAL_OPTIONS: MaterialType[] = ['PAPER', 'PLASTIC', 'METAL', 'GLASS', 'ELECTRONICS', 'ORGANIC'];
const DISPOSAL_OPTIONS: DisposalMethod[] = ['Drop-off Bin', 'Scheduled Pickup', 'Community Collection', 'Self-delivered'];

const MATERIAL_EMOJIS: Record<MaterialType, string> = {
  PAPER: '🟫',
  PLASTIC: '🟦',
  METAL: '⬜',
  GLASS: '🩵',
  ELECTRONICS: '🟣',
  ORGANIC: '🟩',
};

export default function LogEntryForm({ onAdd, onAchievement }: LogEntryFormProps) {
  const [material, setMaterial] = useState<MaterialType>('PLASTIC');
  const [weight, setWeight] = useState<number>(1.0);
  const [method, setMethod] = useState<DisposalMethod>('Drop-off Bin');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitCount, setSubmitCount] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const estimatedPoints = Math.round(weight * POINTS_PER_KG[material]);
  const estimatedCo2 = parseFloat((weight * CO2_PER_KG[material]).toFixed(2));

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!material) errs.material = 'Please select a material';
    if (!weight || weight <= 0) errs.weight = 'Weight must be greater than 0';
    if (!method) errs.method = 'Please select a disposal method';
    if (!date) errs.date = 'Please select a date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const entry: RecyclingLogEntry = {
      id: Date.now().toString(),
      materialType: material,
      weightKg: weight,
      disposalMethod: method,
      pointsEarned: estimatedPoints,
      co2SavedKg: estimatedCo2,
      notes: notes || undefined,
      createdAt: new Date(date),
    };

    onAdd(entry);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Trigger 'Eco Starter' achievement only on the very first submission
    if (submitCount === 0 && onAchievement) {
      onAchievement("🏅 Congratulations! You earned the 'Eco Starter' badge!");
    }
    setSubmitCount((c) => c + 1);

    // Reset form
    setWeight(1.0);
    setNotes('');
    setErrors({});
  }

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-md p-6">
      <h2 className="text-xl font-bold text-green-800 mb-4">➕ Add New Entry</h2>

      {showSuccess && (
        <div className="mb-4 rounded-lg bg-green-100 border border-green-300 px-4 py-3 text-green-800 text-sm font-medium">
          ✅ Entry logged successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Material Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Material Type</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as MaterialType)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {MATERIAL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {MATERIAL_EMOJIS[m]} {MATERIAL_LABELS[m]}
              </option>
            ))}
          </select>
          {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material}</p>}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeight((w) => Math.max(0.1, parseFloat((w - 0.1).toFixed(1))))}
              className="w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold hover:bg-green-200 flex items-center justify-center"
            >
              −
            </button>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setWeight((w) => parseFloat((w + 0.1).toFixed(1)))}
              className="w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold hover:bg-green-200 flex items-center justify-center"
            >
              +
            </button>
            <span className="text-sm text-slate-500">kg</span>
          </div>
          {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
        </div>

        {/* Disposal Method */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Disposal Method</label>
          <div className="flex flex-wrap gap-2">
            {DISPOSAL_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value={opt}
                  checked={method === opt}
                  onChange={() => setMethod(opt)}
                  className="accent-green-600"
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
          {errors.method && <p className="text-red-500 text-xs mt-1">{errors.method}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any additional info..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {/* Live Preview */}
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          <span className="font-semibold">Estimated: </span>
          <span className="text-yellow-600 font-bold">🏆 {estimatedPoints} pts</span>
          <span className="mx-2 text-slate-400">|</span>
          <span className="text-emerald-700 font-bold">🌿 {estimatedCo2} kg CO₂ saved</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-base transition-colors shadow-sm"
        >
          🌱 Log Recycling
        </button>
      </form>
    </div>
  );
}

