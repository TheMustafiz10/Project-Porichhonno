// import SuraiyaAiAssistant from './suraiya/suraiya_ai_assistant/SuraiyaAiAssistant.jsx';

// function App() {
//   return <SuraiyaAiAssistant userId="suraiya_test_user_1" />;
// }

// export default App;

import React, { useState } from 'react';
// Your exact AI Assistant import path:
import SuraiyaAiAssistant from './suraiya/suraiya_ai_assistant/SuraiyaAiAssistant.jsx';
// Suraiya profile feature component:
import Suraiya_Profile from './Suraiya_Profile.jsx';

function App() {
  // This state controls which page is visible ('assistant' or 'profile')
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <div className="min-h-screen bg-[#ecfdf5] font-sans">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo area */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-extrabold text-xl text-[#064e3b]">Porichonno</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'assistant'
                    ? 'bg-[#10b981] text-white shadow-sm'
                    : 'text-[#047857] hover:bg-[#d1fae5]'
                }`}
              >
                AI Assistant
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[#10b981] text-white shadow-sm'
                    : 'text-[#047857] hover:bg-[#d1fae5]'
                }`}
              >
                Profile
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area: Renders the component based on activeTab */}
      <main className="p-4">
        {activeTab === 'assistant' && <SuraiyaAiAssistant userId="suraiya_test_user_1" />}
        {activeTab === 'profile' && <Suraiya_Profile />}
      </main>

    </div>
  );
}

export default App;