'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Utensils,
  CheckCircle2,
  Flame,
  Check,
  Salad,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Droplets,
  Apple,
  Info,
  Dumbbell,
} from 'lucide-react';

export default function MemberDietPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({
    'meal-0': true,
  });

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const diet = data?.activeDietPlan;
  const meals = diet?.meals || [];

  const toggleMeal = (mealId: string) => {
    setCompletedMeals((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  // Calculate consumed macros based on completed meals
  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFat = 0;

  meals.forEach((meal: any, idx: number) => {
    const key = meal.id || `meal-${idx}`;
    if (completedMeals[key]) {
      (meal.items || []).forEach((it: any) => {
        consumedCalories += it.calories || 0;
        consumedProtein += it.protein || 0;
        consumedCarbs += it.carbs || 0;
        consumedFat += it.fat || 0;
      });
    }
  });

  const targetCalories = diet?.targetCalories || 2400;
  const targetProtein = diet?.targetProtein || 160;
  const targetCarbs = diet?.targetCarbs || 220;
  const targetFat = diet?.targetFat || 70;

  const calPercent = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));
  const proPercent = Math.min(100, Math.round((consumedProtein / targetProtein) * 100));
  const carbPercent = Math.min(100, Math.round((consumedCarbs / targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((consumedFat / targetFat) * 100));

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-slate-900/80 rounded-2xl border border-slate-800" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
          <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
          <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
          <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
        </div>
        <div className="h-96 bg-slate-900/80 rounded-3xl border border-slate-800" />
      </div>
    );
  }

  if (!diet) {
    return (
      <div className="text-center py-20 bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-4">
        <Utensils className="w-16 h-16 text-emerald-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Diyet Programınız Hazırlanıyor</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Antrenörünüz hedefinize özel günlük kalori ve makro beslenme planını eklediğinde burada öğün bazında listelenecektir.
        </p>
        <NextLink
          href="/member"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
        >
          <span>Panoya Dön</span>
        </NextLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <NextLink
            href="/member"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Panoya dön"
          >
            <ArrowLeft className="w-4 h-4" />
          </NextLink>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {diet.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Aktif Plan
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Tükettiğiniz öğünleri işaretleyerek günlük kalori ve makro hedefinizi takip edin.
            </p>
          </div>
        </div>

        <NextLink
          href="/member/workout"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition self-start sm:self-auto"
        >
          <Dumbbell className="w-4 h-4 text-emerald-400" />
          <span>Antrenman Programına Geç</span>
        </NextLink>
      </div>

      {/* 4 Macro KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kalori */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">Kalori Hedefi</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{consumedCalories}</span>
            <span className="text-xs text-slate-400 font-mono">/ {targetCalories} kcal</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${calPercent}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">Protein</span>
            <span className="text-[10px] font-bold text-emerald-400">%{proPercent}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">{consumedProtein}g</span>
            <span className="text-xs text-slate-400 font-mono">/ {targetProtein}g</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${proPercent}%` }}
            />
          </div>
        </div>

        {/* Karbonhidrat */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">Karbonhidrat</span>
            <span className="text-[10px] font-bold text-blue-400">%{carbPercent}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-400">{consumedCarbs}g</span>
            <span className="text-xs text-slate-400 font-mono">/ {targetCarbs}g</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${carbPercent}%` }}
            />
          </div>
        </div>

        {/* Yağ */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">Sağlıklı Yağ</span>
            <span className="text-[10px] font-bold text-purple-400">%{fatPercent}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-purple-400">{consumedFat}g</span>
            <span className="text-xs text-slate-400 font-mono">/ {targetFat}g</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Meals Timeline List */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
          <Salad className="w-5 h-5 text-emerald-400" />
          <span>Günlük Öğün Planı</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {meals.map((meal: any, idx: number) => {
            const mealKey = meal.id || `meal-${idx}`;
            const isDone = completedMeals[mealKey];
            const items = meal.items || [];

            const mealCalories = items.reduce((acc: number, it: any) => acc + (it.calories || 0), 0);
            const mealProtein = items.reduce((acc: number, it: any) => acc + (it.protein || 0), 0);

            return (
              <div
                key={mealKey}
                className={`p-5 rounded-3xl border transition-all ${
                  isDone
                    ? 'bg-slate-900/60 border-emerald-500/30'
                    : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMeal(mealKey)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600 hover:border-emerald-400 text-transparent'
                      }`}
                      title={isDone ? 'Tamamlandı' : 'Tamamla'}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-black ${
                          isDone ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {meal.name}
                      </h4>
                      {meal.time && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{meal.time}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-amber-400">
                      {mealCalories} kcal
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-emerald-400">
                      {mealProtein}g Protein
                    </span>
                  </div>
                </div>

                {/* Meal items breakdown */}
                <div className="mt-3 space-y-2">
                  {items.map((it: any, itIdx: number) => (
                    <div
                      key={itIdx}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-200">{it.food}</p>
                        <p className="text-[11px] text-slate-400">{it.amount}</p>
                      </div>
                      <div className="text-right text-[11px] font-mono text-slate-400">
                        <span>{it.calories || 0} kcal</span>
                        <span className="text-slate-600 mx-1.5">•</span>
                        <span className="text-emerald-400 font-bold">{it.protein || 0}g Pro</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trainer's Diet Notes */}
      {diet.notes && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Antrenör Beslenme Tavsiyeleri & Kurallar:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{diet.notes}</p>
        </div>
      )}
    </div>
  );
}
