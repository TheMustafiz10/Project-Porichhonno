import ScrapRateCalculator from "../components/ScrapRateCalculator";
import CollapsibleSidebar from "../components/CollapsibleSidebar";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <CollapsibleSidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-900">
            Scrap Rate Calculator 🧮
          </h1>
          <p className="text-green-700 mt-1">
            Estimate the value of your recyclable materials and your CO₂
            savings.
          </p>
        </div>
        <ScrapRateCalculator />
      </div>
    </div>
  );
}

