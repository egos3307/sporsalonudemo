'use client';

import { useState, useEffect } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  PieChart,
  User,
  Clock,
  CheckCircle2,
  X,
  Flame,
  Salad,
} from 'lucide-react';

export default function DietsAdminPage() {
  const [diets, setDiets] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [targetMemberId, setTargetMemberId] = useState('');
  const [title, setTitle] = useState('Clean Bulk & Yüksek Protein Beslenme');
  const [targetCalories, setTargetCalories] = useState(2600);
  const [targetProtein, setTargetProtein] = useState(170);
  const [targetCarbs, setTargetCarbs] = useState(300);
  const [targetFat, setTargetFat] = useState(70);

  const [meals, setMeals] = useState([
    {
      name: 'Kahvaltı',
      time: '08:00',
      items: [
        { food: 'Yumurta (3 tam, 2 beyaz)', amount: '5 adet', calories: 280, protein: 28, carbs: 2, fat: 18 },
        { food: 'Yulaf Ezmesi + Süt', amount: '80 gr', calories: 310, protein: 11, carbs: 54, fat: 6 },
      ],
    },
    {
      name: 'Öğle Yemeği',
      time: '13:00',
      items: [
        { food: 'Izgara Tavuk Göğsü', amount: '200 gr', calories: 330, protein: 62, carbs: 0, fat: 7 },
        { food: 'Basmati Pirinç', amount: '200 gr (pişmiş)', calories: 260, protein: 5, carbs: 57, fat: 1 },
      ],
    },
    {
      name: 'Akşam Yemeği',
      time: '19:30',
      items: [
        { food: 'Somon veya Biftek', amount: '180 gr', calories: 360, protein: 40, carbs: 0, fat: 20 },
        { food: 'Fırın Tatlı Patates', amount: '200 gr', calories: 180, protein: 3, carbs: 42, fat: 0 },
      ],
    },
  ]);

  const fetchDiets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/diets');
      const data = await res.json();
      if (data.diets) setDiets(data.diets);
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
    fetchDiets();
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMeal = () => {
    setMeals([
      ...meals,
      {
        name: 'Ara Öğün',
        time: '16:00',
        items: [{ food: 'Çiğ Badem & Muz', amount: '30 gr badem, 1 muz', calories: 220, protein: 6, carbs: 27, fat: 15 }],
      },
    ]);
  };

  const addItemToMeal = (mealIndex: number) => {
    const updated = [...meals];
    updated[mealIndex].items.push({
      food: 'Yeni Yiyecek',
      amount: '1 porsiyon',
      calories: 100,
      protein: 5,
      carbs: 10,
      fat: 2,
    });
    setMeals(updated);
  };

  const removeItem = (mealIndex: number, itemIndex: number) => {
    const updated = [...meals];
    updated[mealIndex].items.splice(itemIndex, 1);
    setMeals(updated);
  };

  const handleCreateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/diets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: targetMemberId,
          title,
          targetCalories,
          targetProtein,
          targetCarbs,
          targetFat,
          meals,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Diyet kaydedilemedi.');

      setModalOpen(false);
      fetchDiets();
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
            Diyet & Beslenme Programları
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Öğün bazlı besin, kalori ve makro besin (protein, karb, yağ) listeleri
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Diyet Programı Yaz</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-xs text-slate-400">
            Diyetler yükleniyor...
          </div>
        ) : diets.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            Henüz tanımlanmış beslenme listesi yok.
          </div>
        ) : (
          diets.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md uppercase">
                      {d.member?.firstName} {d.member?.lastName} ({d.member?.memberCode})
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                      {d.title}
                    </h3>
                  </div>
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    {d.targetCalories} <span className="text-[10px] text-slate-400">kcal</span>
                  </span>
                </div>

                {/* Macro Target Pills */}
                <div className="grid grid-cols-3 gap-2 my-4">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-center">
                    <p className="text-[10px] font-semibold text-blue-600">Protein</p>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                      {d.targetProtein}g
                    </p>
                  </div>
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-100 dark:border-amber-900/40 text-center">
                    <p className="text-[10px] font-semibold text-amber-600">Karb</p>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                      {d.targetCarbs}g
                    </p>
                  </div>
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-100 dark:border-rose-900/40 text-center">
                    <p className="text-[10px] font-semibold text-rose-600">Yağ</p>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                      {d.targetFat}g
                    </p>
                  </div>
                </div>

                {/* Meals */}
                <div className="space-y-3">
                  {(d.meals || []).map((meal: any) => (
                    <div
                      key={meal.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {meal.name}
                        </span>
                        {meal.time && (
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            {meal.time}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {(meal.items || []).map((it: any) => (
                          <div
                            key={it.id}
                            className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900/70 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800"
                          >
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {it.food} <span className="text-slate-400">({it.amount})</span>
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {it.calories} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Hazırlayan: {d.trainer?.user?.name || 'Beslenme Uzmanı'}</span>
                <span>{new Date(d.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: New Diet Plan */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Yeni Beslenme Listesi Hazırla
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Üye seçin, kalori ve makro hedeflerini girin ve öğünleri ekleyin.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateDiet} className="space-y-4">
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Macro Targets */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Kalori (kcal)
                  </label>
                  <input
                    type="number"
                    value={targetCalories}
                    onChange={(e) => setTargetCalories(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={targetProtein}
                    onChange={(e) => setTargetProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Karb (g)
                  </label>
                  <input
                    type="number"
                    value={targetCarbs}
                    onChange={(e) => setTargetCarbs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Yağ (g)
                  </label>
                  <input
                    type="number"
                    value={targetFat}
                    onChange={(e) => setTargetFat(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Meals Editor */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    Öğünler ve Besinler
                  </h4>
                  <button
                    type="button"
                    onClick={addMeal}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Öğün Ekle
                  </button>
                </div>

                {meals.map((meal, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Öğün Adı
                        </label>
                        <input
                          type="text"
                          value={meal.name}
                          onChange={(e) => {
                            const updated = [...meals];
                            updated[mIdx].name = e.target.value;
                            setMeals(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                          Saat
                        </label>
                        <input
                          type="text"
                          placeholder="08:00"
                          value={meal.time}
                          onChange={(e) => {
                            const updated = [...meals];
                            updated[mIdx].time = e.target.value;
                            setMeals(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {meal.items.map((it, iIdx) => (
                        <div
                          key={iIdx}
                          className="grid grid-cols-6 gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 items-center text-xs"
                        >
                          <input
                            type="text"
                            placeholder="Besin Adı"
                            value={it.food}
                            onChange={(e) => {
                              const updated = [...meals];
                              updated[mIdx].items[iIdx].food = e.target.value;
                              setMeals(updated);
                            }}
                            className="col-span-2 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Miktar"
                            value={it.amount}
                            onChange={(e) => {
                              const updated = [...meals];
                              updated[mIdx].items[iIdx].amount = e.target.value;
                              setMeals(updated);
                            }}
                            className="col-span-2 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                          />
                          <input
                            type="number"
                            placeholder="Kcal"
                            value={it.calories}
                            onChange={(e) => {
                              const updated = [...meals];
                              updated[mIdx].items[iIdx].calories = Number(e.target.value);
                              setMeals(updated);
                            }}
                            className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(mIdx, iIdx)}
                            className="p-1 text-red-500 hover:text-red-700 justify-self-end"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addItemToMeal(mIdx)}
                        className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Plus className="w-3 h-3" /> Besin Ekle
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
                {submitting ? 'Kaydediliyor...' : 'Diyet Listesini Yayınla'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
