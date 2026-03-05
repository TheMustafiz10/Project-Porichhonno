'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SIDEBAR_LINKS = [
  { href: '/profile', label: 'Profile Overview', icon: '👤' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/assistant', label: 'AI Assistant', icon: '🤖' },
  { href: '/calculator', label: 'Calculator', icon: '🧮' },
  { href: '/my-logs', label: 'My Logs', icon: '📝' },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white rounded-xl border border-green-200 p-4 h-fit sticky top-24">
      <h3 className="font-semibold text-green-900 mb-4 text-sm">Quick Links</h3>
      <nav className="flex flex-col gap-2">
        {SIDEBAR_LINKS.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              pathname === href
                ? 'bg-green-600 text-white shadow-md'
                : 'text-green-700 hover:bg-green-50 hover:text-green-800'
            }`}
          >
            <span className="mr-2">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Stats Box */}
      <div className="mt-6 pt-4 border-t border-green-200">
        <p className="text-xs text-gray-500 mb-3 font-semibold">QUICK STATS</p>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Level</span>
            <span className="font-semibold text-green-600">5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Streak</span>
            <span className="font-semibold text-green-600">12 days 🔥</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Points</span>
            <span className="font-semibold text-green-600">1,240</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
