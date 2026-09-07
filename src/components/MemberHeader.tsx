'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Bell, LogOut, Shield, ChevronLeft } from 'lucide-react';

interface MemberHeaderProps {
  gymName?: string;
  gymLogo?: string | null;
  memberName?: string;
  memberCode?: string;
  showBack?: boolean;
}

export default function MemberHeader({
  gymName = 'FitZone Club',
  gymLogo,
  memberName = 'Caner Erkin',
  memberCode = 'GYM-A7K92X',
  showBack = false,
}: MemberHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack ? (
          <NextLink
            href="/member"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </NextLink>
        ) : (
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
            {gymLogo ? (
              <img src={gymLogo} alt={gymName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-xs text-blue-600">FZ</span>
            )}
          </div>
        )}

        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            {gymName}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Kod: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{memberCode}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        <NextLink
          href="/member/notifications"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </NextLink>

        {/* Profile Avatar Button */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm"
        >
          {memberName.charAt(0)}
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-11 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
              <p className="font-bold text-xs text-slate-900 dark:text-white">{memberName}</p>
              <p className="text-[10px] text-slate-400">{memberCode}</p>
            </div>
            <NextLink
              href="/admin"
              className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Paneline Geç</span>
            </NextLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
