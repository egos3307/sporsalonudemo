'use client';

import { useState, useEffect } from 'react';
import {
  QrCode,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  LogOut,
  LogIn,
  Search,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { formatDateTimeTr, formatTimeOnly } from '@/lib/utils';

export default function CheckInStationPage() {
  const [activeCount, setActiveCount] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [currentlyInside, setCurrentlyInside] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<any>(null);

  const fetchCheckInData = async () => {
    try {
      const res = await fetch('/api/check-in');
      const data = await res.json();
      if (data.success) {
        setActiveCount(data.activeCount);
        setTodayTotal(data.todayTotal);
        setCurrentlyInside(data.currentlyInside || []);
        setRecentLogs(data.recentLogs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCheckInData();
    const interval = setInterval(fetchCheckInData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleProcessScan = async (codeToUse?: string) => {
    const code = (codeToUse || inputCode).trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setLastAction(null);

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberCode: code, method: 'QR_CODE' }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLastAction({ error: data.error || 'İşlem başarısız.' });
      } else {
        setLastAction(data);
        setInputCode('');
        fetchCheckInData();
      }
    } catch (e: any) {
      setLastAction({ error: e.message || 'Sunucu hatası oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Turnike & QR Giriş İstasyonu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Resepsiyon ve kapı turnikesi anlık QR okuma ekranı
          </p>
        </div>

        {/* Live In-Gym Occupancy Card */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 shadow-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              Şu Anda Salonda Aktif
            </p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight">
              {activeCount} Kişi
            </p>
          </div>
          <div className="pl-4 border-l border-emerald-200 dark:border-emerald-800 text-right">
            <p className="text-[10px] text-slate-400">Bugün Toplam</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{todayTotal} Giriş</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Terminal (Left 1 col) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>QR Okuyucu Simülasyonu</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Hazır
              </span>
            </div>

            {/* Visual Viewfinder */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 overflow-hidden mb-5">
              {/* Laser line effect */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-bounce opacity-80" />
              <QrCode className="w-16 h-16 text-slate-600 animate-pulse" />
              <p className="text-[11px] text-slate-400 mt-2 font-medium">QR Kodu Kameraya Tutun</p>
            </div>

            {/* Manual Code Input */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Müşteri Kodunu Manuel Gir / Okut
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="GYM-XXXXXX"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleProcessScan()}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleProcessScan()}
                  disabled={loading || !inputCode}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
                >
                  {loading ? '...' : 'İşle'}
                </button>
              </div>

              {/* Quick Sample Code Buttons */}
              <div className="pt-2">
                <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Hızlı Test Kodları:</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleProcessScan('GYM-A7K92X')}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded-lg"
                  >
                    Caner (GYM-A7K92X)
                  </button>
                  <button
                    onClick={() => handleProcessScan('GYM-B3M81Y')}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded-lg"
                  >
                    Zeynep (GYM-B3M81Y)
                  </button>
                  <button
                    onClick={() => handleProcessScan('GYM-D1R55W')}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded-lg"
                  >
                    Elif (GYM-D1R55W)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scan Result Feedback Card */}
          {lastAction && (
            <div
              className={`mt-4 p-4 rounded-2xl border animate-in fade-in duration-200 ${
                lastAction.error
                  ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
                  : lastAction.action === 'CHECK_IN'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200'
              }`}
            >
              {lastAction.error ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-xs font-semibold">{lastAction.error}</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold flex items-center gap-1.5">
                      {lastAction.action === 'CHECK_IN' ? (
                        <>
                          <LogIn className="w-4 h-4 text-emerald-600" />
                          GİRİŞ ONAYLANDI ✓
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 text-amber-600" />
                          ÇIKIŞ YAPILDI ✓
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono font-bold">
                      {new Date().toLocaleTimeString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {lastAction.member.firstName} {lastAction.member.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Kod: <span className="font-mono font-bold">{lastAction.member.memberCode}</span>
                  </p>
                  {lastAction.member.isExpired && (
                    <p className="text-[11px] font-bold text-red-600 mt-1">
                      ⚠️ DİKKAT: Üyenin abonelik süresi dolmuş!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Currently Inside & Recent Check-in Logs (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currently Inside Active Members List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Şu Anda Salonda Olanlar ({currentlyInside.length})
                </h3>
                <p className="text-xs text-slate-500">Çıkış yapmamış aktif sporcular</p>
              </div>
              <button
                onClick={fetchCheckInData}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Yenile"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
              {currentlyInside.length === 0 ? (
                <p className="col-span-2 text-center py-6 text-xs text-slate-400">
                  Şu anda salonda kayıtlı kimse bulunmuyor.
                </p>
              ) : (
                currentlyInside.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {c.member?.firstName} {c.member?.lastName}
                      </p>
                      <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                        {c.member?.memberCode}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Giriş: {formatTimeOnly(c.checkInTime)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleProcessScan(c.member?.memberCode)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-900/50 rounded-xl transition"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Past 20 Check-In History Log */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-subtle">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Son Turnike Geçiş Kayıtları
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Üye</th>
                    <th className="px-4 py-2.5">Müşteri Kodu</th>
                    <th className="px-4 py-2.5">Giriş Saati</th>
                    <th className="px-4 py-2.5">Çıkış Saati</th>
                    <th className="px-4 py-2.5">Yöntem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                        {log.member?.firstName} {log.member?.lastName}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                        {log.member?.memberCode}
                      </td>
                      <td className="px-4 py-2.5">
                        {formatDateTimeTr(log.checkInTime)}
                      </td>
                      <td className="px-4 py-2.5">
                        {log.checkOutTime ? (
                          formatTimeOnly(log.checkOutTime)
                        ) : (
                          <span className="text-emerald-500 font-bold">Hala Salonda</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {log.method}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
