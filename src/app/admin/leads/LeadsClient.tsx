'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Search,
  Building2,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  Star,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  Users,
  Check,
  Copy,
  Edit3,
  Filter,
  Sparkles,
  History,
  TrendingUp,
  Info,
  Trash2,
} from 'lucide-react';
import { createWhatsAppUrl, normalizePhoneNumber } from '@/lib/outscraper';

interface Lead {
  id: string;
  name: string;
  phone?: string | null;
  phoneNormalized?: string | null;
  address?: string | null;
  rating?: number | null;
  reviews?: number | null;
  website?: string | null;
  websiteDomain?: string | null;
  instagram?: string | null;
  googleMapsUrl?: string | null;
  placeId?: string | null;
  status: 'NEW' | 'CONTACTED' | 'WAITING' | 'INTERESTED' | 'NOT_INTERESTED' | 'CUSTOMER';
  notes?: string | null;
  searchQuery?: string | null;
  createdAt: string;
}

interface LeadStats {
  totalLeads: number;
  withPhone: number;
  contacted: number;
  interested: number;
  customer: number;
}

interface RecentSearch {
  id: string;
  query: string;
  requestedLimit: number;
  foundCount: number;
  newLeadsCount: number;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; bgSoft: string; border: string }
> = {
  NEW: {
    label: 'Yeni',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    bgSoft: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900',
  },
  CONTACTED: {
    label: 'İletişime Geçildi',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    bgSoft: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-900',
  },
  WAITING: {
    label: 'Cevap Bekleniyor',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    bgSoft: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-900',
  },
  INTERESTED: {
    label: 'İlgileniyor',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    bgSoft: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900',
  },
  NOT_INTERESTED: {
    label: 'Olumsuz',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    bgSoft: 'bg-slate-50 dark:bg-slate-900',
    border: 'border-slate-200 dark:border-slate-800',
  },
  CUSTOMER: {
    label: 'Müşteri',
    badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold',
    bgSoft: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-200 dark:border-teal-900',
  },
};

function WhatsAppIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.54 1.861.854 2.796.855 3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm3.366 8.169c-.14.394-.716.732-1.047.781-.308.046-.713.076-2.275-.589-1.874-.8-3.085-2.716-3.178-2.84-.093-.125-.761-1.013-.761-1.933 0-.92.483-1.373.655-1.56.172-.187.375-.234.5-.234.125 0 .25.001.359.006.115.006.269-.044.421.321.156.375.531 1.297.578 1.391.047.094.078.203.016.328-.063.125-.094.203-.187.312-.094.109-.197.244-.282.328-.094.094-.192.196-.083.383.109.187.485.8 1.042 1.297.717.639 1.32.837 1.508.931.187.094.297.078.406-.047.109-.125.469-.547.594-.734.125-.187.25-.156.422-.094.172.062 1.094.516 1.281.609.188.094.313.141.359.219.047.078.047.453-.093.847z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function LeadsAdminPage() {
  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    totalLeads: 0,
    withPhone: 0,
    contacted: 0,
    interested: 0,
    customer: 0,
  });
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // Search input controls
  const [queryInput, setQueryInput] = useState('');
  const [limit, setLimit] = useState<number>(50);
  const [searching, setSearching] = useState(false);
  const [searchProgressMsg, setSearchProgressMsg] = useState('');
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);

  // Filter & Search controls
  const [filter, setFilter] = useState('all');
  const [nameSearch, setNameSearch] = useState('');

  // Editing notes state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  // Copy feedback state
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchLeads = async (currentFilter = filter, currentSearch = nameSearch) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentFilter !== 'all') params.set('filter', currentFilter);
      if (currentSearch.trim()) params.set('search', currentSearch.trim());

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 403) {
          showToast('Bu alana yalnızca Sistem Yöneticisi (Super Admin) erişebilir.', 'error');
        }
        return;
      }
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        if (data.stats) setStats(data.stats);
        if (data.recentSearches) setRecentSearches(data.recentSearches);
        setHasApiKey(Boolean(data.hasApiKey));
      }
    } catch (e) {
      console.error('Fetch leads failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter or search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads(filter, nameSearch);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, nameSearch]);

  // Polling for async search
  const pollSearchStatus = (searchId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/leads/search/status?searchId=${searchId}`);
        const data = await res.json();

        if (data.status === 'COMPLETED') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setSearching(false);
          setSearchProgressMsg('');
          setActiveSearchId(null);
          showToast(
            `Arama tamamlandı! ${data.foundCount} işletme bulundu, ${data.newLeadsCount} yeni potansiyel müşteri listeye eklendi.`,
            'success'
          );
          fetchLeads();
        } else if (data.status === 'FAILED') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setSearching(false);
          setSearchProgressMsg('');
          setActiveSearchId(null);
          showToast(data.error || 'Arama işlemi sırasında bir sorun oluştu.', 'error');
        } else {
          setSearchProgressMsg('Google Maps üzerinden işletmeler taranıyor... Lütfen bekleyin...');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
  };

  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || searching) return;

    setSearching(true);
    setSearchProgressMsg('Outscraper API araması başlatılıyor...');

    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryInput, limit }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSearching(false);
        setSearchProgressMsg('');
        showToast(data.error || 'Arama başlatılamadı.', 'error');
        return;
      }

      if (data.searchId) {
        setActiveSearchId(data.searchId);
        showToast(`Arama başlatıldı: "${data.query}" (${data.limit} sonuç)`, 'info');
        setSearchProgressMsg('İşlem kuyruğa alındı, sonuçlar bekleniyor...');
        pollSearchStatus(data.searchId);
      }
    } catch (err: any) {
      setSearching(false);
      setSearchProgressMsg('');
      showToast('Ağ bağlantısı hatası oluştu. Lütfen tekrar deneyin.', 'error');
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l))
      );

      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Güncelleme başarısız');

      showToast(`Durum "${STATUS_CONFIG[newStatus]?.label || newStatus}" olarak güncellendi.`, 'success');
      // Refresh stats
      fetchLeads();
    } catch {
      showToast('Durum güncellenirken hata oluştu.', 'error');
      fetchLeads();
    }
  };

  const handleSaveNote = async (leadId: string) => {
    setSavingNoteId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: noteDraft }),
      });

      if (!res.ok) throw new Error('Not kaydedilemedi');

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, notes: noteDraft } : l))
      );
      setEditingNoteId(null);
      showToast('Not başarıyla kaydedildi.', 'success');
    } catch {
      showToast('Not kaydedilirken bir sorun oluştu.', 'error');
    } finally {
      setSavingNoteId(null);
    }
  };

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (!confirm(`"${leadName}" işletmesini listeden silmek istediğinize emin misiniz?`)) return;

    try {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Silinemedi');
      showToast(`"${leadName}" silindi.`, 'info');
      fetchLeads();
    } catch {
      showToast('Silme işlemi başarısız oldu.', 'error');
      fetchLeads();
    }
  };

  const handleCopyPhone = (phone: string, leadId: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(leadId);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('filter', filter);
    if (nameSearch.trim()) params.set('search', nameSearch.trim());
    window.location.href = `/api/leads/export?${params.toString()}`;
    showToast('CSV dosyası hazırlanıyor ve indiriliyor...', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border transition-all animate-bounce">
          {toast.type === 'success' && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-xl border">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toast.message}</span>
            </div>
          )}
          {toast.type === 'error' && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800 px-4 py-2.5 rounded-xl border">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{toast.message}</span>
            </div>
          )}
          {toast.type === 'info' && (
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-4 py-2.5 rounded-xl border">
              <Info className="w-4 h-4 text-blue-600" />
              <span>{toast.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Potansiyel Spor Salonları
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              B2B Lead Avcısı
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Google Maps üzerinden potansiyel spor salonlarını bul ve iletişime geç.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl shadow-subtle transition disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>CSV İndir</span>
          </button>
          <button
            onClick={() => fetchLeads()}
            disabled={loading}
            className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* API Key Missing Warning Banner */}
      {!hasApiKey && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">
              Outscraper API Anahtarı Bekleniyor
            </h4>
            <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              Google Maps üzerinden canlı spor salonu taraması yapabilmek için Vercel veya <code className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 font-mono text-[11px]">.env</code> ortam değişkenlerine <span className="font-bold">OUTSCRAPER_API_KEY</span> değerini ekleyin. API anahtarı eklenene kadar mevcut kayıtlı işletmeleri yönetebilir, not ekleyebilir ve WhatsApp ile irtibat kurabilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Toplam Lead</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {stats.totalLeads}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Telefonu Olan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {stats.withPhone}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">İletişime Geçilen</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {stats.contacted}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">İlgilenen</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {stats.interested}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Kazanılan Müşteri</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.customer}
          </p>
        </div>
      </div>

      {/* Main Search Action Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Google Maps ile Spor Salonu Ara
              </h2>
              <p className="text-[11px] text-slate-500">
                Şehir, ilçe adı veya doğrudan Google Maps arama URL'si girin.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {limit} işletmeye kadar taranacak
          </span>
        </div>

        <form onSubmit={handleStartSearch} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Google Maps URL'si veya arama sorgusu (örn: Mersin spor salonları veya https://www.google.com/maps/search/spor+salonları+mersin/)"
                disabled={searching}
                className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                disabled={searching}
                className="px-3 py-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none font-medium cursor-pointer"
              >
                <option value={20}>20 İşletme</option>
                <option value={50}>50 İşletme (Önerilen)</option>
                <option value={100}>100 İşletme</option>
                <option value={200}>200 İşletme (Maksimum)</option>
              </select>

              <button
                type="submit"
                disabled={searching || !queryInput.trim()}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {searching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Taranıyor...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>Spor Salonlarını Bul</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Searching Status Progress Banner */}
        {searching && (
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-700 dark:text-blue-300 animate-pulse">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
              <span>{searchProgressMsg || 'Arama devam ediyor...'}</span>
            </div>
            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
              Vercel arka plan senkronizasyonu aktif
            </span>
          </div>
        )}

        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Son Aramalar</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setQueryInput(s.query);
                    setNameSearch('');
                  }}
                  className="inline-flex items-center gap-2 px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition"
                >
                  <span className="font-medium truncate max-w-[180px]">{s.query}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-400">
                    +{s.newLeadsCount} yeni
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Table Tools */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Quick text filter */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="İşletme adına, telefona veya adrese göre filtrele..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            {leads.length} işletme listeleniyor
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('has_phone')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'has_phone'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Phone className="w-3 h-3" />
            <span>Telefonu Olan</span>
          </button>
          <button
            onClick={() => setFilter('has_whatsapp')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'has_whatsapp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <WhatsAppIcon className="w-3 h-3 text-emerald-500" />
            <span>WhatsApp Olan</span>
          </button>
          <button
            onClick={() => setFilter('has_instagram')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'has_instagram'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <InstagramIcon className="w-3 h-3 text-pink-500" />
            <span>Instagram Olan</span>
          </button>
          <button
            onClick={() => setFilter('has_website')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'has_website'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Website Olan</span>
          </button>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0" />

          {Object.entries(STATUS_CONFIG).map(([stKey, stVal]) => (
            <button
              key={stKey}
              onClick={() => setFilter(stKey)}
              className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                filter === stKey
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {stVal.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-center gap-3 text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span>Potansiyel işletmeler yükleniyor...</span>
          </div>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Henüz işletme kaydı bulunamadı
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Yukarıdaki arama çubuğuna bir şehir (örn: "Mersin spor salonları") veya bir Google Maps URL'si girerek Outscraper üzerinden potansiyel salonları taratabilirsiniz.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Spor Salonu & Puan</th>
                    <th className="py-3 px-4">İletişim & WhatsApp</th>
                    <th className="py-3 px-4">Adres</th>
                    <th className="py-3 px-4">Durum</th>
                    <th className="py-3 px-4">Notlar</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {leads.map((lead) => {
                    const waUrl = createWhatsAppUrl(lead.phone, lead.name);
                    const isEditingNote = editingNoteId === lead.id;

                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition group"
                      >
                        {/* Salon Name & Rating */}
                        <td className="py-3.5 px-4 align-top min-w-[220px]">
                          <div className="font-bold text-slate-900 dark:text-white leading-snug">
                            {lead.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {lead.rating ? (
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>{lead.rating.toFixed(1)}</span>
                                <span className="text-slate-400 font-normal">
                                  ({lead.reviews || 0})
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">Puan yok</span>
                            )}

                            {lead.googleMapsUrl && (
                              <a
                                href={lead.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:underline"
                              >
                                <span>Maps</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Contact & WhatsApp */}
                        <td className="py-3.5 px-4 align-top min-w-[200px]">
                          <div className="space-y-1.5">
                            {lead.phone ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                                  {lead.phone}
                                </span>
                                <button
                                  onClick={() => handleCopyPhone(lead.phone!, lead.id)}
                                  title="Telefonu kopyala"
                                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                  {copiedPhoneId === lead.id ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Telefon yok</span>
                            )}

                            {/* Action Links: WhatsApp, Website, Instagram */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {waUrl ? (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-sm transition"
                                  title="WhatsApp'ta mesaj hazırla ve sohbet başlat"
                                >
                                  <WhatsAppIcon className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              ) : null}

                              {lead.instagram ? (
                                <a
                                  href={lead.instagram}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 hover:bg-pink-100 font-medium text-[11px] border border-pink-200 dark:border-pink-900 transition"
                                >
                                  <InstagramIcon className="w-3 h-3" />
                                  <span>Instagram</span>
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-400">Instagram yok</span>
                              )}

                              {lead.website && (
                                <a
                                  href={lead.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] transition"
                                >
                                  <Globe className="w-3 h-3" />
                                  <span className="truncate max-w-[90px]">
                                    {lead.websiteDomain || 'Website'}
                                  </span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Address */}
                        <td className="py-3.5 px-4 align-top max-w-[220px]">
                          {lead.address ? (
                            <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 mt-0.5" />
                              <span>{lead.address}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>

                        {/* Status selector */}
                        <td className="py-3.5 px-4 align-top min-w-[150px]">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-xl border focus:outline-none cursor-pointer transition ${
                              STATUS_CONFIG[lead.status]?.badgeClass || ''
                            } ${STATUS_CONFIG[lead.status]?.border || ''}`}
                          >
                            <option value="NEW">Yeni</option>
                            <option value="CONTACTED">İletişime Geçildi</option>
                            <option value="WAITING">Cevap Bekleniyor</option>
                            <option value="INTERESTED">İlgileniyor</option>
                            <option value="NOT_INTERESTED">Olumsuz</option>
                            <option value="CUSTOMER">Müşteri</option>
                          </select>
                        </td>

                        {/* Notes */}
                        <td className="py-3.5 px-4 align-top min-w-[180px]">
                          {isEditingNote ? (
                            <div className="space-y-1.5">
                              <textarea
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                rows={2}
                                placeholder="Örn: WhatsApp'tan yazdım, demo istedi..."
                                className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleSaveNote(lead.id)}
                                  disabled={savingNoteId === lead.id}
                                  className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold"
                                >
                                  {savingNoteId === lead.id ? '...' : 'Kaydet'}
                                </button>
                                <button
                                  onClick={() => setEditingNoteId(null)}
                                  className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px]"
                                >
                                  İptal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setEditingNoteId(lead.id);
                                setNoteDraft(lead.notes || '');
                              }}
                              className="cursor-pointer group/note flex items-start gap-1 p-1 -m-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Notu düzenlemek için tıkla"
                            >
                              <span className="text-[11px] text-slate-600 dark:text-slate-400 italic flex-1">
                                {lead.notes ? lead.notes : 'Not ekle...'}
                              </span>
                              <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover/note:opacity-100 transition" />
                            </div>
                          )}
                        </td>

                        {/* Delete Action */}
                        <td className="py-3.5 px-4 align-top text-right">
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                            title="İşletmeyi sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {leads.map((lead) => {
              const waUrl = createWhatsAppUrl(lead.phone, lead.name);
              const isEditingNote = editingNoteId === lead.id;

              return (
                <div
                  key={lead.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {lead.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        {lead.rating ? (
                          <div className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{lead.rating.toFixed(1)}</span>
                            <span className="text-slate-400 font-normal">
                              ({lead.reviews || 0})
                            </span>
                          </div>
                        ) : null}

                        {lead.googleMapsUrl && (
                          <a
                            href={lead.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-medium inline-flex items-center gap-0.5"
                          >
                            <span>Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg border ${
                        STATUS_CONFIG[lead.status]?.badgeClass || ''
                      } ${STATUS_CONFIG[lead.status]?.border || ''}`}
                    >
                      <option value="NEW">Yeni</option>
                      <option value="CONTACTED">İletişime Geçildi</option>
                      <option value="WAITING">Cevap Bekleniyor</option>
                      <option value="INTERESTED">İlgileniyor</option>
                      <option value="NOT_INTERESTED">Olumsuz</option>
                      <option value="CUSTOMER">Müşteri</option>
                    </select>
                  </div>

                  {lead.address && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{lead.address}</span>
                    </div>
                  )}

                  {/* Buttons row */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {lead.instagram ? (
                      <a
                        href={lead.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 py-2 px-3 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-xl text-xs font-semibold border border-pink-200 dark:border-pink-900"
                      >
                        <InstagramIcon className="w-3.5 h-3.5" />
                        <span>Instagram</span>
                      </a>
                    ) : null}

                    {lead.website && (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    )}

                    {lead.phone && (
                      <button
                        onClick={() => handleCopyPhone(lead.phone!, lead.id)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl"
                        title="Telefonu kopyala"
                      >
                        {copiedPhoneId === lead.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteLead(lead.id, lead.name)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-xl"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Notes in Mobile Card */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {isEditingNote ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          rows={2}
                          placeholder="Notunuz..."
                          className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNote(lead.id)}
                            className="px-3 py-1 bg-blue-600 text-white font-bold rounded text-xs"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingNoteId(lead.id);
                          setNoteDraft(lead.notes || '');
                        }}
                        className="flex items-center justify-between text-slate-500 italic cursor-pointer"
                      >
                        <span>{lead.notes ? lead.notes : '+ Not ekle'}</span>
                        <Edit3 className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
