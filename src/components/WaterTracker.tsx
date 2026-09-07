'use client';

import { useState } from 'react';
import { Droplets, Plus } from 'lucide-react';

export default function WaterTracker({ targetWater = 3000 }: { targetWater?: number }) {
  const [currentWater, setCurrentWater] = useState(1750);

  const addWater = (amount: number) => {
    setCurrentWater((prev) => Math.min(targetWater * 1.5, prev + amount));
  };

  const percent = Math.min(100, Math.round((currentWater / targetWater) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Günlük Su Takibi</h3>
            <p className="text-[11px] text-slate-500">Hedef: {targetWater} ml</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
            {currentWater} <span className="text-[10px] font-medium text-slate-400">ml</span>
          </span>
          <span className="block text-[10px] font-semibold text-slate-400">%{percent} Tamamlandı</span>
        </div>
      </div>

      {/* Progress Bar with Water Wave feeling */}
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 relative">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Quick Add Buttons */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => addWater(250)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs rounded-xl transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+250 ml (1 Bardak)</span>
        </button>
        <button
          onClick={() => addWater(500)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs rounded-xl transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+500 ml (1 Matara)</span>
        </button>
      </div>
    </div>
  );
}
