'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
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
  ExternalLink,
  Cpu,
  Info,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import RestTimerModal from '@/components/RestTimerModal';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
  restSeconds?: number | null;
  notes?: string | null;
  videoUrl?: string | null;
  targetMuscle?: string | null;
}

interface WorkoutDay {
  id: string;
  dayName: string;
  focus: string;
  order: number;
  exercises: Exercise[];
}

export default function MemberWorkoutPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // AI Guidance state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGuidance, setAiGuidance] = useState<any>(null);
  const [hasNvidiaKey, setHasNvidiaKey] = useState(false);

  // Rest Timer modal
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState(90);

  // Completion celebratory modal
  const [celebrationModalOpen, setCelebrationModalOpen] = useState(false);
  const [savingLog, setSavingLog] = useState(false);

  const fetchWorkoutData = async () => {
    try {
      const res = await fetch('/api/member/me');
      const json = await res.json();
      if (json.success) {
        setData(json);

        const days = json.member?.workoutPlans?.[0]?.days || [];
        if (days.length > 0 && days[0].exercises?.length > 0) {
          const firstEx = days[0].exercises[0];
          setSelectedExercise(firstEx);
          fetchAiGuidance(firstEx.name);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAiGuidance = async (exerciseName: string) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/exercise-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseName }),
      });
      const json = await res.json();
      if (json.success && json.guidance) {
        setAiGuidance(json.guidance);
        setHasNvidiaKey(Boolean(json.hasNvidiaKey));
      }
    } catch (err) {
      console.error('AI fetch error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectExercise = (ex: Exercise) => {
    setSelectedExercise(ex);
    fetchAiGuidance(ex.name);
  };

  const plan = data?.member?.workoutPlans?.[0];
  const days: WorkoutDay[] = plan?.days || [];
  const currentDay = days[selectedDayIndex] || days[0];

  const handleToggleExercise = (exId: string, restSec = 90) => {
    const isNowCompleted = !completedExercises[exId];
    const updated = {
      ...completedExercises,
      [exId]: isNowCompleted,
    };
    setCompletedExercises(updated);

    if (isNowCompleted) {
      setTimerDuration(restSec || 90);
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
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch {}

    setCelebrationModalOpen(true);
    setSavingLog(true);

    try {
      await fetch('/api/workouts/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayName: currentDay?.dayName || 'Antrenman',
          notes: 'Tüm hareketler başarıyla tamamlandı.',
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
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-slate-900/80 rounded-2xl border border-slate-800" />
        <div className="h-12 bg-slate-900/80 rounded-2xl border border-slate-800" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-96 bg-slate-900/80 rounded-3xl border border-slate-800" />
          <div className="lg:col-span-7 h-96 bg-slate-900/80 rounded-3xl border border-slate-800" />
        </div>
      </div>
    );
  }

  if (!plan || days.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-4">
        <Dumbbell className="w-16 h-16 text-emerald-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Antrenman Programınız Hazırlanıyor</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Antrenörünüz hedefinize özel haftalık split antrenman programını hazırladığında burada tüm hareketler ve video rehberleri listelenecektir.
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

  const currentExercises = currentDay?.exercises || [];
  const completedCount = currentExercises.filter((e) => completedExercises[e.id]).length;
  const isSelectedCompleted = selectedExercise ? completedExercises[selectedExercise.id] : false;

  return (
    <div className="space-y-6">
      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={timerOpen}
        onClose={() => setTimerOpen(false)}
        initialSeconds={timerDuration}
      />

      {/* Celebration Modal */}
      {celebrationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Tebrikler, Antrenman Bitti!</h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentDay?.dayName} programındaki tüm egzersizleri başarıyla tamamladın. Gelişimin kaydedildi.
              </p>
            </div>
            <button
              onClick={() => setCelebrationModalOpen(false)}
              className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition"
            >
              Harika, Devam Et
            </button>
          </div>
        </div>
      )}

      {/* Top Header matching A9FC36A2-821E-4A07-B9DC-798CD53056AD.png (Bottom-Right) */}
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
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Antrenman Programım
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Hedeflerine uygun olarak hazırlanmış kişisel programın.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400">
            {completedCount}/{currentExercises.length} Tamamlandı
          </span>
        </div>
      </div>

      {/* Horizontal Split Days / Weeks Selector matching reference */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day, idx) => {
          const isActive = idx === selectedDayIndex;
          return (
            <button
              key={day.id}
              onClick={() => {
                setSelectedDayIndex(idx);
                if (day.exercises.length > 0) {
                  setSelectedExercise(day.exercises[0]);
                  fetchAiGuidance(day.exercises[0].name);
                }
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-400 hover:bg-slate-850 hover:text-white border border-slate-800/80'
              }`}
            >
              <span>{day.dayName}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {day.focus}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2-Column Split: Exercise Checklist (Left) & AI Video Coach Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Exercises List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black text-white">
                  {currentDay.dayName} - {currentDay.focus}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {currentExercises.length} Egzersiz • Ortalama 45 dakika
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Exercise List */}
            <div className="space-y-2.5">
              {currentExercises.map((ex, exIdx) => {
                const isSelected = selectedExercise?.id === ex.id;
                const isCompleted = completedExercises[ex.id];

                return (
                  <div
                    key={ex.id}
                    onClick={() => handleSelectExercise(ex)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-md'
                        : isCompleted
                        ? 'bg-slate-950/40 border-slate-800/50 text-slate-400'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExercise(ex.id, ex.restSeconds || 90);
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all flex-shrink-0 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-600 hover:border-emerald-400 text-transparent'
                        }`}
                        title="Tamamlandı olarak işaretle"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isCompleted ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {ex.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {ex.sets} set x {ex.reps} tekrar
                          {ex.weight ? ` • ${ex.weight} kg` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          Seçili
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Video Coach & Detail Panel matching screenshot (7 cols) */}
        <div className="lg:col-span-7">
          {selectedExercise ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-5">
              {/* Exercise Title & AI Badge */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Aktif Egzersiz
                    </span>
                    {hasNvidiaKey ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        <Cpu className="w-3 h-3 text-emerald-400" />
                        <span>NVIDIA AI Destekli</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>Yapay Zeka Form Koçu</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                    {selectedExercise.name}
                  </h2>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {selectedExercise.sets} x {selectedExercise.reps}
                  </div>
                  <div className="text-[11px] text-slate-400">Set ve Tekrar</div>
                </div>
              </div>

              {/* YouTube Video Embed Player matching the screenshot */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video shadow-2xl group">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${
                    aiGuidance?.youtubeVideoId || 'rT7DgCr-3pg'
                  }?rel=0&modestbranding=1`}
                  title={`${selectedExercise.name} Video Rehberi`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tags: Kas Grupları */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Kas Grupları:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(aiGuidance?.muscleGroups || ['Hedef Kas', 'Core']).map(
                      (m: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700/60"
                        >
                          {m}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* AI Description */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nasıl Yapılır & Antrenör Notu:</span>
                  </div>
                  <p>{aiGuidance?.description}</p>
                </div>

                {/* Steps and Tips */}
                {aiGuidance?.howToSteps && (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-2">
                    <span className="font-bold text-slate-200">Uygulama Adımları:</span>
                    <ul className="space-y-1 text-slate-400 list-disc list-inside">
                      {aiGuidance.howToSteps.slice(0, 3).map((step: string, sIdx: number) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons: Egzersizi Tamamla & Dinlenme Sayacı */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() =>
                    handleToggleExercise(
                      selectedExercise.id,
                      selectedExercise.restSeconds || 90
                    )
                  }
                  className={`flex-1 w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition active:scale-[0.99] flex items-center justify-center gap-2 shadow-xl ${
                    isSelectedCompleted
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>
                    {isSelectedCompleted ? 'TAMAMLANDI ✓ (Tekrar Aç)' : 'Egzersizi Tamamla'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setTimerDuration(selectedExercise.restSeconds || 90);
                    setTimerOpen(true);
                  }}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Timer className="w-4 h-4 text-emerald-400" />
                  <span>{selectedExercise.restSeconds || 90}s Dinlen</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/90 border border-slate-800/80 text-center text-slate-400">
              <Dumbbell className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-xs">Detaylarını ve videosunu görmek için soldan bir egzersiz seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
