'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Users,
  Dumbbell,
  Utensils,
  Activity,
  ChevronRight,
  Plus,
  Flame,
  Calendar,
} from 'lucide-react';
import { formatDateTr } from '@/lib/utils';

export default function TrainerDashboardPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/members')
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Antrenör Portalı (Özel Danışanlarım)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Yalnızca size atanmış üyeleri yönetebilir, antrenman ve diyet hazırlayabilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NextLink
            href="/admin/workouts"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Program Yaz</span>
          </NextLink>
          <NextLink
            href="/admin/diets"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            <Utensils className="w-4 h-4" />
            <span>Diyet Yaz</span>
          </NextLink>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-400">Atanmış Danışan Sayısı</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {members.length} Üye
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold">Aktif Takipte</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-400">Yönetilen Programlar</span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {members.reduce((acc, m) => acc + (m._count?.workoutPlans || 0), 0)} Plan
          </p>
          <span className="text-[10px] text-slate-400">Kişiselleştirilmiş split</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-400">Toplam Ölçüm Takibi</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {members.reduce((acc, m) => acc + (m._count?.measurements || 0), 0)} Kayıt
          </p>
          <span className="text-[10px] text-slate-400">Vücut kompozisyonu</span>
        </div>
      </div>

      {/* Assigned Members List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Sorumlu Olduğum Danışanlar
          </h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <p className="text-center py-10 text-xs text-slate-400">Danışanlar yükleniyor...</p>
          ) : members.length === 0 ? (
            <p className="text-center py-10 text-xs text-slate-400">
              Henüz size atanmış bir üye bulunmuyor.
            </p>
          ) : (
            members.map((m) => (
              <div
                key={m.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {m.firstName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {m.firstName} {m.lastName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Kod: <span className="font-mono font-bold text-blue-600">{m.memberCode}</span> • Hedef: {m.targetGoal}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NextLink
                    href={`/admin/members`}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
                  >
                    Detay Gör
                  </NextLink>
                  <NextLink
                    href={`/admin/workouts`}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl transition"
                  >
                    Program Ata
                  </NextLink>
                  <NextLink
                    href={`/admin/diets`}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition"
                  >
                    Diyet Ata
                  </NextLink>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
