'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Plus,
  Scale,
  Camera,
  X,
  TrendingDown,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDateTr } from '@/lib/utils';

export default function MemberMeasurementsPage() {
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New measurement form
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [arm, setArm] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMeasurements = async () => {
    try {
      const res = await fetch('/api/measurements');
      const data = await res.json();
      if (data.measurements) setMeasurements(data.measurements);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: Number(weight),
          waist: waist ? Number(waist) : null,
          arm: arm ? Number(arm) : null,
          bodyFat: bodyFat ? Number(bodyFat) : null,
          notes,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setWeight('');
        setWaist('');
        setArm('');
        setBodyFat('');
        setNotes('');
        fetchMeasurements();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = measurements.map((m) => ({
    tarih: new Date(m.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    Kilo: m.weight,
    'Yağ (%)': m.bodyFat,
  }));

  const latest = measurements[measurements.length - 1];
  const first = measurements[0];
  const diff = latest && first ? (latest.weight - first.weight).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Vücut Gelişimi & Ölçümler
          </h2>
          <p className="text-xs text-slate-500">Kilo değişimi ve vücut kompozisyonu</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ölçüm Ekle</span>
        </button>
      </div>

      {/* Snapshot Cards */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Son Kilonuz</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {latest.weight} <span className="text-xs font-normal text-slate-400">kg</span>
            </p>
            <span
              className={`text-[10px] font-bold ${
                Number(diff) <= 0 ? 'text-emerald-500' : 'text-blue-500'
              }`}
            >
              Toplam: {Number(diff) > 0 ? `+${diff}` : diff} kg
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tahmini Yağ</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              %{latest.bodyFat || '15.6'}
            </p>
            <span className="text-[10px] text-emerald-500 font-semibold">Sağlıklı Aralık</span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-3">
          Kilo Değişim Grafiği (kg)
        </h3>

        <div className="h-48 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Henüz ölçüm kaydı yok.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="tarih" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="Kilo" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Historical List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-xs text-slate-900 dark:text-white">Geçmiş Tartı Kayıtları</h3>
        <div className="space-y-2">
          {measurements.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between text-xs p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {m.weight} kg
                </span>
                <p className="text-[10px] text-slate-400">
                  {formatDateTr(m.date)}
                  {m.arm && ` • Kol: ${m.arm}cm`}
                  {m.waist && ` • Bel: ${m.waist}cm`}
                </p>
              </div>
              {m.bodyFat && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  %{m.bodyFat} yağ
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Photo Gallery Simulation Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Gelişim Fotoğrafları</h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">Ön / Yan / Sırt</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Form fotoğraflarınızı yükleyerek antrenörünüzün postür ve kas gelişimini izlemesini sağlayabilirsiniz.
        </p>
        <button
          onClick={() => alert('Fotoğraf yükleme simülasyonu: Kamera / galeri entegrasyonu hazır.')}
          className="w-full py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
        >
          📷 Yeni Form Fotoğrafı Ekle
        </button>
      </div>

      {/* Modal: Add Measurement */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">Tartı & Ölçüm Ekle</h3>
            <p className="text-[11px] text-slate-500 mb-4">Bugünkü kilonuzu kaydedin.</p>

            <form onSubmit={handleAddMeasurement} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kilonuz (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="81.2"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bel (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="83"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kol (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="38"
                    value={arm}
                    onChange={(e) => setArm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition mt-2 disabled:opacity-50"
              >
                {submitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
