'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Dumbbell, Mail, Lock, ArrowRight, AlertCircle, Sparkles, QrCode, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Giriş yapılamadı.');
      }

      window.location.href = data.redirectUrl || '/admin';
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız.');
      setLoading(false);
    }
  };

  const handleDemoClick = async (role: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo girişi başarısız.');
      window.location.href = data.redirectUrl || '/admin';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 sm:px-8 text-slate-100 font-sans relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <NextLink href="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Dumbbell className="w-5 h-5 text-black" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">GymOS</span>
        </NextLink>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Hesabınıza Giriş Yapın
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Salon yöneticisi, antrenör veya müşteri hesabınızla devam edin
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@fitzone.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Şifre
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts Drawer */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tek Tıkla Demo Girişi (İnceleme İçin):</span>
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                className="p-2 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white transition group"
              >
                <p className="text-[11px] font-bold group-hover:text-blue-400">Süper Admin / Yönetici</p>
                <p className="text-[10px] text-slate-500">FitZone & B2B Lead Avcısı</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('trainer')}
                className="p-2 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition group"
              >
                <p className="text-[11px] font-bold group-hover:text-indigo-400">Antrenör</p>
                <p className="text-[10px] text-slate-500">Murat Kaya</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('member')}
                className="p-2 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white transition group"
              >
                <p className="text-[11px] font-bold group-hover:text-emerald-400">Müşteri / Üye</p>
                <p className="text-[10px] text-slate-500">Caner Erkin</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('expired_admin')}
                className="p-2 text-left rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-slate-300 hover:text-white transition group"
                title="7 günlük süresi dolmuş salon paywall denemesi"
              >
                <p className="text-[11px] font-bold text-rose-400">Süresi Dolan Gym</p>
                <p className="text-[10px] text-slate-500">Apex Studio (Deniz)</p>
              </button>
            </div>
          </div>

          {/* Member Code Activation Link */}
          <div className="mt-5 p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[11px] font-bold text-white">Spor Salonu Üyesi misiniz?</p>
                <p className="text-[10px] text-slate-400">Salondan aldığınız kodla ilk kez bağlanın</p>
              </div>
            </div>
            <NextLink
              href="/activate-code"
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg transition"
            >
              Kodu Gir
            </NextLink>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Spor salonunuz yok mu?{' '}
            <NextLink href="/register" className="text-blue-400 hover:underline font-semibold">
              7 Gün Ücretsiz Deneyin
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
