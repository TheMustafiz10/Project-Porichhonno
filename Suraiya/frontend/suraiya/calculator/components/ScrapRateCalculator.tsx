"use client";

import { useState } from "react";
import MaterialBadge from "../../../shared/components/ui/MaterialBadge";

interface Material {
  name: string;
  ratePerKg: number;
  unit: string;
  badge: "green" | "lime" | "emerald" | "teal" | "yellow";
  co2PerKg: number;
}

const MATERIALS: Material[] = [
  { name: "Aluminium Cans", ratePerKg: 1.20, unit: "kg", badge: "yellow", co2PerKg: 9.5 },
  { name: "Cardboard", ratePerKg: 0.08, unit: "kg", badge: "lime", co2PerKg: 1.1 },
  { name: "Copper Wire", ratePerKg: 6.50, unit: "kg", badge: "yellow", co2PerKg: 3.8 },
  { name: "HDPE Plastic (#2)", ratePerKg: 0.30, unit: "kg", badge: "teal", co2PerKg: 2.5 },
  { name: "Iron / Steel", ratePerKg: 0.15, unit: "kg", badge: "green", co2PerKg: 1.8 },
  { name: "Mixed Glass", ratePerKg: 0.05, unit: "kg", badge: "emerald", co2PerKg: 0.6 },
  { name: "Mixed Paper", ratePerKg: 0.06, unit: "kg", badge: "lime", co2PerKg: 0.9 },
  { name: "PET Plastic (#1)", ratePerKg: 0.25, unit: "kg", badge: "teal", co2PerKg: 2.2 },
  { name: "Stainless Steel", ratePerKg: 0.35, unit: "kg", badge: "green", co2PerKg: 2.1 },
  { name: "Tin Cans", ratePerKg: 0.10, unit: "kg", badge: "green", co2PerKg: 1.4 },
];

const RATE_TABLE_COLS = ["Material", "Rate / kg", "CO₂ Saved / kg"];

export default function ScrapRateCalculator() {
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0].name);
  const [weight, setWeight] = useState<string>("");

  const material = MATERIALS.find((m) => m.name === selectedMaterial)!;
  const weightNum = parseFloat(weight) || 0;
  const earnings = (weightNum * material.ratePerKg).toFixed(2);
  const co2Saved = (weightNum * material.co2PerKg).toFixed(2);

  return (
    <div className="flex flex-col gap-8">
      {/* Calculator Card */}
      <div className="bg-white rounded-xl border border-green-200 p-6 max-w-lg">
        <h2 className="text-base font-semibold text-green-900 mb-4">
          🧮 Calculate Your Earnings
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-green-700 font-medium">
              Select Material
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {MATERIALS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} — ${m.ratePerKg.toFixed(2)}/kg
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-green-700 font-medium">
              Weight (kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Result */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">Material</span>
              <MaterialBadge label={material.name} color={material.badge} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">Rate</span>
              <span className="font-semibold text-green-900">
                ${material.ratePerKg.toFixed(2)} / kg
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">Estimated Earnings</span>
              <span className="text-xl font-bold text-green-700">
                ${earnings}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">CO₂ Saved</span>
              <span className="font-semibold text-emerald-700">
                {co2Saved} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Table */}
      <div>
        <h2 className="text-base font-semibold text-green-900 mb-3">
          📋 Current Scrap Rates
        </h2>
        <div className="overflow-x-auto rounded-xl border border-green-200">
          <table className="min-w-full text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                {RATE_TABLE_COLS.map((col) => (
                  <th key={col} className="px-4 py-3 text-left font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATERIALS.map((m, idx) => (
                <tr
                  key={m.name}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-green-50"} ${
                    m.name === selectedMaterial ? "ring-1 ring-green-400" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    <MaterialBadge label={m.name} color={m.badge} />
                  </td>
                  <td className="px-4 py-2 font-semibold text-green-800">
                    ${m.ratePerKg.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-emerald-700">
                    {m.co2PerKg} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * Rates are indicative and may vary by region and market conditions.
        </p>
      </div>
    </div>
  );
}

