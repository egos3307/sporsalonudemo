'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  UserCheck,
  UserX,
  Clock,
  ChevronRight,
  X,
  Calendar,
  Phone,
  Mail,
  Shield,
  Dumbbell,
  Utensils,
  Activity,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { formatDateTr, formatDateTimeTr } from '@/lib/utils';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [gym, setGym] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [trainerFilter, setTrainerFilter] = useState('');
  const [expiringFilter, setExpiringFilter] = useState(false);

  // Modals
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [whatsappModalMember, setWhatsappModalMember] = useState<any>(null);
  const [copiedText, setCopiedText] = useState(false);

  // New Member Form
  const [newForm, setNewForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'ERKEK',
    durationMonths: 1,
    trainerId: '',
    targetGoal: 'Kas Kazanımı & Kondisyon',
    targetCalories: 2200,
    targetWaterMl: 3000,
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Extend Duration Form in Detail Drawer
  const [extendDays, setExtendDays] = useState('30');
  const [extending, setExtending] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (trainerFilter) params.append('trainerId', trainerFilter);
      if (expiringFilter) params.append('expiring', 'true');

      const res = await fetch(`/api/members?${params.toString()}`);
      const data = await res.json();
      if (data.members) setMembers(data.members);
      if (data.gym) setGym(data.gym);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await fetch('/api/trainers');
      const data = await res.json();
      if (data.trainers) setTrainers(data.trainers);
    } catch (e) {}
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, trainerFilter, expiringFilter]);

  const handleOpenDetail = async (memberId: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/members/${memberId}`);
      const data = await res.json();
      if (data.member) {
        setSelectedMember(data.member);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Üye oluşturulamadı.');
      }

      setNewModalOpen(false);
      setNewForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: 'ERKEK',
        durationMonths: 1,
        trainerId: '',
        targetGoal: 'Kas Kazanımı & Kondisyon',
        targetCalories: 2200,
        targetWaterMl: 3000,
        notes: '',
      });
      fetchMembers();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleExtendMembership = async () => {
    if (!selectedMember) return;
    setExtending(true);
    try {
      const res = await fetch(`/api/members/${selectedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extendDays: Number(extendDays) }),
      });
      const data = await res.json();
      if (data.success) {
        handleOpenDetail(selectedMember.id);
        fetchMembers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExtending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Üye Yönetimi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Spor salonuna kayıtlı üyeler, üyelik süreleri, özel kodlar ve aktiviteler
          </p>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Üye Kaydı Aç</span>
        </button>
      </div>

      {/* Gym Website & WhatsApp Share Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Salonunuzun Müşteri Web Sitesi Aktif!</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Canlı Site
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Müşterilerinize göndereceğiniz resmi web siteniz:{' '}
              <span className="font-mono text-emerald-400 font-semibold">
                /salon/{gym?.slug || 'fitzone'}
              </span>
              {' '}— Müşterileriniz burada sadece sizin salonunuzu görür!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`/salon/${gym?.slug || 'fitzone'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition"
          >
            <span>Web Sitenizi Önizleyin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="İsim, e-posta veya kod (örn: GYM-A7K92X)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">Tüm Durumlar</option>
          <option value="ACTIVE">Aktif Üyeler</option>
          <option value="FROZEN">Dondurulmuş</option>
          <option value="EXPIRED">Süresi Dolmuş</option>
          <option value="PENDING_ACTIVATION">Aktivasyon Bekleyen</option>
        </select>

        {/* Trainer Filter */}
        <select
          value={trainerFilter}
          onChange={(e) => setTrainerFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">Tüm Antrenörler</option>
          {trainers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.user.name}
            </option>
          ))}
        </select>

        {/* Expiring Soon Toggle */}
        <button
          onClick={() => setExpiringFilter(!expiringFilter)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
            expiringFilter
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Süresi Yaklaşanlar (&lt;7 gün)</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider font-bold text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Üye</th>
                <th className="px-5 py-3.5">Müşteri Kodu</th>
                <th className="px-5 py-3.5">Durum</th>
                <th className="px-5 py-3.5">Antrenör</th>
                <th className="px-5 py-3.5">Bitiş Tarihi</th>
                <th className="px-5 py-3.5">Hedef</th>
                <th className="px-5 py-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Üyeler yükleniyor...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Arama kriterlerine uygun üye bulunamadı.
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const isExp = new Date(m.membershipEnd) < new Date();
                  const remainingDays = Math.ceil(
                    (new Date(m.membershipEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr
                      key={m.id}
                      onClick={() => handleOpenDetail(m.id)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      {/* Name & Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {m.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {m.firstName} {m.lastName}
                            </p>
                            <p className="text-[11px] text-slate-400">{m.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded-md text-[11px]">
                          {m.memberCode}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {m.status === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Aktif
                          </span>
                        )}
                        {m.status === 'FROZEN' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                            Dondurulmuş
                          </span>
                        )}
                        {m.status === 'EXPIRED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                            Süresi Doldu
                          </span>
                        )}
                        {m.status === 'PENDING_ACTIVATION' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
                            Kod Bekliyor
                          </span>
                        )}
                      </td>

                      {/* Trainer */}
                      <td className="px-5 py-4">
                        {m.trainer?.user ? (
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {m.trainer.user.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Atanmadı</span>
                        )}
                      </td>

                      {/* Membership End */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {formatDateTr(m.membershipEnd)}
                          </p>
                          <span
                            className={`text-[10px] font-semibold ${
                              isExp
                                ? 'text-red-500'
                                : remainingDays <= 7
                                ? 'text-amber-500'
                                : 'text-slate-400'
                            }`}
                          >
                            {isExp ? 'Süresi doldu' : `${remainingDays} gün kaldı`}
                          </span>
                        </div>
                      </td>

                      {/* Goal */}
                      <td className="px-5 py-4">
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px] block">
                          {m.targetGoal || 'Genel Kondisyon'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWhatsappModalMember(m);
                            }}
                            title="WhatsApp ile Müşteriye Gönder"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-[#25D366] text-emerald-500 hover:text-black font-bold text-[11px] border border-emerald-500/30 transition shadow-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(m.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Member Registration */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setNewModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Yeni Üye Kaydı</h3>
            <p className="text-xs text-slate-500 mb-6">
              Kayıt oluşturulduğunda üyenin ilk girişi için benzersiz bir kod üretilir.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ad"
                    value={newForm.firstName}
                    onChange={(e) => setNewForm({ ...newForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Soyad"
                    value={newForm.lastName}
                    onChange={(e) => setNewForm({ ...newForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@mail.com"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    placeholder="05xx xxx xx xx"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Üyelik Paketi
                  </label>
                  <select
                    value={newForm.durationMonths}
                    onChange={(e) => setNewForm({ ...newForm, durationMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value={1}>1 Aylık Standart</option>
                    <option value={3}>3 Aylık Paket</option>
                    <option value={6}>6 Aylık Paket</option>
                    <option value={12}>12 Aylık Yıllık VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Atanacak Antrenör
                  </label>
                  <select
                    value={newForm.trainerId}
                    onChange={(e) => setNewForm({ ...newForm, trainerId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="">Antrenör Seçilmedi</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.user.name} ({t.specialties})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hedef & Odak
                </label>
                <input
                  type="text"
                  placeholder="Örn: Hacim & Kas Kazanımı, Sıkılaşma..."
                  value={newForm.targetGoal}
                  onChange={(e) => setNewForm({ ...newForm, targetGoal: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hedef Kalori (kcal)
                  </label>
                  <input
                    type="number"
                    value={newForm.targetCalories}
                    onChange={(e) => setNewForm({ ...newForm, targetCalories: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hedef Su (ml)
                  </label>
                  <input
                    type="number"
                    value={newForm.targetWaterMl}
                    onChange={(e) => setNewForm({ ...newForm, targetWaterMl: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition mt-2 disabled:opacity-50"
              >
                {formSubmitting ? 'Oluşturuluyor...' : 'Üye Kaydını Tamamla ve Kod Üret'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Drawer: Detailed Member Profile & Timeline */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-xl h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-md">
                    {selectedMember.firstName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </h3>
                    <p className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {selectedMember.memberCode}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* WhatsApp Invitation Card */}
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Demo Sitesi & Giriş Bildirimi</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                    Tek Tıkla
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                  Üyenin telefonuna salon web sitesini ({`/salon/${gym?.slug || 'fitzone'}`}) ve müşteri kodunu ({selectedMember.memberCode}) gönderin.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWhatsappModalMember(selectedMember)}
                    className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Mesajı Hazırla & Gönder</span>
                  </button>
                  <a
                    href={`/salon/${gym?.slug || 'fitzone'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition flex items-center gap-1"
                    title="Salon Web Sitesini Gör"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Member Quick Stats */}
              <div className="grid grid-cols-3 gap-2 my-5">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400">Durum</p>
                  <p className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    {selectedMember.status}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400">Üyelik Bitiş</p>
                  <p className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    {formatDateTr(selectedMember.membershipEnd)}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400">Antrenör</p>
                  <p className="font-bold text-xs text-slate-900 dark:text-white mt-0.5 truncate">
                    {selectedMember.trainer?.user?.name || 'Atanmadı'}
                  </p>
                </div>
              </div>

              {/* Extend Duration Action */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl mb-6">
                <h4 className="font-bold text-xs text-blue-900 dark:text-blue-200 mb-2">
                  Üyelik Süresini Uzat
                </h4>
                <div className="flex items-center gap-2">
                  <select
                    value={extendDays}
                    onChange={(e) => setExtendDays(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl font-medium"
                  >
                    <option value="30">+30 Gün (1 Ay)</option>
                    <option value="90">+90 Gün (3 Ay)</option>
                    <option value="180">+180 Gün (6 Ay)</option>
                    <option value="365">+365 Gün (1 Yıl)</option>
                  </select>
                  <button
                    onClick={handleExtendMembership}
                    disabled={extending}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow"
                  >
                    {extending ? 'Uzatılıyor...' : 'Süreyi Uzat'}
                  </button>
                </div>
              </div>

              {/* Detailed Member Timeline */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
                  Müşteri Zaman Çizelgesi (Timeline)
                </h4>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {(selectedMember.timelineEvents || []).length === 0 ? (
                    <p className="text-xs text-slate-400 pl-8">Henüz kaydedilmiş timeline olayı yok.</p>
                  ) : (
                    selectedMember.timelineEvents.map((ev: any) => (
                      <div key={ev.id} className="flex items-start gap-3 relative pl-8">
                        <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {ev.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatDateTimeTr(ev.createdAt)}
                            </span>
                          </div>
                          {ev.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              {ev.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedMember(null)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Modal for Sending Site & Member Code */}
      {whatsappModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
            <button
              onClick={() => setWhatsappModalMember(null)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Müşteriye WhatsApp ile Gönder</h3>
                <p className="text-xs text-slate-400">
                  {whatsappModalMember.firstName} {whatsappModalMember.lastName}{' '}
                  {whatsappModalMember.phone ? `(${whatsappModalMember.phone})` : '(Telefon girilmemiş)'}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400">Gidecek Mesaj Şablonu:</span>
                <span className="text-[10px] text-slate-500">Müşteriye Özel Oluşturuldu</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-200 select-all">
{`Merhaba ${whatsappModalMember.firstName}! 💪 ${gym?.name || 'FitZone Pro Club'} ailemize hoş geldiniz.
Size özel salon web sitemiz ve dijital üye portalınız hazır!

🌐 Salon Web Sitemiz: ${typeof window !== 'undefined' ? window.location.origin : ''}/salon/${gym?.slug || 'fitzone'}
🔑 Üye Giriş Kodunuz: ${whatsappModalMember.memberCode}
📱 Üye Portalı Girişi: ${typeof window !== 'undefined' ? window.location.origin : ''}/activate-code

Buradan giriş yaparak antrenman programınızı, diyet listenizi ve su takibinizi anında görüntüleyebilirsiniz. İyi antrenmanlar dileriz!`}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/${(whatsappModalMember.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Merhaba ${whatsappModalMember.firstName}! 💪 ${gym?.name || 'FitZone Pro Club'} ailemize hoş geldiniz.\nSize özel salon web sitemiz ve dijital üye portalınız hazır!\n\n🌐 Salon Web Sitemiz: ${typeof window !== 'undefined' ? window.location.origin : ''}/salon/${gym?.slug || 'fitzone'}\n🔑 Üye Giriş Kodunuz: ${whatsappModalMember.memberCode}\n📱 Üye Portalı Girişi: ${typeof window !== 'undefined' ? window.location.origin : ''}/activate-code\n\nBuradan giriş yaparak antrenman programınızı, diyet listenizi ve su takibinizi anında görüntüleyebilirsiniz. İyi antrenmanlar dileriz!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp'ta Aç ve Gönder</span>
              </a>

              <button
                onClick={() => {
                  const text = `Merhaba ${whatsappModalMember.firstName}! 💪 ${gym?.name || 'FitZone Pro Club'} ailemize hoş geldiniz.\nSize özel salon web sitemiz ve dijital üye portalınız hazır!\n\n🌐 Salon Web Sitemiz: ${window.location.origin}/salon/${gym?.slug || 'fitzone'}\n🔑 Üye Giriş Kodunuz: ${whatsappModalMember.memberCode}\n📱 Üye Portalı Girişi: ${window.location.origin}/activate-code\n\nBuradan giriş yaparak antrenman programınızı, diyet listenizi ve su takibinizi anında görüntüleyebilirsiniz. İyi antrenmanlar dileriz!`;
                  navigator.clipboard.writeText(text);
                  setCopiedText(true);
                  setTimeout(() => setCopiedText(false), 2000);
                }}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
              <a
                href={`/salon/${gym?.slug || 'fitzone'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-emerald-400 transition inline-flex items-center gap-1.5"
              >
                <span>Müşterinin Göreceği Salon Web Sitesini Aç</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
