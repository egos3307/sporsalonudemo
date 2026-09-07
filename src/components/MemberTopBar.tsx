'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import {
  Search,
  Bell,
  QrCode,
  Dumbbell,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Utensils,
  Activity,
  Home,
} from 'lucide-react';

interface MemberTopBarProps {
  gymName?: string;
  gymLogo?: string | null;
  memberName?: string;
  memberCode?: string;
  primaryColor?: string;
  unreadNotifications?: number;
}

export default function MemberTopBar({
  gymName = 'FitZone Pro Club',
  gymLogo,
  memberName = 'Caner Erkin',
  memberCode = 'GYM-A7K92X',
  primaryColor = '#22c55e',
  unreadNotifications = 2,
}: MemberTopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Gym Brand / Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-white uppercase">{gymName}</span>
          </div>
        </div>

        {/* Search Bar matching the design */}
        <div className="hidden sm:flex relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Egzersiz, ders veya antrenör ara..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition"
          />
        </div>

        {/* Right action tools */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
          {/* QR Button shortcut */}
          <NextLink
            href="/member/qr"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Turnike QR</span>
          </NextLink>

          {/* Notifications */}
          <NextLink
            href="/member/notifications"
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
            )}
          </NextLink>

          {/* Member Profile Badge matching the screenshot ("Ahmet Yılmaz - Üye") */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-emerald-500/20">
              {memberName.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{memberName}</p>
              <p className="text-[10px] font-semibold text-emerald-400">Kulüp Üyesi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800/80 space-y-1 animate-in fade-in slide-in-from-top-2">
          <NextLink
            href="/member"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Ana Sayfa</span>
          </NextLink>
          <NextLink
            href="/member/workout"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
          >
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span>Antrenman Programım</span>
          </NextLink>
          <NextLink
            href="/member/diet"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
          >
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>Diyetim (Beslenme)</span>
          </NextLink>
          <NextLink
            href="/member/measurements"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Vücut Ölçüm & İlerleme</span>
          </NextLink>
          <NextLink
            href="/member/qr"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Turnike Giriş QR</span>
          </NextLink>
        </div>
      )}
    </header>
  );
}
