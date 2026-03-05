'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const SIDEBAR_LINKS = [
  { href: '/profile', label: 'Profile' },
  { href: '/my-logs', label: 'My Logs' },
  { href: '/assistant', label: 'AI Assistant' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/calculator', label: 'Calculator' },
];

export default function CollapsibleSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-16 z-50 bg-emerald-500 text-white p-2 rounded-lg shadow-lg hover:bg-emerald-600 transition-all ${
          isOpen ? 'left-52' : 'left-4'
        }`}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-emerald-200 z-40 transform transition-transform duration-300 ease-in-out pt-20 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <nav className="flex flex-col gap-2">
            {SIDEBAR_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  pathname === href
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Stats Box */}
          <div className="mt-6 pt-4 border-t border-emerald-200">
            <div className="flex flex-col gap-2 text-xs text-center">
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="block text-emerald-600 font-bold">5</span>
                <span className="text-gray-500 text-[10px]">Level</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="block text-emerald-600 font-bold">🔥 12</span>
                <span className="text-gray-500 text-[10px]">Days</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-200">
                <span className="block text-emerald-600 font-bold">1,240</span>
                <span className="text-gray-500 text-[10px]">Points</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
