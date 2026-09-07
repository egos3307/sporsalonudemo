'use client';

import { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Users,
  Dumbbell,
  Utensils,
  Mail,
  Phone,
  X,
  AlertCircle,
} from 'lucide-react';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialties, setSpecialties] = useState('Fitness, Hipertrofi & Kondisyon');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trainers');
      const data = await res.json();
      if (data.trainers) setTrainers(data.trainers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          specialties,
          bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Antrenör eklenemedi.');

      setModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setBio('');
      fetchTrainers();
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
            Antrenör Kadrosu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kulüpte görev yapan eğitmenler, uzmanlık alanları ve sorumlu oldukları üyeler
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Antrenör Ekle</span>
        </button>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-xs text-slate-400">
            Antrenörler yükleniyor...
          </div>
        ) : (
          trainers.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-blue-600 text-base shadow">
                    {t.user?.avatar ? (
                      <img src={t.user.avatar} alt={t.user.name} className="w-full h-full object-cover" />
                    ) : (
                      t.user?.name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {t.user?.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Aktif Antrenör
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    {t.specialties}
                  </p>
                  {t.bio && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {t.bio}
                    </p>
                  )}
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{t.user?.email}</span>
                  </div>
                  {t.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats badges */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <p className="text-[10px] text-slate-400">Üyeler</p>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {t._count?.members || 0}
                  </p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <p className="text-[10px] text-slate-400">Programlar</p>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {t._count?.workoutPlans || 0}
                  </p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <p className="text-[10px] text-slate-400">Diyetler</p>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {t._count?.dietPlans || 0}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add New Trainer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Yeni Antrenör Hesabı Aç
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Antrenör kendi kullanıcı paneline giriş yaparak yalnızca kendisine atanan üyeleri görebilecektir.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateTrainer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adı Soyadı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Caner Demir"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-posta (Giriş Adresi) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="antrenor@fitzone.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  placeholder="0532 xxx xx xx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Uzmanlık Alanları
                </label>
                <input
                  type="text"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Biyografi & Başarılar
                </label>
                <textarea
                  rows={2}
                  placeholder="Sertifikalar, yarışma dereceleri..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <p className="text-[10px] text-slate-400">
                Varsayılan şifre: <span className="font-mono font-bold">Password123!</span> olarak tanımlanır.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition mt-2 disabled:opacity-50"
              >
                {submitting ? 'Oluşturuluyor...' : 'Antrenör Hesabını Aç'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
