'use client';

import { useState, useEffect } from 'react';
import { Timer, X, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function RestTimerModal({
  initialSeconds = 90,
  isOpen,
  onClose,
}: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSeconds(initialSeconds);
      setIsRunning(true);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      // Play ding sound or vibrate
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  if (!isOpen) return null;

  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  const timeFormatted = `${minutes}:${remSeconds < 10 ? '0' : ''}${remSeconds}`;
  const progressPercent = Math.max(0, Math.min(100, ((initialSeconds - seconds) / initialSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-950/60 rounded-2xl text-blue-600 dark:text-blue-400 mb-2">
          <Timer className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dinlenme Süresi</h3>
        <p className="text-[11px] text-slate-500 mb-4">Bir sonraki sete hazırlan!</p>

        {/* Big Countdown Display */}
        <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={seconds === 0 ? 'text-emerald-500' : 'text-blue-600'}
              strokeDasharray={`${progressPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
              {timeFormatted}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {seconds === 0 ? 'SÜRE DOLDU!' : 'Kalan'}
            </span>
          </div>
        </div>

        {/* Quick Adjust Buttons */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => setSeconds((s) => Math.max(0, s - 15))}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
          >
            <Minus className="w-3.5 h-3.5" /> 15s
          </button>
          <button
            onClick={() => setSeconds((s) => s + 15)}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 15s
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setSeconds(initialSeconds);
              setIsRunning(true);
            }}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-2xl text-slate-600 dark:text-slate-300"
            title="Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 transition"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Duraklat' : 'Devam Et'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl"
          >
            Geç
          </button>
        </div>
      </div>
    </div>
  );
}
