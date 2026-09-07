'use client';

import { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Trash2,
  Play,
  Calendar,
  User,
  Clock,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export default function WorkoutsAdminPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [targetMemberId, setTargetMemberId] = useState('');
  const [planTitle, setPlanTitle] = useState('4 Günlük Hipertrofi & Kuvvet Programı');
  const [planDesc, setPlanDesc] = useState('Kas kütlesi artışı ve temel güç gelişimi.');
  const [days, setDays] = useState([
    {
      dayName: 'Pazartesi',
      focus: 'Göğüs & Ön Kol',
      exercises: [
        {
          name: 'Barbell Bench Press',
          sets: 4,
          reps: '8-10',
          weight: '70 KG',
          restTimeSeconds: 90,
          notes: 'Göğse tam temas, kontrollü negatif.',
          videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
        },
        {
          name: 'Incline Dumbbell Press',
          sets: 3,
          reps: '10-12',
          weight: '24 KG',
          restTimeSeconds: 75,
          notes: '30 derece açı.',
          videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
        },
        {
          name: 'Cable Fly',
          sets: 3,
          reps: '12-15',
          weight: '15 KG',
          restTimeSeconds: 60,
          notes: 'Tepe noktada 1 saniye sıkıştır.',
          videoUrl: '',
        },
      ],
    },
    {
      dayName: 'Çarşamba',
      focus: 'Sırt & Arka Kol',
      exercises: [
        {
          name: 'Lat Pulldown',
          sets: 4,
          reps: '10-12',
          weight: '60 KG',
          restTimeSeconds: 75,
          notes: 'Geniş tutuş.',
          videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
        },
        {
          name: 'Triceps Rope Pushdown',
          sets: 4,
          reps: '12-15',
          weight: '25 KG',
          restTimeSeconds: 60,
          notes: 'Alt noktada halatı ayır.',
          videoUrl: '',
        },
      ],
    },
  ]);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workouts');
      const data = await res.json();
      if (data.plans) setPlans(data.plans);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
        if (data.members.length > 0 && !targetMemberId) {
          setTargetMemberId(data.members[0].id);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchWorkouts();
    fetchMembers();
  }, []);

  const addDay = () => {
    setDays([
      ...days,
      {
        dayName: 'Cuma',
        focus: 'Bacak & Omuz',
        exercises: [
          {
            name: 'Barbell Squat',
            sets: 4,
            reps: '10',
            weight: '80 KG',
            restTimeSeconds: 90,
            notes: 'Tam derinlik.',
            videoUrl: '',
          },
        ],
      },
    ]);
  };

  const addExercise = (dayIndex: number) => {
    const updated = [...days];
    updated[dayIndex].exercises.push({
      name: 'Yeni Egzersiz',
      sets: 3,
      reps: '10-12',
      weight: '20 KG',
      restTimeSeconds: 60,
      notes: '',
      videoUrl: '',
    });
    setDays(updated);
  };

  const removeExercise = (dayIndex: number, exIndex: number) => {
    const updated = [...days];
    updated[dayIndex].exercises.splice(exIndex, 1);
    setDays(updated);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: targetMemberId,
          title: planTitle,
          description: planDesc,
          days,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Program kaydedilemedi.');

      setNewModalOpen(false);
      fetchWorkouts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Antrenman Programları
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Üyelere özel gün bazlı egzersiz, set, ağırlık ve video rehberli programlar
          </p>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Program Hazırla</span>
        </button>
      </div>

      {/* Existing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-xs text-slate-400">
            Programlar yükleniyor...
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            Henüz oluşturulmuş antrenman programı bulunmuyor.
          </div>
        ) : (
          plans.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md uppercase">
                      {p.member?.firstName} {p.member?.lastName} ({p.member?.memberCode})
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                      {p.title}
                    </h3>
                  </div>
                  {p.isActive && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex-shrink-0">
                      Aktif Plan
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-4">{p.description}</p>

                {/* Days Breakdown */}
                <div className="space-y-3">
                  {(p.days || []).map((day: any) => (
                    <div
                      key={day.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {day.dayName}: <span className="text-blue-600 dark:text-blue-400 font-semibold">{day.focus}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {day.exercises?.length || 0} Hareket
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {(day.exercises || []).map((ex: any) => (
                          <div
                            key={ex.id}
                            className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800"
                          >
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {ex.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                                {ex.sets} x {ex.reps}
                              </span>
                              {ex.weight && (
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                  {ex.weight}
                                </span>
                              )}
                              {ex.videoUrl && (
                                <a
                                  href={ex.videoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-400 hover:text-red-500"
                                  title="Video Rehberi"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Eğitmen: {p.trainer?.user?.name || 'Kulüp Başantrenörü'}</span>
                <span>{new Date(p.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Workout Plan */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setNewModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Yeni Antrenman Programı Tanımla
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Üye seçin, günleri ve hareketleri belirleyin.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hedef Üye *
                  </label>
                  <select
                    value={targetMemberId}
                    onChange={(e) => setTargetMemberId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({m.memberCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Program Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Açıklama & Antrenör Notu
                </label>
                <input
                  type="text"
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              {/* Days Editor */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    Antrenman Günleri ve Egzersizler
                  </h4>
                  <button
                    type="button"
                    onClick={addDay}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Gün Ekle
                  </button>
                </div>

                {days.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Gün
                        </label>
                        <select
                          value={day.dayName}
                          onChange={(e) => {
                            const updated = [...days];
                            updated[dIdx].dayName = e.target.value;
                            setDays(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                        >
                          <option value="Pazartesi">Pazartesi</option>
                          <option value="Salı">Salı</option>
                          <option value="Çarşamba">Çarşamba</option>
                          <option value="Perşembe">Perşembe</option>
                          <option value="Cuma">Cuma</option>
                          <option value="Cumartesi">Cumartesi</option>
                          <option value="Pazar">Pazar</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Bölge / Odak
                        </label>
                        <input
                          type="text"
                          value={day.focus}
                          onChange={(e) => {
                            const updated = [...days];
                            updated[dIdx].focus = e.target.value;
                            setDays(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    {/* Exercises in day */}
                    <div className="space-y-2">
                      {day.exercises.map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          className="grid grid-cols-6 gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 items-center text-xs"
                        >
                          <input
                            type="text"
                            placeholder="Hareket Adı"
                            value={ex.name}
                            onChange={(e) => {
                              const updated = [...days];
                              updated[dIdx].exercises[eIdx].name = e.target.value;
                              setDays(updated);
                            }}
                            className="col-span-2 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                          />
                          <input
                            type="number"
                            placeholder="Set"
                            value={ex.sets}
                            onChange={(e) => {
                              const updated = [...days];
                              updated[dIdx].exercises[eIdx].sets = Number(e.target.value);
                              setDays(updated);
                            }}
                            className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Tekrar"
                            value={ex.reps}
                            onChange={(e) => {
                              const updated = [...days];
                              updated[dIdx].exercises[eIdx].reps = e.target.value;
                              setDays(updated);
                            }}
                            className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Ağırlık (örn: 60 KG)"
                            value={ex.weight || ''}
                            onChange={(e) => {
                              const updated = [...days];
                              updated[dIdx].exercises[eIdx].weight = e.target.value;
                              setDays(updated);
                            }}
                            className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeExercise(dIdx, eIdx)}
                            className="p-1 text-red-500 hover:text-red-700 justify-self-end"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addExercise(dIdx)}
                        className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Plus className="w-3 h-3" /> Bu Güne Egzersiz Ekle
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition mt-4 disabled:opacity-50"
              >
                {submitting ? 'Kaydediliyor...' : 'Antrenman Programını Yayınla'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
