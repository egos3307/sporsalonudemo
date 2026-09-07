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
  MessageCircle,
  ExternalLink,
  Globe,
  Building2,
} from 'lucide-react';

export default function GymOSLandingPage() {
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
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-emerald-950/90 border-b border-emerald-500/20 px-4 py-2.5 text-xs backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-300">
              ⚡ Salon Sahiplerine Özel Canlı Test: Tek Tıkla Rol Değiştir
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleQuickDemo('admin')}
              disabled={!!demoLoading}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold transition text-xs flex items-center gap-1.5 shadow-sm"
            >
              {demoLoading === 'admin' ? 'Açılıyor...' : '👑 GymOS Yönetici Paneli'}
            </button>
            <NextLink
              href="/salon/fitzone"
              target="_blank"
              className="px-3 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-semibold transition text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Müşterinin Göreceği Salon Sitesi</span>
              <ExternalLink className="w-3 h-3 text-teal-300" />
            </NextLink>
            <NextLink
              href="/activate-code"
              className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-white font-semibold transition text-xs flex items-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Müşteri Kodu Gir</span>
            </NextLink>
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
                Gym<span className="text-emerald-400">OS</span>
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                SaaS v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Spor Salonu İşletim & Büyüme Sistemi</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition">Özellikler</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition">Nasıl Çalışır?</a>
          <a href="#whatsapp" className="hover:text-emerald-400 transition">WhatsApp Daveti</a>
          <a href="#pricing" className="hover:text-emerald-400 transition">Fiyatlandırma</a>
          <NextLink href="/salon/fitzone" target="_blank" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1.5 font-semibold">
            <Globe className="w-4 h-4" />
            <span>Örnek Salon Sitesi</span>
            <ExternalLink className="w-3 h-3" />
          </NextLink>
        </nav>

        <div className="flex items-center gap-3">
          <NextLink
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition border border-slate-800"
          >
            Yönetici Girişi
          </NextLink>
          <NextLink
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition transform hover:scale-[1.03]"
          >
            <span>7 Gün Ücretsiz Başla</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </NextLink>
        </div>
      </header>

      {/* Hero Section (B2B SaaS for Gym Owners) */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 shadow-inner shadow-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>SPOR SALONU SAHİPLERİ İÇİN HEPSİ BİR ARADA PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Spor Salonunuzu Yeni Nesil{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            GymOS ile Yönetin
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Salonunuza özel bağımsız web sitesi, antrenör-müşteri panelleri, turnike QR geçişi ve müşterilerinize tek tıkla WhatsApp üzerinden üye portalı gönderme gücü — ilk 7 gün tamamen ücretsiz.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-16">
          <NextLink
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition transform hover:-translate-y-0.5"
          >
            <span>Salonunu Ücretsiz Kaydet (7 Gün)</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </NextLink>

          <NextLink
            href="/salon/fitzone"
            target="_blank"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold text-sm rounded-2xl transition backdrop-blur-md"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Müşterinin Göreceği Web Sitesini İncele</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </NextLink>
        </div>

        {/* 4 Core Pillars for the Gym Owner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Salonunuza Özel Web Sitesi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Logonuz ve adınızla müşterilerinizin göreceği bağımsız site. Müşterileriniz asla sistem markasını görmez.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">WhatsApp ile Tek Tık Davet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Müşterinizi ekleyin; web sitenizi ve giriş kodunu içeren hazır şablonu WhatsApp üzerinden saniyeler içinde gönderin.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">0-Kurulum & Temiz Panel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kaydolun, sıfır veriyle temiz yönetim paneliniz açılsın. Antrenör ve müşterilerinizi dilediğiniz gibi ekleyin.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Turnike QR & Canlı Sayaç</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Danışma ekranından QR okutarak anında giriş-çıkış takibi yapın, salondaki aktif kişi sayısını canlı izleyin.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            Hızlı Başlangıç
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Salonunuzu 3 Adımda Sisteme Alın
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Hiçbir teknik bilgiye gerek duymadan dakikalar içinde dijitalleşin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black font-black text-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Salonunuzu Kaydedin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Salon adınızı ve bilgilerinizi girin. Sistem anında salonunuza özel web sitesini (<span className="font-mono text-emerald-400">/salon/adiniz</span>) ve 0 veriyle temiz admin panelinizi oluşturur.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-black font-black text-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Eğitmen ve Müşterileri Ekleyin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Antrenör kadronuzu tanımlayın, yeni müşterilerinizi sisteme ekleyin. Sistem her üye için benzersiz müşteri kodu üretir.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-black font-black text-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-400/20">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">WhatsApp ile Müşteriye Gönderin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Müşterinizin yanındaki yeşil WhatsApp butonuna basın. Salon web siteniz ve giriş kodu müşterinize anında iletilsin.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp Feature Showcase */}
      <section id="whatsapp" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/15 text-[#25D366] text-xs font-bold uppercase tracking-wider mb-4 border border-[#25D366]/30">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Tek Tıkla Müşteri Bildirimi</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Müşterilerinize Salonunuzun Sitesini ve Kodunu Anında Gönderin
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Müşteri yönetimi tablosunda her üyenin yanında özel bir yeşil WhatsApp butonu bulunur. Tıkladığınızda üyenin adına ve salonunuza özel hazırlanan hazır davet mesajı açılır. Müşteri linke tıkladığında doğrudan salonunuzun kendi web sitesini görür.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuickDemo('admin')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                Admin Panelinde Gör
              </button>
              <NextLink
                href="/salon/fitzone"
                target="_blank"
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <span>Örnek Müşteri Sitesi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </NextLink>
            </div>
          </div>

          <div className="w-full lg:w-96 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs pb-2 border-b border-slate-800">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Örnek WhatsApp Mesajı:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-200">
              Merhaba Ahmet! 💪 <span className="text-emerald-400 font-bold">FitZone Pro Club</span> ailemize hoş geldiniz.
              <br /><br />
              Size özel hazırladığımız salon web sitemiz ve dijital üye portalınız hazır!
              <br /><br />
              🌐 <span className="text-emerald-300 font-semibold">Salon Web Sitemiz:</span> fitpulse.app/salon/fitzone<br />
              🔑 <span className="text-emerald-300 font-semibold">Üye Giriş Kodunuz:</span> GYM-8X92KP<br />
              📱 <span className="text-emerald-300 font-semibold">Giriş Ekranı:</span> fitpulse.app/activate-code
              <br /><br />
              İyi antrenmanlar dileriz!
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            Fiyatlandırma
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Şeffaf Salon Yönetim Paketleri
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            İlk 7 gün hiçbir kredi kartı gerekmeden tamamen ücretsiz deneyin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Plan 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Standart Salon</h3>
              <p className="text-xs text-slate-400 mt-1">Butik ve stüdyo salonlar için</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">990 ₺</span>
                <span className="text-xs text-slate-400 font-medium">/ ay</span>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Salonunuza Özel Web Sitesi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>100 Üyeye Kadar Yönetim</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp ile Üye Davet Butonu</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Turnike QR Canlı Geçiş İstasyonu</span>
                </li>
              </ul>
            </div>
            <NextLink
              href="/register"
              className="mt-8 w-full py-3.5 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition block"
            >
              7 Gün Ücretsiz Başla
            </NextLink>
          </div>

          {/* Plan 2 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-900 border-2 border-emerald-500/50 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black font-black text-xs uppercase tracking-wider shadow-md">
              En Çok Tercih Edilen
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">GymOS Pro Club</h3>
              <p className="text-xs text-slate-400 mt-1">Gelişmiş spor salonu işletmeleri için</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-emerald-400">1.490 ₺</span>
                <span className="text-xs text-slate-400 font-medium">/ ay</span>
              </div>
              <ul className="mt-8 space-y-3.5 text-xs text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Sınırsız Üye ve Antrenör Tanımlama</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Salonunuza Özel Web Sitesi & Marka Renkleri</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>NVIDIA Yapay Zeka Egzersiz Video Koçu</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>WhatsApp Tek Tıkla Müşteri Gönderimi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Turnike QR Canlı Geçiş İstasyonu</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Potansiyel Müşteri Bulucu (B2B Leads)</span>
                </li>
              </ul>
            </div>
            <NextLink
              href="/register"
              className="mt-8 w-full py-4 text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm shadow-xl shadow-emerald-500/25 transition transform hover:scale-[1.02] block"
            >
              Hemen Başla (7 Gün Ücretsiz)
            </NextLink>
          </div>

          {/* Plan 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise Çoklu Şube</h3>
              <p className="text-xs text-slate-400 mt-1">Zincir spor salonları ve kulüpler</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">3.490 ₺</span>
                <span className="text-xs text-slate-400 font-medium">/ ay</span>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Çoklu Şube & Merkezi Raporlama</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Özel Alan Adı (Custom Domain) Desteği</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>7/24 Öncelikli VIP Teknik Destek</span>
                </li>
              </ul>
            </div>
            <NextLink
              href="/register"
              className="mt-8 w-full py-3.5 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition block"
            >
              Bize Ulaşın
            </NextLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05080e] py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-black">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">GymOS Technologies</span>
              <p className="text-[11px] text-slate-400">Spor Salonu Yönetim ve Büyüme SaaS Altyapısı</p>
            </div>
          </div>
          <p>© 2026 GymOS. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
