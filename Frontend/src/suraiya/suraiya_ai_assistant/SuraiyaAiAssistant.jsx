import React, { useState, useRef, useEffect } from "react";

const QUICK_QUESTIONS = [
  "How do I recycle plastic bottles?",
  "What items can't go in the recycling bin?",
  "How do I dispose of old electronics?",
  "What is composting and how do I start?",
  "How can I reduce my plastic use?",
];

const QUOTA_FALLBACK_REPLY = `I am temporarily unavailable because the AI quota has been reached. Here are quick eco tips you can use now:

- Plastic bottles: rinse, dry, and place in recyclable bin.
- Food scraps: use compost/organic bin.
- Batteries and e-waste: keep separate and drop at hazardous collection points.
- Mixed or dirty materials: avoid recycling contamination by separating first.

Please try again in a few minutes.`;

export default function SuraiyaAiAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI Waste Assistant. Ask me anything about recycling, composting, or reducing waste — I'm here to help you live more sustainably! 🌿",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:1313/api";

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Prevent duplicate sends if already loading
    if (loading) {
      console.warn('Request already in progress, ignoring duplicate send');
      return;
    }

    // 1. Add user message to screen instantly
    const userMsg = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // 2. Talk to your REAL Gemini Backend
    try {
      console.log('📤 Sending request to:', `${API_BASE}/suraiya/ai-assistant/ask`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`${API_BASE}/suraiya/ai-assistant/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "suraiya_test_user_1", question: text }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();
      const backendMessage = String(data?.message || '').toLowerCase();
      const isQuotaExceeded =
        response.status === 429 ||
        backendMessage.includes('quota') ||
        backendMessage.includes('rate limit') ||
        backendMessage.includes('too many requests');

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: data?.data?.answer || 'No response generated.',
            isMock: data?.data?.isMock || false,
          },
        ]);
        
        // Log if mock response was used (for debugging)
        if (data?.data?.isMock || data?.warning) {
          console.info('ℹ️ Mock response returned:', data?.warning);
        }
      } else if (isQuotaExceeded) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: QUOTA_FALLBACK_REPLY,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: "Oops! Backend error: " + (data?.message || 'Request failed'),
          },
        ]);
      }
    } catch (error) {
      console.error("Request Failed:", error);
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      
      let errorMsg = "🚨 Error: Could not connect to the backend server.";
      if (error.name === 'AbortError') {
        errorMsg += " (Request timeout - backend may be slow)";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMsg += " Is your Node.js server running on port 1313?";
      } else {
        errorMsg += ` (${error.message})`;
      }
      
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: errorMsg
      }]);
    } finally {
      // Always turn off loading state
      setLoading(false);
    }
  };

  return (
    // Outer wrapper to fill the screen with that nice light green background
    <div className="min-h-screen bg-[#ecfdf5] flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#064e3b] mb-2">
          AI Waste Assistant
        </h1>
        <p className="text-[#047857]">Eco-Friendly Waste Sorting Guide</p>
      </div>

      {/* The perfectly sized chat box from your code */}
      <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[700px] w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-emerald-100">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4 md:p-6 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div
                  className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#10b981] text-white rounded-br-sm"
                      : "bg-[#ecfdf5] text-[#064e3b] border border-[#a7f3d0] rounded-bl-sm whitespace-pre-line"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <span className="text-base mr-2">🤖</span>
                  )}
                  {msg.content}
                </div>
                {msg.role === "assistant" && msg.isMock && (
                  <span className="text-xs text-amber-600 px-2 py-1 bg-amber-50 rounded-md border border-amber-200 self-start">
                    ⚠️ Demo Mode (API quota exceeded)
                  </span>
                )}
                {msg.role === "assistant" && msg.isMock === false && (
                  <span className="text-xs text-emerald-600 px-2 py-1 bg-emerald-50 rounded-md border border-emerald-200 self-start">
                    ✓ Real AI Response
                  </span>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#ecfdf5] border border-[#a7f3d0] px-5 py-3 rounded-2xl rounded-bl-sm text-sm text-[#047857] animate-pulse shadow-sm">
                🤖 Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="whitespace-nowrap text-sm bg-white border border-[#6ee7b7] text-[#047857] px-4 py-2 rounded-full hover:bg-[#d1fae5] transition-colors flex-shrink-0 shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 p-3 md:p-4 bg-white border-t border-gray-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage(input)}
            placeholder="Ask about recycling..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] bg-gray-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm md:text-base font-semibold transition-colors shadow-sm"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}