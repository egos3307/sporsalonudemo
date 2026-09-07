'use client';

import { useState, useEffect } from 'react';
import {
  Utensils,
  CheckCircle2,
  Flame,
  Check,
  Salad,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function MemberDietPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});

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

  meals.forEach((meal: any) => {
    if (completedMeals[meal.id]) {
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
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  if (!diet) {
    return (
      <div className="text-center py-16">
        <Utensils className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
          Diyet Programınız Hazırlanıyor
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Antrenörünüz hedefinize uygun beslenme planını eklediğinde burada görebileceksiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
          {diet.title}
        </h2>
        <p className="text-xs text-slate-500">
          Öğünlerinizi tükettikçe işaretleyip günlük makro hedeflerinizi tamamlayın.
        </p>
      </div>

      {/* Real-time Macro & Calorie Dashboard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Tüketilen Enerji
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {consumedCalories}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ {targetCalories} kcal</span>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
            %{calPercent} Alındı
          </span>
        </div>

        {/* Big Calorie Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${calPercent}%` }}
          />
        </div>

        {/* 3 Macro Progress Bars */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Protein */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-blue-600">Protein</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {consumedProtein}/{targetProtein}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${proPercent}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-amber-600">Karb</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {consumedCarbs}/{targetCarbs}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${carbPercent}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-rose-600">Yağ</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {consumedFat}/{targetFat}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meals Interactive List */}
      <div className="space-y-3">
        {meals.map((meal: any) => {
          const isDone = !!completedMeals[meal.id];

          return (
            <div
              key={meal.id}
              className={`p-4 rounded-3xl border transition duration-200 ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : '🍽️'}
                  </span>
                  <h3
                    className={`font-bold text-sm ${
                      isDone
                        ? 'line-through text-slate-500 dark:text-slate-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {meal.name}
                  </h3>
                </div>

                {meal.time && (
                  <span className="text-[11px] text-slate-400 font-mono font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {meal.time}
                  </span>
                )}
              </div>

              {/* Items in meal */}
              <div className="space-y-1.5 pl-8 mb-3">
                {(meal.items || []).map((it: any) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {it.food} <span className="text-slate-400 font-normal">({it.amount})</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono text-[11px]">
                      {it.calories} kcal
                    </span>
                  </div>
                ))}
              </div>

              {/* Check off button */}
              <div className="pl-8">
                <button
                  onClick={() => toggleMeal(meal.id)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 ${
                    isDone
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isDone ? 'ÖĞÜN YENDİ ✓' : 'Tüketildi Olarak İşaretle'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
