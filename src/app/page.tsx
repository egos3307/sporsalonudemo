'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import {
  Dumbbell,
  ShieldCheck,
  Zap,
  Users,
  QrCode,
  Utensils,
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Clock,
  Layers,
  Flame,
  Smartphone,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const handleQuickDemo = async (role: string) => {
    setDemoLoading(role);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (e) {
      console.error(e);
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans">
      {/* Background Glowing Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[10%] right-[20%] w-[450px] h-[450px] rounded-full bg-indigo-600/15 blur-[120px]" />
      </div>

      {/* Top Demo Bar for Easy Review */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-b border-blue-500/20 px-4 py-2 text-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-blue-200">Tek Tıkla Canlı Demo Rolleri:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleQuickDemo('admin')}
              disabled={!!demoLoading}
              className="px-2.5 py-1 rounded-md bg-blue-600/40 hover:bg-blue-600/70 border border-blue-400/30 text-white font-medium transition text-[11px]"
            >
              {demoLoading === 'admin' ? 'Giriş...' : '👑 Gym Admin (FitZone)'}
            </button>
            <button
              onClick={() => handleQuickDemo('trainer')}
              disabled={!!demoLoading}
              className="px-2.5 py-1 rounded-md bg-indigo-600/40 hover:bg-indigo-600/70 border border-indigo-400/30 text-white font-medium transition text-[11px]"
            >
              {demoLoading === 'trainer' ? 'Giriş...' : '🏋️ Antrenör (Murat)'}
            </button>
            <button
              onClick={() => handleQuickDemo('member')}
              disabled={!!demoLoading}
              className="px-2.5 py-1 rounded-md bg-emerald-600/40 hover:bg-emerald-600/70 border border-emerald-400/30 text-white font-medium transition text-[11px]"
            >
              {demoLoading === 'member' ? 'Giriş...' : '📱 Müşteri (Caner)'}
            </button>
            <button
              onClick={() => handleQuickDemo('expired_admin')}
              disabled={!!demoLoading}
              className="px-2.5 py-1 rounded-md bg-rose-600/40 hover:bg-rose-600/70 border border-rose-400/30 text-white font-medium transition text-[11px]"
              title="7 günlük deneme süresi dolmuş salon senaryosu"
            >
              {demoLoading === 'expired_admin' ? 'Giriş...' : '⏳ Süresi Dolan Gym (Apex)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between sticky top-0 z-30 bg-slate-950/80 backdrop-blur-lg border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              FitPulse <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-wider">SaaS</span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition">Özellikler</a>
          <a href="#workflow" className="hover:text-white transition">Nasıl Çalışır?</a>
          <a href="#pricing" className="hover:text-white transition">Fiyatlandırma</a>
          <NextLink href="/activate-code" className="hover:text-blue-400 text-slate-300 transition flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>Müşteri Kodu Gir</span>
          </NextLink>
        </nav>

        <div className="flex items-center gap-3">
          <NextLink
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition"
          >
            Giriş Yap
          </NextLink>
          <NextLink
            href="/register"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition transform hover:scale-[1.02]"
          >
            <span>7 Gün Ücretsiz Dene</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NextLink>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Yeni Nesil Çok Kiracılı (Multi-Tenant) Spor Salonu Yönetimi</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          Spor Salonunuzu <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
            Gerçek Bir SaaS Gücüyle
          </span> Yönetin.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Kendi logonuz, kendi renkleriniz, turnike QR geçişi, antrenör-müşteri planlaması ve yapay zeka destekli gelişim takibi. 
          Üyeleriniz mobil uygulamaya kendi özel kodlarıyla bağlansın.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <NextLink
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
          >
            <span>7 Gün Ücretsiz Dene</span>
            <ArrowRight className="w-4 h-4" />
          </NextLink>

          <NextLink
            href="/activate-code"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm rounded-2xl transition"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>Müşteri Kodu ile Giriş</span>
          </NextLink>
        </div>

        {/* Live Feature Showcase Card / Mock Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto rounded-3xl p-2 bg-gradient-to-b from-slate-700/40 via-slate-800/20 to-transparent border border-slate-800 shadow-2xl overflow-hidden">
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 text-left border border-slate-800">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs text-slate-400 font-mono">fitpulse.app/admin (FitZone Pro Club)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Salonda 9 Kişi Aktif</span>
              </div>
            </div>

            {/* Dashboard Mock Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[11px] text-slate-400">Toplam Üye</p>
                <p className="text-2xl font-bold text-white mt-1">22</p>
                <span className="text-[10px] text-emerald-400 font-medium">↑ %14 artış</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[11px] text-slate-400">Bugün Giriş Yapan</p>
                <p className="text-2xl font-bold text-white mt-1">12</p>
                <span className="text-[10px] text-blue-400 font-medium">QR Turnike</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[11px] text-slate-400">Aktif Antrenör</p>
                <p className="text-2xl font-bold text-white mt-1">3</p>
                <span className="text-[10px] text-indigo-400 font-medium">Tam Kadro</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[11px] text-slate-400">Deneme Süresi</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">5 Gün</p>
                <span className="text-[10px] text-slate-400">Aktif Pro Trial</span>
              </div>
            </div>

            {/* Preview Banner */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-600/30 text-blue-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Müşteri Mobil Deneyimi</p>
                  <p className="text-[11px] text-slate-400">Üyeler antrenman hareketlerini tamamlar, dinlenme sayacını izler ve suyunu takip eder.</p>
                </div>
              </div>
              <button
                onClick={() => handleQuickDemo('member')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Müşteri Uygulamasını Aç
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Multi-Tenant Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold text-blue-400 tracking-wider mb-2">Modern SaaS Mimarisi</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Her Spor Salonu İçin Ayrı Dünya, Sıfır Veri Karışıklığı.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Tam İzolasyonlu Multi-Tenancy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Her spor salonunun kendi admin paneli, antrenörleri ve üyeleri vardır. Bir salon asla diğer salonun verilerine erişemez (IDOR korumalı).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">QR Turnike & Check-in</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Her üyenin kişisel QR kodu vardır. Danışma ekranında QR okutulduğunda anında giriş/çıkış yapılır ve salondaki kişi sayısı canlı güncellenir.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Özel Marka & Renkler</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Salonunuzun logosunu yükleyin, ana renk paletinizi seçin. Üyelerinizin mobil ekranı otomatik olarak salonunuzun kurumsal kimliğine bürünür.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center mb-4">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">İnteraktif Antrenman & Sayaç</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Gün gün split programlar, hareket videoları, set ve ağırlık takibi. Dinlenme süresi sayacı ve tebrik konfetileri ile antrenman deneyimi zirvede.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-rose-600/10 text-rose-400 flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Diyet & Makro Takibi</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Antrenörler 6 öğün detaylı beslenme listesi yazar; üye yedikçe işaretler ve anlık kalori, protein, karbonhidrat, yağ barları dolar.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">7 Gün Ücretsiz Deneme</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Kayıt olunduğunda 7 günlük trial başlar. Süre bittiğinde veri silinmez, korumalı ekran devreye girer ve tek tıkla aktifleştirilebilir.
            </p>
          </div>
        </div>
      </section>

      {/* Member Onboarding Flow Preview */}
      <section id="workflow" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold text-blue-400 tracking-wider mb-2">Kolay Entegrasyon</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Müşterileriniz 3 Adımda Sisteme Bağlanır
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              1
            </div>
            <h4 className="font-bold text-white mb-2">Admin Üyeyi Oluşturur</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yönetici panelden yeni üye ekler. Sistem anında benzersiz bir üye kodu (Örn: <span className="font-mono text-blue-400">GYM-A7K92X</span>) üretir.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              2
            </div>
            <h4 className="font-bold text-white mb-2">Üye Kodunu Girer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Üye mobil ekranda kodunu girer. Salonunuzun logosu ve hoş geldiniz karşılaması ile kendi şifresini belirler.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              3
            </div>
            <h4 className="font-bold text-white mb-2">Sürekli Bağlantı</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Programlarını uygular, QR ile salona girer, su ve kilo gelişimini anlık olarak antrenörüyle paylaşır.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold text-blue-400 tracking-wider mb-2">Fiyatlandırma</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Şeffaf, Gizli Ücret Olmayan Planlar
          </p>
          <p className="text-sm text-slate-400 mt-2">
            İlk 7 gün hiçbir kredi kartı gerekmeden tamamen ücretsiz deneyebilirsiniz.
          </p>
        </div>

        <div className="max-w-md mx-auto rounded-3xl p-8 bg-gradient-to-b from-blue-900/30 via-slate-900/70 to-slate-900 border-2 border-blue-500/50 shadow-2xl relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md">
            En Popüler Seçim
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white">FitPulse Pro Club</h3>
            <p className="text-xs text-slate-400 mt-1">Tek spor salonu için eksiksiz yönetim paketi</p>
            <div className="mt-4 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-white">1.490 ₺</span>
              <span className="text-xs text-slate-400 font-medium">/ ay</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">7 Günlük Ücretsiz Deneme Dahil</p>
          </div>

          <ul className="space-y-3 mb-8 text-xs text-slate-300">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Sınırsız Müşteri ve Antrenör Tanımlama</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Canlı QR Turnike Check-in İstasyonu</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Gelişmiş Antrenman & Diyet Planlayıcı</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Özel Logo, Renk ve Marka Ayarları</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Mobil Uyumlu Müşteri Portalı</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Haftalık ve Aylık İstatistik Grafikleri</span>
            </li>
          </ul>

          <NextLink
            href="/register"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:scale-[1.02]"
          >
            <span>7 Gün Ücretsiz Dene</span>
            <ArrowRight className="w-4 h-4" />
          </NextLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-slate-400">FitPulse Spor Salonu Yönetim SaaS Platformu</span>
        </div>
        <p>© 2026 FitPulse Technologies. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
