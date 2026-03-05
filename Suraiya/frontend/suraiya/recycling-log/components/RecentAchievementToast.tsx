'use client';
import { useEffect } from 'react';
import Link from 'next/link';

interface RecentAchievementToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function RecentAchievementToast({ message, onDismiss }: RecentAchievementToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-green-800 text-white shadow-2xl px-5 py-4 flex items-start gap-3 animate-bounce-in">
      <span className="text-2xl">🏅</span>
      <div className="flex-1">
        <p className="font-bold text-sm">Achievement Unlocked!</p>
        <p className="text-green-100 text-sm mt-0.5">{message}</p>
        <Link href="/profile" className="text-green-300 text-xs underline mt-1 inline-block hover:text-white">
          View Profile →
        </Link>
      </div>
      <button onClick={onDismiss} className="text-green-300 hover:text-white text-lg leading-none">×</button>
    </div>
  );
}
