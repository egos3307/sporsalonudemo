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
  Play,
  Droplets,
  Target,
  Award,
  Phone,
  MapPin,
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-emerald-500 selection:text-black font-sans antialiased">
      {/* Background Ambient Neon Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-teal-500/8 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[550px] h-[550px] rounded-full bg-blue-500/5 blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* Top Demo Bar for Gym Owners & Evaluators */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 border-b border-emerald-500/20 px-4 py-2.5 text-xs backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-300">
              ⚡ Salon Sahibine Özel Canlı Test: Tek Tıkla Rol Değiştir
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleQuickDemo('admin')}
              disabled={!!demoLoading}
              className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold transition text-xs flex items-center gap-1.5 shadow-sm"
            >
              {demoLoading === 'admin' ? 'Açılıyor...' : '👑 Gym Yöneticisi (FitZone)'}
            </button>
            <button
              onClick={() => handleQuickDemo('trainer')}
              disabled={!!demoLoading}
              className="px-3 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-semibold transition text-xs flex items-center gap-1.5 shadow-sm"
            >
              {demoLoading === 'trainer' ? 'Açılıyor...' : '🏋️ Antrenör Paneli (Murat)'}
            </button>
            <button
              onClick={() => handleQuickDemo('member')}
              disabled={!!demoLoading}
              className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-white font-semibold transition text-xs flex items-center gap-1.5 shadow-sm ring-1 ring-emerald-500/20"
            >
              {demoLoading === 'member' ? 'Açılıyor...' : '📱 Müşteri Paneli (Caner)'}
            </button>
            <button
              onClick={() => handleQuickDemo('expired_admin')}
              disabled={!!demoLoading}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-medium transition text-xs"
              title="7 günlük deneme süresi dolmuş salon senaryosu"
            >
              {demoLoading === 'expired_admin' ? 'Açılıyor...' : '⏳ Süresi Dolan Gym'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/60 bg-[#070b14]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40">
            <Dumbbell className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-wider text-white">
                FIT<span className="text-emerald-400">ZONE</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                PRO CLUB
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Akıllı Spor Salonu Ekosistemi</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-emerald-400 transition">Ana Sayfa</a>
          <a href="#services" className="hover:text-emerald-400 transition">Hizmetler</a>
          <a href="#features" className="hover:text-emerald-400 transition">Özellikler</a>
          <a href="#trainers" className="hover:text-emerald-400 transition">Antrenörler</a>
          <a href="#pricing" className="hover:text-emerald-400 transition">Üyelik</a>
          <NextLink href="/activate-code" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 font-semibold">
            <QrCode className="w-4 h-4" />
            <span>Müşteri Kodu Gir</span>
          </NextLink>
        </nav>

        <div className="flex items-center gap-3">
          <NextLink
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition border border-slate-800"
          >
            Giriş Yap
          </NextLink>
          <NextLink
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition transform hover:scale-[1.03]"
          >
            <span>Üye Ol</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </NextLink>
        </div>
      </header>

      {/* Hero Section (Matching Reference Image Top-Left) */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 shadow-inner shadow-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>FITZONE • Yeni Nesil Spor Salonu Deneyimi</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Daha Güçlü{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Bir Sen
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Profesyonel antrenörler, kişiye özel programlar, NVIDIA Yapay Zeka destekli video rehberi ve modern ekipmanlarla hedeflerine en hızlı şekilde ulaş.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => handleQuickDemo('member')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition transform hover:-translate-y-0.5"
          >
            <span>Hemen Başla</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <a
            href="#services"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold text-sm rounded-2xl transition backdrop-blur-md"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span>Tesisimizi Keşfet</span>
          </a>
        </div>

        {/* 4 Feature Badges (Exact match with reference design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition duration-300 group hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition">
              Uzman Antrenörler
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Alanında deneyimli, sertifikalı antrenörlerle her adımda doğru form ve kesintisiz motivasyon.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition duration-300 group hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition">
              Modern Ekipmanlar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Biyomekanik açıdan kusursuz, son teknoloji kardiyo ve serbest ağırlık istasyonları.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition duration-300 group hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition">
              Kişiye Özel Programlar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              NVIDIA Yapay Zeka destekli egzersiz video koçu, set takibi ve kişiye özel diyet listeleri.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition duration-300 group hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition">
              Sağlıklı Yaşam Desteği
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              İnteraktif su takipçisi, vücut ölçüm grafikleri, QR turnike geçişi ve 7/24 antrenör danışmanlığı.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            Hizmetlerimiz
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hedefinize Özel Antrenman Deneyimi
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Fitness hedefleriniz ne olursa olsun, FitZone uzmanlığı ve dijital takip altyapısı yanınızda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service 1 */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-black transition">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fitness & Kardiyo</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Yağ yakımı, kas kütlesi kazanımı ve dayanıklılık için özel kardiyo ve ağırlık çalışma alanları.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>Keşfet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Service 2 */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-black transition">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Kişisel Antrenman (PT)</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Birebir eğitmen eşliğinde, vücut analizinize göre şekillendirilen yüksek verimli seanslar.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>Keşfet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Service 3 */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-black transition">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Grup Dersleri</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Spinning, Pilates, Crossfit ve HIIT ile yüksek enerjili toplu antrenman seansları.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>Keşfet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Service 4 */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-black transition">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Beslenme & Diyet</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Antrenman hedeflerinizle senkronize makro ve kalori hesaplı profesyonel beslenme programları.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>Keşfet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Gym Owner SaaS & Portal Showcase */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            Spor Salonu Yöneticileri İçin
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Salonunuzu Dijital Bir Güce Dönüştürün
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
            Kendi logonuz, kendi antrenör kadronuz ve üyeleriniz için modern mobil arayüz. 
            Tek panelden turnike QR geçişlerini, üye aidatlarını ve antrenman akışını yönetin.
          </p>
        </div>

        {/* 3 Interactive Cards to preview portals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portal 1: Gym Admin */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Yönetici Paneli
                </span>
                <span className="text-xs text-slate-400">FitZone Pro Club</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Yönetim & Turnike QR</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Üyelerinizi tanımlayın, otomatik üyelik kodları oluşturun, danışma QR kamerasıyla canlı giriş-çıkışları kontrol edin.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Çok Kiracılı (Multi-Tenant) Güvenli Veri İzolasyonu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anlık Salondaki Kişi Sayacı & Canlı Geçişler</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Potansiyel Salon Arama & B2B Lead Bulucu</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-black text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>Admin Panelini İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Portal 2: Trainer Dashboard */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">
                  Antrenör Portalı
                </span>
                <span className="text-xs text-slate-400">Murat Hoca</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Danışan & Program Takibi</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Danışanlarınıza split antrenmanlar ve diyet listeleri atayın, haftalık ölçüm grafiklerini ve mesajları tek ekrandan görün.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bugünkü Seanslar ve Randevu Takvimi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ayrı Antrenman & Diyet Yazma Editörü</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hızlı Danışan Mesajlaşması & İlerleme Kartları</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickDemo('trainer')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-black text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>Antrenör Panelini İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Portal 3: Member Experience */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-emerald-950/30 via-slate-900/90 to-slate-950 border-2 border-emerald-500/40 hover:border-emerald-400 transition duration-300 flex flex-col justify-between relative shadow-xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] uppercase tracking-wider">
              Üye Deneyimi
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Müşteri Portalı
                </span>
                <span className="text-xs text-slate-400">Caner (Üye)</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mobil & Masaüstü Üye Portalı</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                İnteraktif su sayacı, NVIDIA Yapay Zeka ile hareket video önerisi, günlük egzersiz kontrol listesi ve diyet takip ekranı.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Yapay Zeka Destekli YouTube Egzersiz Videosu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Yaratıcı Su Tüketim Takipçisi (+250ml / +500ml)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ayrı Diyet & Antrenman Takip Sayfaları</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickDemo('member')}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Müşteri Panelini Canlı Aç</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>
      </section>

      {/* Trainers Showcase */}
      <section id="trainers" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            Eğitmen Kadromuz
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Şampiyonluk Tecrübesine Sahip Antrenörler
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Hedeflerinize ulaşmanız için yanınızda olan uzman kadromuz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              MK
            </div>
            <h4 className="text-base font-bold text-white">Murat Kaya</h4>
            <p className="text-xs text-emerald-400 font-medium mb-2">Baş Antrenör & Hipertrofi Uzmanı</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              10+ yıl deneyim, Türkiye Vücut Geliştirme Federasyonu sertifikalı, 200+ danışan başarısı.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-black font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
              EY
            </div>
            <h4 className="text-base font-bold text-white">Ece Yıldız</h4>
            <p className="text-xs text-teal-400 font-medium mb-2">Pilates & Postür Eğitmeni</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reformer Pilates uzmanı, omurga sağlığı ve fonksiyonel esneklik danışmanı.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 text-black font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              BA
            </div>
            <h4 className="text-base font-bold text-white">Burak Aksoy</h4>
            <p className="text-xs text-emerald-400 font-medium mb-2">Crossfit & Performans Koçu</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kondisyon, patlayıcı güç geliştirme ve dayanıklılık alanında uzmanlaşmış milli sporcu.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            Üyelik Paketleri
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Şeffaf ve Esnek Üyelik Seçenekleri
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            İlk 7 gün hiçbir taahhüt olmadan tüm dijital özellikleri deneyebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Standart Üyelik</h3>
              <p className="text-xs text-slate-400 mt-1">Serbest çalışma ve kardiyo erişimi</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">950 ₺</span>
                <span className="text-xs text-slate-400 font-medium">/ ay</span>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Salona Sınırsız QR Geçişi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Kardiyo & Serbest Ağırlık Alanı</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Soyunma Odası & Dolap Erişimi</span>
                </li>
              </ul>
            </div>
            <NextLink
              href="/register"
              className="mt-8 w-full py-3.5 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Başvur
            </NextLink>
          </div>

          {/* Plan 2: VIP Best Value */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-900 border-2 border-emerald-500/50 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black font-black text-xs uppercase tracking-wider shadow-md">
              En Çok Tercih Edilen
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">FitZone Pro Club</h3>
              <p className="text-xs text-slate-400 mt-1">Eksiksiz antrenör ve yapay zeka paketi</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-emerald-400">1.490 ₺</span>
                <span className="text-xs text-slate-400 font-medium">/ ay</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">7 Günlük Ücretsiz Deneme Dahil</p>
              <ul className="mt-8 space-y-3.5 text-xs text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>NVIDIA Yapay Zeka Destekli Video Koçu</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Kişiye Özel Antrenman & Diyet Programı</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Turnike QR Hızlı Geçiş İstasyonu</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Akıllı Su Tüketim & Vücut Ölçüm Takibi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Grup Seanslarına Öncelikli Rezervasyon</span>
                </li>
              </ul>
            </div>
            <NextLink
              href="/register"
              className="mt-8 w-full py-4 text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm shadow-xl shadow-emerald-500/25 transition transform hover:scale-[1.02]"
            >
              Hemen Başla (7 Gün Ücretsiz)
            </NextLink>
          </div>

          {/* Plan 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Yıllık Elit VIP</h3>
              <p className="text-xs text-slate-400 mt-1">Tüm ayrıcalıklar + Kişisel Antrenör (PT)</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">12.900 ₺</span>
                <span className="text-xs text-slate-400 font-medium">/ yıl</span>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Aylık 4 Seans Birebir Özel Antrenörlük (PT)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tüm Grup Seanslarına Sınırsız Katılım</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>VIP Lounge ve Özel Dolap Tahsisi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Yıllık Vücut Kompozisyon Raporu</span>
                </li>
              </ul>
            </div>
            <NextLink
              href="/register"
              className="mt-8 w-full py-3.5 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              VIP Katıl
            </NextLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05080e] py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-black" />
              </div>
              <span className="font-black text-xl text-white tracking-wider">
                FIT<span className="text-emerald-400">ZONE</span> PRO CLUB
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Spor salonu yönetimi, antrenör-müşteri bağlantısı ve yapay zeka destekli gelişim takip ekosistemi. 
              Müşterileriniz salona kendi özel koduyla bağlansın.
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-xs pt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>FitZone Plaza, Kat: 3, Levent / İstanbul</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>0850 300 44 44</span>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-4">Hızlı Bağlantılar</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><NextLink href="/activate-code" className="hover:text-emerald-400 transition">Müşteri Kodu Gir</NextLink></li>
              <li><NextLink href="/login" className="hover:text-emerald-400 transition">Üye Girişi</NextLink></li>
              <li><NextLink href="/register" className="hover:text-emerald-400 transition">Salon Kaydı Aç</NextLink></li>
              <li><a href="#pricing" className="hover:text-emerald-400 transition">Fiyatlandırma</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-4">Çalışma Saatleri</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex justify-between">
                <span>Hafta İçi:</span>
                <span className="text-slate-200 font-medium">06:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Cumartesi:</span>
                <span className="text-slate-200 font-medium">08:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Pazar:</span>
                <span className="text-slate-200 font-medium">09:00 - 20:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FitZone Pro Club & FitPulse Technologies. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer transition">Gizlilik Politikası</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer transition">Kullanım Koşulları</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer transition">KVKK Aydınlatma</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
