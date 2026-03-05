"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "How do I recycle plastic bottles?",
  "What items can't go in the recycling bin?",
  "How do I dispose of old electronics?",
  "What is composting and how do I start?",
  "How can I reduce my plastic use?",
];

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Great question! In general, most clean dry recyclables like paper, cardboard, plastic bottles (#1–#2), glass jars, and metal cans are accepted curbside. Always check with your local council for specifics. 🌱",
  plastic:
    "Plastic bottles should be rinsed, have lids removed, and be flattened before placing in the recycling bin. Look for the recycling symbol with numbers 1 or 2 — those are most widely accepted. Avoid placing plastic bags in bins as they jam sorting machines. ♻️",
  recycle:
    "Items that generally can't go in recycling bins include: greasy pizza boxes, plastic bags, Styrofoam, dirty food containers, broken glass, and batteries. These need special disposal. 🚫",
  electronic:
    "Old electronics (phones, laptops, TVs) should go to dedicated e-waste drop-off points, not landfill. Many retailers offer take-back programs. The EcoTrack calculator can estimate the value of your e-waste! 💻",
  compost:
    "Composting is decomposing organic waste (food scraps, garden waste) into nutrient-rich soil. Start with a bin or pile, add a mix of 'greens' (food scraps) and 'browns' (dry leaves, cardboard), keep moist, and turn weekly. 🌿",
  plastic_use:
    "To reduce plastic: bring reusable bags, use a refillable water bottle, buy in bulk, choose products with minimal packaging, and opt for bamboo or glass alternatives. Even small swaps make a huge difference! 🌍",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("plastic bottle") || lower.includes("recycle plastic"))
    return MOCK_RESPONSES.plastic;
  if (lower.includes("can't") || lower.includes("cannot") || lower.includes("can not"))
    return MOCK_RESPONSES.recycle;
  if (lower.includes("electron") || lower.includes("e-waste") || lower.includes("phone") || lower.includes("laptop"))
    return MOCK_RESPONSES.electronic;
  if (lower.includes("compost")) return MOCK_RESPONSES.compost;
  if (lower.includes("reduce") && lower.includes("plastic")) return MOCK_RESPONSES.plastic_use;
  return MOCK_RESPONSES.default;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI Waste Assistant. Ask me anything about recycling, composting, or reducing waste — I'm here to help you live more sustainably! 🌿",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getBotResponse(text),
      };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-2xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4 bg-white rounded-t-xl border border-green-200">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-green-50 text-green-900 border border-green-200 rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="text-base mr-1">🤖</span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-green-600 animate-pulse">
              🤖 Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="bg-green-50 border-x border-green-200 px-4 py-2 flex gap-2 overflow-x-auto">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="whitespace-nowrap text-xs bg-white border border-green-300 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 bg-white border border-green-200 rounded-b-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about recycling, composting, waste reduction..."
          className="flex-1 border border-green-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
