'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Home, Dumbbell, Utensils, Activity, QrCode } from 'lucide-react';

export default function MemberBottomNav({ primaryColor = '#2563eb' }: { primaryColor?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Ana Sayfa', href: '/member', icon: Home, active: pathname === '/member' },
    { name: 'Antrenman', href: '/member/workout', icon: Dumbbell, active: pathname.startsWith('/member/workout') },
    { name: 'QR Giriş', href: '/member/qr', icon: QrCode, active: pathname === '/member/qr', special: true },
    { name: 'Beslenme', href: '/member/diet', icon: Utensils, active: pathname.startsWith('/member/diet') },
    { name: 'Gelişim', href: '/member/measurements', icon: Activity, active: pathname.startsWith('/member/measurements') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around max-w-md mx-auto sm:max-w-lg md:max-w-xl shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.special) {
          return (
            <NextLink
              key={item.href}
              href={item.href}
              className="relative -top-4 flex flex-col items-center group"
            >
              <div
                className="w-13 h-13 p-3.5 rounded-full text-white shadow-lg flex items-center justify-center transition transform group-hover:scale-110"
                style={{ backgroundColor: primaryColor }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1">
                {item.name}
              </span>
            </NextLink>
          );
        }

        return (
          <NextLink
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              item.active
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px]">{item.name}</span>
          </NextLink>
        );
      })}
    </nav>
  );
}
