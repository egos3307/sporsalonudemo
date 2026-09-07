'use client';

import { useState } from 'react';
import { ShieldAlert, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function TrialExpiredBanner({
  gymName = 'Spor Salonu',
  onActivated,
}: {
  gymName?: string;
  onActivated?: () => void;
}) {
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    setActivating(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACTIVATE_SUBSCRIPTION' }),
      });
      if (res.ok) {
        if (onActivated) {
          onActivated();
        } else {
          window.location.reload();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="mb-6 p-4 md:p-6 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-2xl shadow-xl border border-red-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-base md:text-lg tracking-tight">
            Deneme süreniz sona erdi. Devam etmek için hesabınızı aktifleştirin.
          </h3>
          <p className="text-xs md:text-sm text-white/90 mt-1 max-w-2xl leading-relaxed">
            {gymName} verileriniz (üyeler, antrenmanlar, diyetler, ölçümler ve geçmiş kayıtlar) güvenle saklanmaktadır.
            Sistemi tam yetkiyle kullanmaya ve yeni üye eklemeye devam etmek için FitPulse Pro planını hemen aktifleştirin.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={handleActivate}
          disabled={activating}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-600 hover:bg-red-50 font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{activating ? 'Aktifleştiriliyor...' : 'Hesabı Şimdi Aktifleştir'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
