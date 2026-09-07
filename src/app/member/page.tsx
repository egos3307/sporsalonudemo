'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Dumbbell,
  Calendar,
  Users,
  Scale,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  ArrowRight,
  Droplets,
  Plus,
  Minus,
  Utensils,
  Sparkles,
  QrCode,
  Check,
  Bell,
} from 'lucide-react';

export default function MemberDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({
    'warmup': true,
  });
  const [waterMl, setWaterMl] = useState(2250);
  const waterGoalMl = 3000;

  // Joined classes state
  const [joinedClasses, setJoinedClasses] = useState<Record<string, boolean>>({
    'pilates-1': true,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleTodayExercise = (id: string) => {
    setCompletedToday((prev) => {
      const next = !prev[id];
      showToast(next ? 'Egzersiz tamamlandı olarak işaretlendi! 💪' : 'İşaret kaldırıldı.');
      return { ...prev, [id]: next };
    });
  };

  const handleAddWater = (amount: number) => {
    setWaterMl((prev) => {
      const updated = Math.min(waterGoalMl + 1000, Math.max(0, prev + amount));
      showToast(`+${amount} ml su eklendi! Toplam: ${updated} ml 💧`);
      return updated;
    });
  };

  const toggleJoinClass = (classId: string, className: string) => {
    setJoinedClasses((prev) => {
      const isJoined = !prev[classId];
      showToast(isJoined ? `"${className}" dersine kaydınız alındı! 🎉` : `Ders kaydınız iptal edildi.`);
      return { ...prev, [classId]: isJoined };
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-900/80 rounded-3xl border border-slate-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
          <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
          <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
          <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-900/80 rounded-3xl border border-slate-800" />
          <div className="h-72 bg-slate-900/80 rounded-3xl border border-slate-800" />
        </div>
      </div>
    );
  }

  const member = data?.member;
  const gymBranding = data?.gymBranding || {};
  const currentWeight = member?.measurements?.[0]?.weight || 75;
  const firstName = member?.firstName || 'Caner';
  const completedWorkoutLogs = member?.workoutLogs?.length || 12;

  // Today exercises
  const todayWorkoutExercises = [
    { id: 'warmup', name: 'Isınma & Kardiyo', setsReps: '10 dakika • Hafif tempo' },
    { id: 'ex-1', name: 'Göğüs Press (Bench Press)', setsReps: '3 set x 12 tekrar' },
    { id: 'ex-2', name: 'Omuz Press (Dumbbell)', setsReps: '3 set x 12 tekrar' },
    { id: 'ex-3', name: 'Plank Core Stabilitesi', setsReps: '3 set x 1 dakika' },
  ];

  const upcomingClasses = [
    {
      id: 'pilates-1',
      title: 'Pilates Reformer',
      time: 'Bugün 18:00 - 19:00',
      trainer: 'Zeynep K.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'hiit-2',
      title: 'HIIT & Kondisyon',
      time: 'Yarın 10:00 - 11:00',
      trainer: 'Mert A.',
      image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'yoga-3',
      title: 'Yoga & Esneme',
      time: 'Cuma 19:00 - 20:00',
      trainer: 'Elif S.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const waterPercent = Math.min(100, Math.round((waterMl / waterGoalMl) * 100));

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Greeting Header matching A9FC36A2-821E-4A07-B9DC-798CD53056AD.png (Top-Right) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Merhaba {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl">
            Bugün de harika görünüyorsun. Hedeflerine bir adım daha yaklaş!
          </p>
        </div>

        {/* Weekly Target Widget */}
        <div className="z-10 bg-slate-950/80 border border-slate-800/80 px-4 py-3 rounded-2xl flex flex-col gap-2 min-w-[200px] shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Haftalık Hedef</span>
            <span className="font-extrabold text-emerald-400">3/5 antrenman</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: '60%' }}
            />
          </div>
        </div>

        {/* Decorative subtle gradient sphere */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat KPI Cards matching the screenshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tamamlanan Antrenman */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">{completedWorkoutLogs}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Tamamlanan Antrenman</div>
          </div>
        </div>

        {/* Bu Hafta Ders */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">3</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Bu Hafta Ders</div>
          </div>
        </div>

        {/* Güncel Kilo */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition flex-shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">{currentWeight} kg</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Güncel Kilo</div>
          </div>
        </div>

        {/* Üyelik Süresi */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg flex items-center gap-4 hover:border-slate-700/80 transition group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">6 Ay</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Üyelik Süresi</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Bugünkü Antrenman & Yaklaşan Derslerim */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Bugünkü Antrenman Card matching reference */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Bugünkü Antrenman</h3>
                  <p className="text-[11px] text-slate-400">Üst Vücut İtiş & Core</p>
                </div>
              </div>

              <NextLink
                href="/member/workout"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span>Tüm Program</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>

            {/* Checklist */}
            <div className="mt-4 space-y-2.5">
              {todayWorkoutExercises.map((ex) => {
                const isDone = completedToday[ex.id];
                return (
                  <div
                    key={ex.id}
                    onClick={() => toggleTodayExercise(ex.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-600 text-transparent hover:border-emerald-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold ${
                            isDone ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {ex.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{ex.setsReps}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <NextLink
            href="/member/workout"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider text-center shadow-lg shadow-emerald-500/20 transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Antrenmanı Başlat</span>
          </NextLink>
        </div>

        {/* Column 2: Yaklaşan Derslerim Card matching reference */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Yaklaşan Derslerim</h3>
                  <p className="text-[11px] text-slate-400">Grup ve bireysel stüdyo seansları</p>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-400">
                Tüm Dersler →
              </span>
            </div>

            {/* Class Cards */}
            <div className="mt-4 space-y-3">
              {upcomingClasses.map((item) => {
                const joined = joinedClasses[item.id];
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <p className="text-[11px] text-slate-400">
                          {item.time} • <span className="text-emerald-400 font-semibold">{item.trainer}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleJoinClass(item.id, item.title)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                        joined
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {joined ? 'Katıldın ✓' : 'Katıl'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Kulüp rezervasyon kotası</span>
            <span className="font-bold text-emerald-400">Sınırsız Paket</span>
          </div>
        </div>
      </div>

      {/* Creative Bottom Row: Water Tracker, Motivation Banner & Diet Quick Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Creative Günlük Su Tüketimi (Water Tracker) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Günlük Su Tüketimi</h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {waterMl} / {waterGoalMl} ml
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>%{waterPercent} tamamlandı</span>
              <span>{waterPercent >= 100 ? 'Harika! Hedefe ulaşıldı 🎉' : 'Metabolizmanı canlı tut'}</span>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleAddWater(250)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-400 flex items-center justify-center gap-1 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>250 ml (Bardak)</span>
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-400 flex items-center justify-center gap-1 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>500 ml (Şişe)</span>
            </button>
          </div>
        </div>

        {/* Motivasyon Banner matching reference image */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl relative overflow-hidden flex flex-col justify-between group">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Günün İlhamı
            </span>
            <h4 className="text-base font-black text-white tracking-tight mt-2">
              Daha iyi bir sen için istikrar önemlidir.
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              Küçük adımlar, büyük sonuçlar doğurur.
            </p>
          </div>

          <div className="z-10 pt-4">
            <NextLink
              href="/member/workout"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Antrenman Programına Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>

          {/* Background image overlay */}
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80"
            alt="Motivasyon"
            className="absolute right-0 bottom-0 w-36 h-36 object-cover rounded-3xl opacity-25 group-hover:scale-110 transition duration-500 pointer-events-none"
          />
        </div>

        {/* Beslenme & Diyet Önerisi (Separate diet link as requested) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Beslenme Önerisi</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                2/3 Öğün
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Protein ağırlıklı beslenmeyi ve ara öğünlerde çiğ badem tüketmeyi unutma.
            </p>

            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '66%' }} />
            </div>
          </div>

          <NextLink
            href="/member/diet"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-amber-400 text-center transition flex items-center justify-center gap-1.5"
          >
            <span>Diyet Planımı Aç</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </NextLink>
        </div>
      </div>
    </div>
  );
}
