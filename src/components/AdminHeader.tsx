'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Moon,
  Sun,
  ShieldAlert,
  Clock,
  CheckCircle,
  X,
  Users,
} from 'lucide-react';
import NextLink from 'next/link';

interface AdminHeaderProps {
  gymName?: string;
  userName?: string;
  remainingTrialDays?: number;
  isExpired?: boolean;
  activeOccupancy?: number;
}

export default function AdminHeader({
  gymName = 'FitZone Pro Club',
  userName = 'Kemal Yılmaz',
  remainingTrialDays = 5,
  isExpired = false,
  activeOccupancy = 9,
}: AdminHeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Dark mode check
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }

    // Fetch notifications
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-72">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Üye, kod veya antrenör ara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Right Actions & Status Badges */}
      <div className="flex items-center gap-4">
        {/* Live In-Gym Occupancy Indicator */}
        <NextLink
          href="/admin/check-in"
          className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Users className="w-3.5 h-3.5" />
          <span>Şu anda salonda: <strong className="font-bold">{activeOccupancy} kişi</strong></span>
        </NextLink>

        {/* 7-Day Trial Status Badge */}
        {isExpired ? (
          <NextLink
            href="/admin/settings"
            className="flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-full text-xs font-semibold hover:bg-red-200 transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Deneme Süresi Sona Erdi</span>
          </NextLink>
        ) : (
          <NextLink
            href="/admin/settings"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
              remainingTrialDays <= 2
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Deneme sürenizin bitmesine <strong className="font-bold">{remainingTrialDays} gün kaldı</strong></span>
          </NextLink>
        )}

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={darkMode ? 'Açık Moda Geç' : 'Karanlık Moda Geç'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                  Bildirimler ({unreadCount})
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Tümünü Okundu Say
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">Yeni bildirim bulunmuyor.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition ${
                        !n.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                        {n.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
              {userName}
            </p>
            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
              {gymName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
