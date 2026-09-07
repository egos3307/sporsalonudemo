'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Dumbbell,
  Utensils,
  Droplets,
  Activity,
  QrCode,
  Flame,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Calendar,
  Sparkles,
  MessageSquare,
  Scale,
} from 'lucide-react';
import WaterTracker from '@/components/WaterTracker';

export default function MemberDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  const member = data?.member;
  const todayWorkoutDay = data?.todayWorkoutDay;
  const activeDiet = data?.activeDietPlan;
  const currentDayName = data?.currentDayName;
  const latestMeasurement = member?.measurements?.[0];
  const branding = data?.gymBranding || {};

  return (
    <div className="space-y-4">
      {/* Welcome & Member Status Banner */}
      <div
        className="p-5 rounded-3xl text-white shadow-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${branding.primaryColor || '#2563eb'}, #1e3a8a)`,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold opacity-90 block">
              {currentDayName}, Bugün
            </span>
            <h2 className="text-xl font-extrabold mt-0.5 tracking-tight">
              Hazır mısın, {member?.firstName}? 🔥
            </h2>
            <p className="text-xs opacity-90 mt-1 max-w-xs">
              Hedef: <span className="font-semibold">{member?.targetGoal || 'Kas & Güç Artışı'}</span>
            </p>
          </div>

          <NextLink
            href="/member/qr"
            className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl flex flex-col items-center gap-1 transition active:scale-95"
          >
            <QrCode className="w-6 h-6 text-white" />
            <span className="text-[9px] font-extrabold uppercase tracking-wider">Turnike QR</span>
          </NextLink>
        </div>

        {/* Membership remaining info */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <span className="opacity-90">Kulüp Üyeliği</span>
          <span className="font-bold bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
            {member?.status === 'ACTIVE' ? 'Aktif Üye' : member?.status}
          </span>
        </div>
      </div>

      {/* Today's Workout Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Bugünkü Antrenman</h3>
              <p className="text-[11px] text-slate-500">
                {todayWorkoutDay ? todayWorkoutDay.focus : 'Dinlenme Günü'}
              </p>
            </div>
          </div>

          {todayWorkoutDay && (
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              {todayWorkoutDay.exercises?.length || 0} Egzersiz
            </span>
          )}
        </div>

        {todayWorkoutDay ? (
          <div>
            <div className="space-y-1.5 mb-4">
              {(todayWorkoutDay.exercises || []).slice(0, 3).map((ex: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                    {ex.name}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono text-[11px]">
                    {ex.sets} x {ex.reps} {ex.weight && `(${ex.weight})`}
                  </span>
                </div>
              ))}
              {(todayWorkoutDay.exercises?.length || 0) > 3 && (
                <p className="text-[11px] text-slate-400 text-center pt-1">
                  +{(todayWorkoutDay.exercises?.length || 0) - 3} egzersiz daha
                </p>
              )}
            </div>

            <NextLink
              href="/member/workout"
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/20 transition active:scale-[0.98]"
            >
              <span>Antrenmanı Başlat</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-slate-500">Bugün programınızda kayıtlı egzersiz yok.</p>
            <NextLink
              href="/member/workout"
              className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:underline"
            >
              Tüm Programı Görüntüle →
            </NextLink>
          </div>
        )}
      </div>

      {/* Water Intake Tracker Component */}
      <WaterTracker targetWater={member?.targetWaterMl || 3000} />

      {/* Calorie & Nutrition Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Beslenme & Makro Hedefi</h3>
              <p className="text-[11px] text-slate-500">
                Hedef: {member?.targetCalories || 2400} kcal
              </p>
            </div>
          </div>
          <NextLink
            href="/member/diet"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Öğünleri Aç →
          </NextLink>
        </div>

        {activeDiet ? (
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <span className="text-[10px] font-semibold text-blue-600">Protein</span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {activeDiet.targetProtein}g
              </p>
            </div>
            <div className="p-2.5 bg-amber-50/60 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              <span className="text-[10px] font-semibold text-amber-600">Karb</span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {activeDiet.targetCarbs}g
              </p>
            </div>
            <div className="p-2.5 bg-rose-50/60 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/30">
              <span className="text-[10px] font-semibold text-rose-600">Yağ</span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {activeDiet.targetFat}g
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-2">Henüz aktif diyet atanmadı.</p>
        )}
      </div>

      {/* Body Snapshot & Measurement Card */}
      <NextLink
        href="/member/measurements"
        className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Son Vücut Ölçümleri</h3>
              <p className="text-[11px] text-slate-500">
                {latestMeasurement ? `${latestMeasurement.weight} kg` : 'Henüz ölçüm yok'}
                {latestMeasurement?.bodyFat && ` | Yağ: %${latestMeasurement.bodyFat}`}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </NextLink>

      {/* Trainer Message Note */}
      {member?.trainer && (
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0">
            {member.trainer.user?.avatar ? (
              <img
                src={member.trainer.user.avatar}
                alt={member.trainer.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-xs flex items-center justify-center h-full">MK</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold text-xs text-slate-900 dark:text-white">
                Koçunuz: {member.trainer.user?.name}
              </p>
              <span className="text-[10px] text-blue-600 font-semibold">Aktif</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              "Bugünkü göğüs antrenmanında ağırlıkları zorlamaktan çekinme, set aralarında 90 saniye dinlenmeyi unutma!"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
