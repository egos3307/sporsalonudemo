'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Dumbbell,
  Utensils,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatDateTimeTr } from '@/lib/utils';

export default function MemberNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bildirimler
          </h2>
          <p className="text-xs text-slate-500">Antrenör mesajları, program ve üyelik uyarıları</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllRead}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Tümünü Okundu Say
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {loading ? (
          <p className="text-center py-10 text-xs text-slate-400">Bildirimler yükleniyor...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Henüz yeni bir bildiriminiz yok.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-3xl border transition ${
                !n.isRead
                  ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {n.type === 'WORKOUT' && '💪'}
                  {n.type === 'DIET' && '🥗'}
                  {n.type === 'MEMBERSHIP' && '⏳'}
                  {n.type === 'REMINDER' && '🔥'}
                  {n.type === 'SYSTEM' && '🚀'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {formatDateTimeTr(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
