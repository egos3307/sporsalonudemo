'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Dumbbell, QrCode, ArrowRight, CheckCircle2, Lock, Building2, AlertCircle } from 'lucide-react';

export default function ActivateCodePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState('GYM-A7K92X'); // Default with demo code for convenience
  const [gymData, setGymData] = useState<any>(null);
  const [memberData, setMemberData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Kod doğrulanamadı.');
      }

      setGymData(data.gym);
      setMemberData(data.member);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Kod doğrulanamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/activate-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Aktivasyon yapılamadı.');
      }

      window.location.href = data.redirectUrl || '/member';
    } catch (err: any) {
      setError(err.message || 'Hesap aktifleştirilemedi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 sm:px-8 text-slate-100 font-sans relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <NextLink href="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">FitPulse</span>
        </NextLink>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {step === 1 ? 'Müşteri Kodunuzu Girin' : 'Hoş Geldiniz!'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {step === 1
            ? 'Spor salonunuz tarafından size verilen aktivasyon kodu ile bağlanın'
            : `${gymData?.name} kulübüne erişim için şifrenizi belirleyin`}
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

          {step === 1 ? (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Müşteri Kodu (Örn: GYM-A7K92X)
                </label>
                <div className="relative">
                  <QrCode className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="GYM-XXXXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono tracking-wider font-bold text-blue-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-500">Örnek hazır kodlar:</span>
                  <button
                    type="button"
                    onClick={() => setCode('GYM-A7K92X')}
                    className="text-[10px] text-blue-400 hover:underline font-mono"
                  >
                    GYM-A7K92X (Caner)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCode('GYM-B3M81Y')}
                    className="text-[10px] text-blue-400 hover:underline font-mono"
                  >
                    GYM-B3M81Y (Zeynep)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:scale-[1.01] disabled:opacity-50"
              >
                <span>{loading ? 'Doğrulanıyor...' : 'Kodu Doğrula ve Devam Et'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Gym & Member Welcome Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 text-white font-bold"
                  style={{ backgroundColor: gymData?.primaryColor || '#2563eb' }}
                >
                  {gymData?.logo ? (
                    <img src={gymData.logo} alt={gymData.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    ✓ Salon Eşleşti
                  </span>
                  <h3 className="font-bold text-sm text-white truncate">{gymData?.name}</h3>
                  <p className="text-xs text-slate-300">
                    Merhaba, <strong className="text-white">{memberData?.firstName} {memberData?.lastName}</strong>!
                  </p>
                </div>
              </div>

              <form onSubmit={handleActivateAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mobil Giriş Şifrenizi Belirleyin
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="En az 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Şifreyi doğrulayın"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.01] disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Hesap Açılıyor...' : 'Hesabı Başlat ve Giriş Yap'}</span>
                </button>
              </form>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-400">
            <NextLink href="/login" className="text-blue-400 hover:underline">
              Zaten şifreniz var mı? Giriş Yapın
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
