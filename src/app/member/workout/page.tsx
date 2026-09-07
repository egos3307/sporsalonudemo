'use client';

import { useState, useEffect } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  Play,
  Timer,
  Sparkles,
  Flame,
  ArrowLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Video,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import RestTimerModal from '@/components/RestTimerModal';
import NextLink from 'next/link';

export default function MemberWorkoutPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Rest Timer modal
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState(90);

  // Video viewer modal
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Completion celebratory modal
  const [celebrationModalOpen, setCelebrationModalOpen] = useState(false);
  const [savingLog, setSavingLog] = useState(false);

  const fetchWorkoutData = async () => {
    try {
      const res = await fetch('/api/member/me');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  const plan = data?.member?.workoutPlans?.[0];
  const days = plan?.days || [];
  const currentDay = days[selectedDayIndex] || days[0];

  const toggleExercise = (exId: string, restSec = 90) => {
    const isNowCompleted = !completedExercises[exId];
    const updated = {
      ...completedExercises,
      [exId]: isNowCompleted,
    };
    setCompletedExercises(updated);

    // If marked completed, start rest timer!
    if (isNowCompleted) {
      setTimerDuration(restSec);
      setTimerOpen(true);
    }

    // Check if all exercises in this day are now completed
    const currentDayExercises = currentDay?.exercises || [];
    const allDone =
      currentDayExercises.length > 0 &&
      currentDayExercises.every((e: any) => updated[e.id]);

    if (allDone && isNowCompleted) {
      triggerCelebration();
    }
  };

  const triggerCelebration = async () => {
    // Confetti cannon
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    setCelebrationModalOpen(true);

    // Save workout log to database
    setSavingLog(true);
    try {
      await fetch('/api/workouts/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutDayTitle: currentDay?.focus || 'Günlük Seans',
          durationMinutes: 48,
          completedExercises: Object.keys(completedExercises),
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingLog(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  if (!plan || days.length === 0) {
    return (
      <div className="text-center py-16">
        <Dumbbell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
          Antrenman Programınız Hazırlanıyor
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Antrenörünüz hedefinize uygun güncel programı hazırladığında burada görebileceksiniz.
        </p>
      </div>
    );
  }

  const exercises = currentDay?.exercises || [];
  const completedCount = exercises.filter((e: any) => completedExercises[e.id]).length;
  const progressPercent = Math.round((completedCount / (exercises.length || 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Top Title & Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {plan.title}
          </h2>
          <p className="text-xs text-slate-500">
            {currentDay?.dayName} • {currentDay?.focus}
          </p>
        </div>

        <button
          onClick={() => {
            setTimerDuration(90);
            setTimerOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl transition"
        >
          <Timer className="w-4 h-4" />
          <span>Sayaç</span>
        </button>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {days.map((d: any, index: number) => {
          const isSelected = index === selectedDayIndex;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDayIndex(index)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{d.dayName}</span>
            </button>
          );
        })}
      </div>

      {/* Completion Progress Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Tamamlanan: {completedCount} / {exercises.length} Hareket
          </span>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
            %{progressPercent}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        {exercises.map((ex: any, idx: number) => {
          const isDone = !!completedExercises[ex.id];

          return (
            <div
              key={ex.id}
              className={`p-4 rounded-3xl border transition duration-200 ${
                isDone
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </span>

                  <div>
                    <h3
                      className={`font-bold text-sm ${
                        isDone
                          ? 'line-through text-slate-500 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {ex.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                        {ex.sets} set x {ex.reps}
                      </span>
                      {ex.weight && (
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {ex.weight}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Timer className="w-3 h-3" /> {ex.restTimeSeconds}s dinlenme
                      </span>
                    </div>
                  </div>
                </div>

                {ex.videoUrl && (
                  <button
                    onClick={() => setActiveVideoUrl(ex.videoUrl)}
                    className="p-2 text-slate-400 hover:text-red-500 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
                    title="Hareketi İzle"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                )}
              </div>

              {ex.notes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 pl-9 leading-relaxed">
                  💡 {ex.notes}
                </p>
              )}

              {/* Completion Button */}
              <div className="pl-9 pt-1">
                <button
                  onClick={() => toggleExercise(ex.id, ex.restTimeSeconds)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 ${
                    isDone
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isDone ? 'TAMAMLANDI ✓' : 'Setleri Tamamla'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={timerOpen}
        initialSeconds={timerDuration}
        onClose={() => setTimerOpen(false)}
      />

      {/* Video Modal Preview */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 max-w-sm w-full shadow-2xl relative text-center">
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-3 bg-red-600/20 text-red-400 rounded-2xl inline-flex mb-3">
              <Video className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Egzersiz Form Videosu</h4>
            <p className="text-xs text-slate-400 mb-4">
              Antrenörünüzün önerdiği doğru biyomekanik ve hareket formu rehberi.
            </p>
            <a
              href={activeVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="block py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition"
            >
              YouTube'da İzle ↗
            </a>
          </div>
        </div>
      )}

      {/* Celebration Modal upon finishing workout */}
      {celebrationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg mx-auto mb-4 animate-bounce">
              🏆
            </div>

            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              Bugünkü Antrenmanı Tamamladın!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Harika bir seanstı. Kasların büyümesi ve hedefine bir adım daha yaklaşman için gerekli sinyali verdin.
            </p>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl mb-6 text-center">
              <div>
                <span className="text-[10px] text-slate-400">Tamamlanan</span>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {exercises.length} Egzersiz
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Süre</span>
                <p className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                  ~48 Dakika
                </p>
              </div>
            </div>

            <button
              onClick={() => setCelebrationModalOpen(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg transition"
            >
              Harika, Ana Sayfaya Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
