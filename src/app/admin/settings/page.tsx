'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Palette,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { formatDateTr } from '@/lib/utils';

export default function GymSettingsPage() {
  const [gym, setGym] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activating, setActivating] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.gym) {
        setGym(data.gym);
        setName(data.gym.name || '');
        setLogo(data.gym.logo || '');
        setPrimaryColor(data.gym.primaryColor || '#2563eb');
        setAccentColor(data.gym.accentColor || '#3b82f6');
        setPhone(data.gym.phone || '');
        setEmail(data.gym.email || '');
        setAddress(data.gym.address || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          logo,
          primaryColor,
          accentColor,
          phone,
          email,
          address,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        fetchSettings();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleActivateSubscription = async () => {
    setActivating(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACTIVATE_SUBSCRIPTION' }),
      });
      if (res.ok) {
        fetchSettings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActivating(false);
    }
  };

  const colorPresets = [
    { name: 'Okyanus Mavisi', primary: '#2563eb', accent: '#3b82f6' },
    { name: 'Zümrüt Yeşili', primary: '#059669', accent: '#10b981' },
    { name: 'Enerji Turuncusu', primary: '#ea580c', accent: '#f97316' },
    { name: 'Siber Mor', primary: '#7c3aed', accent: '#8b5cf6' },
    { name: 'Lav Kırmızısı', primary: '#dc2626', accent: '#ef4444' },
    { name: 'Neon Altın', primary: '#d97706', accent: '#f59e0b' },
  ];

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-xs">Ayarlar yükleniyor...</div>;
  }

  const now = new Date();
  const diffMs = gym ? new Date(gym.trialEndsAt).getTime() - now.getTime() : 0;
  const remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isExpired =
    gym?.subscriptionStatus === 'EXPIRED' ||
    (gym?.subscriptionStatus === 'TRIAL' && remainingDays <= 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Salon & Marka Ayarları
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Logo, renk paleti, iletişim bilgileri ve 7 günlük abonelik durumu
        </p>
      </div>

      {/* Subscription / 7-Day Trial Status Card */}
      <div
        className={`p-6 rounded-3xl border shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isExpired
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white border-red-500'
            : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl ${
              isExpired ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600'
            }`}
          >
            {isExpired ? <ShieldAlert className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isExpired
                    ? 'bg-black/30 text-white'
                    : gym?.subscriptionStatus === 'ACTIVE'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}
              >
                {gym?.subscriptionStatus === 'ACTIVE'
                  ? 'PRO ABONELİK AKTİF'
                  : isExpired
                  ? 'DENEME SÜRESİ SONA ERDİ'
                  : '7 GÜNLÜK ÜCRETSİZ DENEME'}
              </span>
            </div>

            <h3
              className={`text-lg font-bold mt-1 ${
                isExpired ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
            >
              {isExpired
                ? 'Deneme süreniz sona erdi. Devam etmek için hesabınızı aktifleştirin.'
                : gym?.subscriptionStatus === 'ACTIVE'
                ? 'Hesabınız Aktif ve Sınırsız'
                : `Deneme sürenizin bitmesine ${remainingDays} gün kaldı`}
            </h3>

            <p
              className={`text-xs mt-1 max-w-xl ${
                isExpired ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Deneme başlangıcı: {formatDateTr(gym?.trialStart)} | Bitiş:{' '}
              {formatDateTr(gym?.trialEndsAt)}. Verileriniz asla silinmez.
            </p>
          </div>
        </div>

        {/* Action Button to activate */}
        <button
          onClick={handleActivateSubscription}
          disabled={activating}
          className={`px-6 py-3 rounded-2xl font-bold text-xs md:text-sm shadow-xl flex items-center gap-2 transition transform hover:scale-[1.02] flex-shrink-0 ${
            isExpired
              ? 'bg-white text-red-600 hover:bg-red-50'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>
            {activating
              ? 'Aktifleştiriliyor...'
              : gym?.subscriptionStatus === 'ACTIVE'
              ? 'Aboneliği Yenile / Uzat'
              : 'Planı Şimdi Aktifleştir'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
            Kurumsal Kimlik & İletişim
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Spor salonunuzun ismi, logusu ve iletişim adreslerini buradan yönetin
          </p>

          {savedSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Ayarlarınız başarıyla kaydedildi!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Spor Salonu Adı *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Logo Görsel URL *
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Kare (1:1) oranında şeffaf veya yüksek çözünürlüklü bir logo görseli tavsiye edilir.
              </p>
            </div>

            {/* Color Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Salon Ana Rengi (Kurumsal Tema)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.primary}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setAccentColor(preset.accent);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      primaryColor === preset.primary
                        ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span className="text-xs text-slate-800 dark:text-slate-200 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono w-28"
                />
                <span className="text-[11px] text-slate-400">Özel HEX Renk Kodu</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  İletişim Telefonu
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resmi E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Adres Bilgisi
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </form>
        </div>

        {/* Live Brand Preview Card (1 col) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Canlı Marka Önizlemesi
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Müşterilerin mobil ekranında ve üye kartında nasıl görünecektir:
            </p>

            {/* Mobile App Screen Mockup */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-950 shadow-inner">
              {/* Header Preview */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center font-bold text-white shadow"
                  style={{ backgroundColor: primaryColor }}
                >
                  {logo ? (
                    <img src={logo} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {name || 'Spor Salonunuz'}
                  </p>
                  <p className="text-[10px] text-slate-400">Üye Portalı</p>
                </div>
              </div>

              {/* Sample Member Card */}
              <div
                className="my-4 p-4 rounded-2xl text-white shadow-lg relative overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                      Üye Kimlik Kartı
                    </span>
                    <h4 className="font-extrabold text-sm mt-0.5">Caner Erkin</h4>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] opacity-80 block">Müşteri Kodu</span>
                    <span className="font-mono text-xs font-bold">GYM-A7K92X</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                    Aktif Üye
                  </span>
                </div>
              </div>

              {/* Workout CTA preview */}
              <button
                className="w-full py-2 rounded-xl text-white font-bold text-xs shadow transition"
                style={{ backgroundColor: primaryColor }}
              >
                Bugünkü Antrenmanı Başlat
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Yapılan renk ve logo güncellemeleri tüm müşterilere anında yansır.
          </p>
        </div>
      </div>
    </div>
  );
}
