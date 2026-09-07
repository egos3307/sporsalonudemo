'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Activity,
  QrCode,
  Bell,
  LogOut,
  Calendar,
  Building2,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

interface MemberSidebarProps {
  gymName?: string;
  gymLogo?: string | null;
  memberName?: string;
  memberCode?: string;
  primaryColor?: string;
  isStaffPreview?: boolean;
}

export default function MemberSidebar({
  gymName = 'FitZone Pro Club',
  gymLogo,
  memberName = 'Caner Erkin',
  memberCode = 'GYM-A7K92X',
  primaryColor = '#22c55e',
  isStaffPreview = false,
}: MemberSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Ana Sayfa',
      href: '/member',
      icon: LayoutDashboard,
      active: pathname === '/member',
    },
    {
      name: 'Programım',
      href: '/member/workout',
      icon: Dumbbell,
      active: pathname.startsWith('/member/workout'),
      badge: 'Antrenman',
    },
    {
      name: 'Diyetim',
      href: '/member/diet',
      icon: Utensils,
      active: pathname.startsWith('/member/diet'),
      badge: 'Beslenme',
    },
    {
      name: 'Ölçüm & İlerleme',
      href: '/member/measurements',
      icon: Activity,
      active: pathname.startsWith('/member/measurements'),
    },
    {
      name: 'Turnike QR',
      href: '/member/qr',
      icon: QrCode,
      active: pathname.startsWith('/member/qr'),
    },
    {
      name: 'Bildirimler & Mesajlar',
      href: '/member/notifications',
      icon: Bell,
      active: pathname.startsWith('/member/notifications'),
    },
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
    <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800/80 flex-col h-screen fixed left-0 top-0 z-40 select-none text-slate-200">
      {/* Gym Brand Identity Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3 bg-slate-950/60 backdrop-blur-md">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-slate-950 shadow-lg shadow-emerald-500/20 flex-shrink-0 bg-emerald-500"
        >
          {gymLogo ? (
            <img src={gymLogo} alt={gymName} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <Dumbbell className="w-5 h-5 text-slate-950" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-sm tracking-tight text-white truncate uppercase">
            {gymName}
          </h2>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Müşteri Portalı
          </span>
        </div>
      </div>

      {/* Staff preview banner if gym admin or trainer is viewing */}
      {isStaffPreview && (
        <div className="mx-3 mt-3 p-2.5 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs flex items-center justify-between">
          <span className="text-[11px] text-blue-300">Yönetici Önizleme Modu</span>
          <NextLink
            href="/admin"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-200"
          >
            <span>Panele Dön</span>
            <ChevronRight className="w-3 h-3" />
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
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                item.active
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    item.active ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                  {item.badge}
                </span>
              )}
            </NextLink>
          );
        })}
      </nav>

      {/* Member Profile Card & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-xs flex-shrink-0">
            {memberName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{memberName}</p>
            <p className="text-[10px] font-mono text-emerald-400 font-semibold">{memberCode}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30 rounded-xl transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
