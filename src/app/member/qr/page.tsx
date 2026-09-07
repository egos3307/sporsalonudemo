'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Clock, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';
import { formatDateTimeTr, formatTimeOnly } from '@/lib/utils';

export default function MemberQRPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Live clock update
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    return () => clearInterval(timer);
  }, []);

  const member = data?.member;
  const branding = data?.gymBranding || {};
  const code = member?.memberCode || 'GYM-A7K92X';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="text-center py-16 animate-pulse">
        <div className="w-56 h-56 bg-slate-100 dark:bg-slate-800 rounded-3xl mx-auto mb-4"></div>
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-xl w-40 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-center">
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
          Turnike Geçiş QR Kartı
        </h2>
        <p className="text-xs text-slate-500">
          Kapıdaki okuyucuya veya danışma kamerasına tutun
        </p>
      </div>

      {/* Main High-Contrast QR Pass Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl max-w-xs mx-auto">
        {/* Gym Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="text-left">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
              {branding.name || 'FitZone Club'}
            </h3>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              ● Üyelik Aktif
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {currentTime}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center mx-auto mb-4 w-56 h-56">
          <QRCodeSVG
            value={code}
            size={190}
            level="H"
            includeMargin={true}
            fgColor="#0f172a"
          />
        </div>

        {/* Code & Copy Button */}
        <div className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
          <span className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
            {code}
          </span>
          <button
            onClick={handleCopyCode}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Kodu Kopyala"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-4">
          QR okuyucu çalışmazsa yukarıdaki 9 haneli kodu görevliye iletebilirsiniz.
        </p>
      </div>

      {/* Past Visits List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left max-w-sm mx-auto">
        <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Son Salon Girişleriniz</span>
        </h3>

        <div className="space-y-2">
          {(member?.checkIns || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">Henüz giriş kaydı bulunmuyor.</p>
          ) : (
            (member.checkIns || []).map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDateTimeTr(c.checkInTime)}
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Turnike QR Geçişi
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Giriş ✓
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
