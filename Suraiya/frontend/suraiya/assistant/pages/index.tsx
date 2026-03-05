import ChatInterface from "../components/ChatInterface";
import CollapsibleSidebar from "../components/CollapsibleSidebar";

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <CollapsibleSidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-900">
            AI Waste Assistant 🤖
          </h1>
          <p className="text-green-700 mt-1">
            Get instant guidance on recycling, composting, and reducing your
            waste footprint.
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}

