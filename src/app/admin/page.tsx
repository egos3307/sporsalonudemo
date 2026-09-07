'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Users,
  UserCheck,
  QrCode,
  Dumbbell,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Globe,
  MessageCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import TrialExpiredBanner from '@/components/TrialExpiredBanner';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
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
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl lg:col-span-2"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const isExpired = data?.isExpired;
  const gym = data?.gym;

  return (
    <div className="space-y-8">
      {/* Trial Expired Alert Banner */}
      {isExpired && (
        <TrialExpiredBanner gymName={gym?.name} onActivated={fetchDashboard} />
      )}

      {/* Welcome & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hoş Geldiniz, {gym?.ownerName || 'Yönetici'} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {gym?.name} genel yönetim özeti ve canlı salon istatistikleri
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={`/salon/${gym?.slug || 'fitzone'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition"
          >
            <Globe className="w-4 h-4" />
            <span>Salon Web Sitemi Gör</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
          </a>

          <NextLink
            href="/admin/check-in"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl shadow-sm transition border border-slate-700"
          >
            <QrCode className="w-4 h-4" />
            <span>Turnike QR</span>
          </NextLink>

          <NextLink
            href="/admin/members"
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Üye Ekle</span>
          </NextLink>
        </div>
      </div>

      {/* 0-Panel Quick Onboarding Guide for Fresh Gyms */}
      {(kpis.totalMembers || 0) === 0 && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
                🚀 Salonunuz Başarıyla Kuruldu • 0-Panel Başlangıç
              </div>
              <h2 className="text-xl font-black text-white">
                {gym?.name} için 3 Adımda Sistemi Canlıya Alın
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kendi logonuz, kendi antrenörleriniz ve müşterileriniz için özel web siteniz hazır.
              </p>
            </div>
            <a
              href={`/salon/${gym?.slug || 'fitzone'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition flex-shrink-0"
            >
              <span>Salon Web Sitenizi Açın</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NextLink
              href="/admin/settings"
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition group block"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-3 group-hover:scale-105 transition">
                1
              </div>
              <h4 className="font-bold text-xs text-white mb-1">Marka & Logo Ayarları</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Salon logonuzu, adresinizi ve renklerinizi güncelleyin. Sitenizde anında görünür.
              </p>
            </NextLink>

            <NextLink
              href="/admin/trainers"
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition group block"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center mb-3 group-hover:scale-105 transition">
                2
              </div>
              <h4 className="font-bold text-xs text-white mb-1">Antrenörleri Ekleyin</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Eğitmenlerinizi sisteme tanımlayın; uzmanlıkları doğrudan salon web sitenizde listelensin.
              </p>
            </NextLink>

            <NextLink
              href="/admin/members"
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition group block"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center mb-3 group-hover:scale-105 transition">
                3
              </div>
              <h4 className="font-bold text-xs text-white mb-1">Müşteri Ekleyin & WhatsApp Atın</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Müşterinizi ekleyin ve yeşil WhatsApp butonuna basarak site linkinizi ve giriş kodunu gönderin!
              </p>
            </NextLink>
          </div>
        </div>
      )}

      {/* 8 Core KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Toplam Müşteri</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpis.totalMembers || 0}</span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Kayıtlı</span>
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Aktif Müşteri</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpis.activeMembers || 0}</span>
            <span className="text-[11px] text-slate-400">üye aktif</span>
          </div>
        </div>

        {/* Live Occupancy */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-300/80 dark:border-emerald-800/80 shadow-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Salondaki Kişi</span>
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {kpis.currentlyInsideCount || 0}
            </span>
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">anlık içeride</span>
          </div>
        </div>

        {/* Check-ins Today */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bugün Giriş Yapanlar</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpis.checkInsToday || 0}</span>
            <span className="text-[11px] text-slate-400">turnike geçişi</span>
          </div>
        </div>

        {/* Active Trainers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Aktif Antrenörler</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpis.activeTrainers || 0}</span>
            <span className="text-[11px] text-slate-400">eğitmen</span>
          </div>
        </div>

        {/* Expiring Memberships */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Yaklaşan Bitişler (&lt;7 gün)</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {kpis.expiringMembers || 0}
            </span>
            <span className="text-[11px] text-amber-600 font-medium">yenileme bekleyen</span>
          </div>
        </div>

        {/* Today's Active Workouts */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tanımlı Programlar</span>
            <div className="p-2 bg-cyan-50 dark:bg-cyan-950/60 rounded-xl text-cyan-600 dark:text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpis.todayWorkoutsCount || 0}</span>
            <span className="text-[11px] text-slate-400">aktif plan</span>
          </div>
        </div>

        {/* Trial Days Countdown */}
        <div className="bg-gradient-to-tr from-blue-900/10 to-indigo-900/10 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Deneme Kalan Süre</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {data?.remainingTrialDays} Gün
            </span>
            <span className="text-[11px] text-slate-400">7 gün ücretsiz</span>
          </div>
        </div>
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Check-ins Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Haftalık Turnike Giriş Sayısı
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Son 7 günün günlük salon giriş yoğunluğu</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">
              Canlı QR Verisi
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weeklyCheckIns || []}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value} Giriş`, 'Turnike']}
                />
                <Bar dataKey="girisler" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Status Donut Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Aktif / Pasif Üye Dağılımı
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Üyelerin güncel durum analizi</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.statusDistribution || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {(data?.statusDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(data?.statusDistribution || []).map((s: any) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{s.name}:</span>
                <strong className="text-slate-900 dark:text-white">{s.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Monthly Trend & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Aylık Yeni Üye Artışı</h3>
              <p className="text-xs text-slate-500">Son 6 ayın yeni kayıt trendi</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyRegistrations || []}>
                <defs>
                  <linearGradient id="colorKayit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="ay" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(v: any) => [`${v} Yeni Üye`, 'Kayıt']}
                />
                <Area type="monotone" dataKey="kayit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorKayit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Timeline Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Son Salon Aktiviteleri</h3>
              <p className="text-xs text-slate-500">Girişler, ölçüm kayıtları ve program güncellemeleri</p>
            </div>
            <NextLink href="/admin/members" className="text-xs text-blue-600 hover:underline font-medium">
              Tüm Üyeler →
            </NextLink>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
            {(data?.recentEvents || []).length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">Henüz bir aktivite kaydı yok.</p>
            ) : (
              (data?.recentEvents || []).map((ev: any) => (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {ev.type === 'CHECK_IN' && '🚪'}
                    {ev.type === 'WORKOUT_COMPLETED' && '🔥'}
                    {ev.type === 'MEASUREMENT' && '⚖️'}
                    {ev.type === 'REGISTERED' && '✨'}
                    {ev.type === 'STATUS_CHANGE' && '⚡'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {ev.member ? `${ev.member.firstName} ${ev.member.lastName}` : 'Üye'}
                        {ev.member?.memberCode && (
                          <span className="ml-1.5 font-mono text-[10px] text-blue-600 dark:text-blue-400">
                            ({ev.member.memberCode})
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {new Date(ev.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {ev.title}: {ev.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
