import { notFound } from 'next/navigation';
import NextLink from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Dumbbell,
  Users,
  Target,
  Droplets,
  Activity,
  Award,
  Flame,
  Utensils,
  Check,
  ChevronRight,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Sparkles,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const gym = await prisma.gym.findUnique({
    where: { slug: params.slug },
    select: { name: true },
  });

  return {
    title: gym ? `${gym.name} - Resmi Web Sitesi` : 'Spor Salonu',
    description: `${gym?.name || 'Spor Salonu'} resmi web sitesi ve dijital üye portalı.`,
  };
}

export default async function GymPublicWebsite({ params }: Props) {
  const gym = await prisma.gym.findUnique({
    where: { slug: params.slug },
    include: {
      trainers: {
        where: { isActive: true },
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!gym) {
    notFound();
  }

  const primaryColor = gym.primaryColor || '#22c55e';

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-emerald-500 selection:text-black font-sans antialiased">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-teal-500/8 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[550px] h-[550px] rounded-full bg-blue-500/5 blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* Main Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/60 bg-[#070b14]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40 overflow-hidden flex-shrink-0">
            {gym.logo ? (
              <img src={gym.logo} alt={gym.name} className="w-full h-full object-cover" />
            ) : (
              <Dumbbell className="w-6 h-6 text-black" />
            )}
          </div>
          <div>
            <span className="font-black text-xl sm:text-2xl tracking-tight text-white block">
              {gym.name}
            </span>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Resmi Web Sitesi
            </p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-emerald-400 transition">Ana Sayfa</a>
          <a href="#services" className="hover:text-emerald-400 transition">Hizmetlerimiz</a>
          <a href="#trainers" className="hover:text-emerald-400 transition">Eğitmenler</a>
          <a href="#pricing" className="hover:text-emerald-400 transition">Üyelik</a>
          <a href="#contact" className="hover:text-emerald-400 transition">İletişim</a>
        </nav>

        <div className="flex items-center gap-3">
          <NextLink
            href="/activate-code"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Müşteri Kodu Gir</span>
            <span className="sm:hidden">Kod Gir</span>
          </NextLink>

          <NextLink
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl transition border border-slate-800"
          >
            Üye Girişi
          </NextLink>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 shadow-inner shadow-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{gym.name} • Yeni Nesil Spor Deneyimi</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Daha Güçlü{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Bir Sen
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {gym.name} bünyesinde profesyonel antrenörler, kişiye özel antrenman ve diyet programları ve son teknoloji ekipmanlarla hedeflerine ulaş.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <NextLink
            href="/activate-code"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition transform hover:-translate-y-0.5"
          >
            <QrCode className="w-4 h-4 stroke-[3]" />
            <span>Müşteri Kodunla Başla</span>
          </NextLink>

          <a
            href="#services"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold text-sm rounded-2xl transition backdrop-blur-md"
          >
            <span>Tesisimizi Keşfet</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </a>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition duration-300 group hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition">
              Uzman Eğitmenler
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Alanında deneyimli, sertifikalı antrenörlerle her adımda doğru form ve kesintisiz motivasyon.
            </p>
          </div>

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

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition duration-300 group hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition">
              Kişiye Özel Programlar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yapay Zeka destekli egzersiz video koçu, set takibi ve kişiye özel diyet listeleri.
            </p>
          </div>

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
            {gym.name} Ayrıcalıkları
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Fitness hedefleriniz ne olursa olsun, salonumuzun sunduğu dijital takip altyapısı ve uzman kadrosu yanınızda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Trainers Section */}
      <section id="trainers" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            Eğitmen Kadromuz
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Uzman Antrenör Kadromuz
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Hedeflerinize ulaşmanız için yanınızda olan profesyonel eğitmenlerimiz.
          </p>
        </div>

        {gym.trainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gym.trainers.map((t) => (
              <div key={t.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 overflow-hidden">
                  {t.user.avatar ? (
                    <img src={t.user.avatar} alt={t.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{t.user.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white">{t.user.name}</h4>
                <p className="text-xs text-emerald-400 font-medium mb-2">{t.specialties || 'Fitness & Kondisyon'}</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.bio || 'Alanında deneyimli sertifikalı antrenör.'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{gym.name} Eğitmen Kadrosu</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Sertifikalı ve şampiyonluk deneyimine sahip eğitmen kadromuzla birebir veya grup antrenman seansları için salon danışmamızdan randevu alabilirsiniz.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Eğitmen Randevusu Al</span>
            </a>
          </div>
        )}
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
            {gym.name} ailesine katılmak için size en uygun üyelik paketini seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
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
            <a
              href="#contact"
              className="mt-8 w-full py-3.5 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition block"
            >
              Danışmaya Başvur
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-900 border-2 border-emerald-500/50 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black font-black text-xs uppercase tracking-wider shadow-md">
              En Çok Tercih Edilen
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{gym.name} VIP Club</h3>
              <p className="text-xs text-slate-400 mt-1">Eksiksiz antrenör ve yapay zeka paketi</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-emerald-400">1.490 ₺</span>
                <span className="text-xs text-slate-400 font-medium">/ ay</span>
              </div>
              <ul className="mt-8 space-y-3.5 text-xs text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                  <span>Yapay Zeka Destekli Video Koçu</span>
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
              </ul>
            </div>
            <a
              href="#contact"
              className="mt-8 w-full py-4 text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm shadow-xl shadow-emerald-500/25 transition transform hover:scale-[1.02] block"
            >
              VIP Kayıt Ol
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Yıllık Elit VIP</h3>
              <p className="text-xs text-slate-400 mt-1">Tüm ayrıcalıklar + Birebir Eğitmen</p>
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
                  <span>VIP Özel Dolap Tahsisi</span>
                </li>
              </ul>
            </div>
            <a
              href="#contact"
              className="mt-8 w-full py-3.5 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition block"
            >
              Danışmaya Başvur
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              İletişim & Konum
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              {gym.name} ile İletişime Geçin
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Üyelik başlatmak, salonu gezmek veya antrenörlerimizle tanışmak için bize dilediğiniz zaman ulaşabilirsiniz.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{gym.address || 'Merkez Şube, Şehir Merkezi'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{gym.phone || '0850 300 00 00'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{gym.email}</span>
              </div>
            </div>

            {gym.phone && (
              <div className="mt-8">
                <a
                  href={`https://wa.me/${gym.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Merhaba! ${gym.name} salonunuz hakkında bilgi almak istiyorum.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs shadow-lg transition"
                >
                  <span>WhatsApp ile Danışmaya Yaz</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </a>
              </div>
            )}
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Çalışma Saatleri</h3>
            <ul className="space-y-3 text-xs text-slate-300 mb-8">
              <li className="flex justify-between py-2 border-b border-slate-800">
                <span>Hafta İçi (Pazartesi - Cuma):</span>
                <span className="text-white font-semibold">06:00 - 23:00</span>
              </li>
              <li className="flex justify-between py-2 border-b border-slate-800">
                <span>Cumartesi:</span>
                <span className="text-white font-semibold">08:00 - 22:00</span>
              </li>
              <li className="flex justify-between py-2">
                <span>Pazar:</span>
                <span className="text-white font-semibold">09:00 - 20:00</span>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              <p className="font-bold mb-1">Mevcut Üyemiz misiniz?</p>
              <p className="text-slate-400 text-[11px] mb-3">
                Size verilen müşteri kodu ile mobil uygulamaya giriş yaparak antrenman ve diyet listenize erişebilirsiniz.
              </p>
              <NextLink
                href="/activate-code"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:underline"
              >
                <span>Müşteri Kodu ile Giriş Yap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (No GymOS or SaaS branding) */}
      <footer className="border-t border-slate-800/80 bg-[#05080e] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-300">{gym.name}</span>
          </div>
          <p>© 2026 {gym.name}. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
