'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Plus,
  TrendingDown,
  TrendingUp,
  User,
  Calendar,
  X,
  Camera,
  Scale,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatDateTr } from '@/lib/utils';

export default function MeasurementsAdminPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newBodyFat, setNewBodyFat] = useState('');
  const [newMuscle, setNewMuscle] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newChest, setNewChest] = useState('');
  const [newArm, setNewArm] = useState('');
  const [newLeg, setNewLeg] = useState('');
  const [newShoulder, setNewShoulder] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.members && data.members.length > 0) {
        setMembers(data.members);
        setSelectedMemberId(data.members[0].id);
      }
    } catch (e) {}
  };

  const fetchMeasurements = async (memberId: string) => {
    if (!memberId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/measurements?memberId=${memberId}`);
      const data = await res.json();
      if (data.measurements) {
        setMeasurements(data.measurements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      fetchMeasurements(selectedMemberId);
    }
  }, [selectedMemberId]);

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: selectedMemberId,
          weight: Number(newWeight),
          bodyFat: newBodyFat ? Number(newBodyFat) : null,
          muscleMass: newMuscle ? Number(newMuscle) : null,
          waist: newWaist ? Number(newWaist) : null,
          chest: newChest ? Number(newChest) : null,
          arm: newArm ? Number(newArm) : null,
          leg: newLeg ? Number(newLeg) : null,
          shoulder: newShoulder ? Number(newShoulder) : null,
          notes,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setNewWeight('');
        setNewBodyFat('');
        setNewMuscle('');
        setNewWaist('');
        setNewChest('');
        setNewArm('');
        setNewLeg('');
        setNewShoulder('');
        setNotes('');
        fetchMeasurements(selectedMemberId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Prepare chart data
  const chartData = measurements.map((m) => ({
    tarih: new Date(m.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    Kilo: m.weight,
    'Yağ Oranı (%)': m.bodyFat,
    'Kas Oranı (%)': m.muscleMass,
    'Kol (cm)': m.arm,
    'Bel (cm)': m.waist,
  }));

  const latest = measurements[measurements.length - 1] || null;
  const first = measurements[0] || null;
  const weightChange = latest && first ? (latest.weight - first.weight).toFixed(1) : '0';
  const fatChange = latest && first && latest.bodyFat && first.bodyFat ? (latest.bodyFat - first.bodyFat).toFixed(1) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Vücut Gelişim & Ölçüm Takibi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kilo, yağ oranı, kas kütlesi ve çevre ölçümleri (bel, kol, göğüs, bacak, omuz)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Member Picker */}
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.firstName} {m.lastName} ({m.memberCode})
              </option>
            ))}
          </select>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Ölçüm Ekle</span>
          </button>
        </div>
      </div>

      {/* Snapshot Cards */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
            <span className="text-[11px] font-semibold text-slate-400">Son Kilo</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {latest.weight} <span className="text-xs font-normal text-slate-400">kg</span>
            </p>
            <span className={`text-[10px] font-bold ${Number(weightChange) < 0 ? 'text-emerald-500' : 'text-blue-500'}`}>
              Toplam Değişim: {Number(weightChange) > 0 ? `+${weightChange}` : weightChange} kg
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
            <span className="text-[11px] font-semibold text-slate-400">Yağ Oranı</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              %{latest.bodyFat || '—'}
            </p>
            {fatChange && (
              <span className={`text-[10px] font-bold ${Number(fatChange) < 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {Number(fatChange) > 0 ? `+${fatChange}` : fatChange}% değişim
              </span>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
            <span className="text-[11px] font-semibold text-slate-400">Kas Kütlesi</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              %{latest.muscleMass || '—'}
            </p>
            <span className="text-[10px] text-emerald-500 font-semibold">Gelişim trendinde</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
            <span className="text-[11px] font-semibold text-slate-400">Kol Çevresi</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {latest.arm || '—'} <span className="text-xs font-normal text-slate-400">cm</span>
            </p>
            <span className="text-[10px] text-slate-400">Bel: {latest.waist || '—'} cm</span>
          </div>
        </div>
      )}

      {/* Historical Progress Line Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Gelişim Trendi (Kilo & Yağ Oranı)
            </h3>
            <p className="text-xs text-slate-500">Tarihsel ölçüm ilerleme grafiği</p>
          </div>
          <Activity className="w-4 h-4 text-blue-500" />
        </div>

        <div className="h-72 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Bu üye için henüz ölçüm kaydı girilmemiş.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="tarih" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Kilo" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Yağ Oranı (%)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Kas Oranı (%)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Measurements Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tarihsel Kayıt Tablosu</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500">
              <tr>
                <th className="px-5 py-3">Tarih</th>
                <th className="px-5 py-3">Kilo (kg)</th>
                <th className="px-5 py-3">Yağ (%)</th>
                <th className="px-5 py-3">Kas (%)</th>
                <th className="px-5 py-3">Bel (cm)</th>
                <th className="px-5 py-3">Göğüs (cm)</th>
                <th className="px-5 py-3">Kol (cm)</th>
                <th className="px-5 py-3">Omuz (cm)</th>
                <th className="px-5 py-3">Notlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {formatDateTr(m.date)}
                  </td>
                  <td className="px-5 py-3 font-bold text-blue-600 dark:text-blue-400">{m.weight}</td>
                  <td className="px-5 py-3">{m.bodyFat ? `%${m.bodyFat}` : '—'}</td>
                  <td className="px-5 py-3">{m.muscleMass ? `%${m.muscleMass}` : '—'}</td>
                  <td className="px-5 py-3">{m.waist || '—'}</td>
                  <td className="px-5 py-3">{m.chest || '—'}</td>
                  <td className="px-5 py-3 font-semibold">{m.arm || '—'}</td>
                  <td className="px-5 py-3">{m.shoulder || '—'}</td>
                  <td className="px-5 py-3 text-slate-500">{m.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Measurement Entry */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Yeni Vücut Ölçümü Ekle
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Üyenin güncel tartı ve mezura değerlerini girin.
            </p>

            <form onSubmit={handleAddMeasurement} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kilo (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="80.5"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Yağ (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="16.5"
                    value={newBodyFat}
                    onChange={(e) => setNewBodyFat(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kas (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="40.0"
                    value={newMuscle}
                    onChange={(e) => setNewMuscle(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bel (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="84"
                    value={newWaist}
                    onChange={(e) => setNewWaist(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kol (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="38"
                    value={newArm}
                    onChange={(e) => setNewArm(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Göğüs (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="104"
                    value={newChest}
                    onChange={(e) => setNewChest(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Notlar</label>
                <input
                  type="text"
                  placeholder="Aç karna sabah ölçümü..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition mt-2 disabled:opacity-50"
              >
                {submitting ? 'Kaydediliyor...' : 'Ölçümü Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
