'use client';

import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Utensils,
  QrCode,
  Activity,
  UserCheck,
  Settings,
  ShieldAlert,
  LogOut,
  Building2,
  ChevronRight,
  Compass,
  Globe,
  ExternalLink,
} from 'lucide-react';
import NextLink from 'next/link';

interface AdminSidebarProps {
  gymName?: string;
  gymSlug?: string;
  gymLogo?: string | null;
  primaryColor?: string;
  role?: string;
  isExpired?: boolean;
}

export default function AdminSidebar({
  gymName = 'FitZone Pro Club',
  gymSlug = 'fitzone',
  gymLogo,
  primaryColor = '#2563eb',
  role = 'GYM_ADMIN',
  isExpired = false,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Genel Bakış',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      name: 'Üye Yönetimi',
      href: '/admin/members',
      icon: Users,
      active: pathname.startsWith('/admin/members'),
    },
    {
      name: 'QR Turnike & Giriş',
      href: '/admin/check-in',
      icon: QrCode,
      active: pathname.startsWith('/admin/check-in'),
      badge: 'Canlı',
    },
    {
      name: 'Antrenmanlar',
      href: '/admin/workouts',
      icon: Dumbbell,
      active: pathname.startsWith('/admin/workouts'),
    },
    {
      name: 'Diyet & Beslenme',
      href: '/admin/diets',
      icon: Utensils,
      active: pathname.startsWith('/admin/diets'),
    },
    {
      name: 'Vücut Gelişim & Ölçüm',
      href: '/admin/measurements',
      icon: Activity,
      active: pathname.startsWith('/admin/measurements'),
    },
    {
      name: 'Antrenörler',
      href: '/admin/trainers',
      icon: UserCheck,
      active: pathname.startsWith('/admin/trainers'),
    },
    {
      name: 'Salon & Marka Ayarları',
      href: '/admin/settings',
      icon: Settings,
      active: pathname.startsWith('/admin/settings'),
    },
    ...(role === 'SUPER_ADMIN'
      ? [
          {
            name: 'Potansiyel Müşteriler',
            href: '/admin/leads',
            icon: Compass,
            active: pathname.startsWith('/admin/leads'),
            badge: 'B2B',
          },
        ]
      : []),
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40 select-none">
      {/* Gym Brand Identity */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          {gymLogo ? (
            <img src={gymLogo} alt={gymName} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <Building2 className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white truncate">
            {gymName}
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {role === 'SUPER_ADMIN' ? 'Süper Admin (SaaS)' : role === 'TRAINER' ? 'Antrenör Paneli' : 'Yönetim Paneli'}
          </span>
        </div>
      </div>

      {/* Trial Expired Alert in Sidebar */}
      {isExpired && (
        <div className="mx-3 mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-xs mb-1">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Deneme Süresi Doldu</span>
          </div>
          <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mb-2">
            Verilerinizi görüntüleyebilirsiniz. İşlemlere devam etmek için aktifleştirin.
          </p>
          <NextLink
            href="/admin/settings"
            className="block text-center py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg transition"
          >
            Hemen Aktifleştir
          </NextLink>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NextLink
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {item.badge}
                </span>
              )}
            </NextLink>
          );
        })}
      </nav>

      {/* Member Portal & Gym Website Switcher */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {/* Gym Public Website */}
        <a
          href={`/salon/${gymSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🌐</span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Salon Web Sitem</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Canlı siteyi aç</p>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
        </a>

        {/* Member Mobile Portal */}
        <NextLink
          href="/member"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">📱</span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Müşteri Görünümü</p>
              <p className="text-[10px] text-slate-500">Mobil ekranı simüle et</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </NextLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Güvenli Çıkış Yap</span>
        </button>

        {/* GymOS Platform Watermark (Only visible to admin) */}
        <div className="pt-1 text-center">
          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono tracking-wider">
            GymOS • v2.4 SaaS
          </span>
        </div>
      </div>
    </aside>
  );
}
