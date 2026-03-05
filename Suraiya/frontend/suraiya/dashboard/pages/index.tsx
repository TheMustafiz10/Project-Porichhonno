import DashboardCharts from "../components/DashboardCharts";
import CollapsibleSidebar from "../components/CollapsibleSidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <CollapsibleSidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-900">
            Personal Impact Dashboard 📈
          </h1>
          <p className="text-green-700 mt-1">
            Visualise your recycling habits and track your environmental impact
            over time.
          </p>
        </div>
        <DashboardCharts />
      </div>
    </div>
  );
}

