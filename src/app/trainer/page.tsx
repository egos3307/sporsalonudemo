'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Users,
  Dumbbell,
  Utensils,
  Activity,
  ChevronRight,
  Plus,
  Flame,
  Calendar,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle2,
  Send,
  UserPlus,
  BarChart3,
  TrendingUp,
  Star,
  Check,
} from 'lucide-react';

export default function TrainerDashboardPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Quick message modal state
  const [activeReplyUser, setActiveReplyUser] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    fetch('/api/members')
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSendReply = (name: string) => {
    if (!replyText.trim()) return;
    showToast(`"${name}" danışanına yanıt iletildi! 💬`);
    setActiveReplyUser(null);
    setReplyText('');
  };

  const todaySessions = [
    {
      id: 's-1',
      time: '10:00',
      client: 'Selin Demir',
      type: 'Kişisel Antrenman',
      status: 'COMPLETED',
      statusLabel: 'Tamamlandı',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 's-2',
      time: '11:00',
      client: 'Emre Kaya',
      type: 'Kişisel Antrenman',
      status: 'IN_PROGRESS',
      statusLabel: 'Devam Ediyor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 's-3',
      time: '13:00',
      client: 'Ayşe Yılmaz',
      type: 'Kişisel Antrenman',
      status: 'PENDING',
      statusLabel: 'Bekliyor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 's-4',
      time: '15:00',
      client: 'HIIT Grup Dersi (12 Kişi)',
      type: 'Stüdyo A',
      status: 'PENDING',
      statusLabel: 'Bekliyor',
      avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const recentMessages = [
    {
      id: 'm-1',
      name: 'Selin Demir',
      text: 'Hocam yarınki ders saatini 11:00 yerine 12:00 yapabilir miyiz?',
      time: '10:24',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'm-2',
      name: 'Emre Kaya',
      text: 'Teşekkürler, yeni yazdığınız sırt programı harika hissettirdi!',
      time: '09:18',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'm-3',
      name: 'Ayşe Yılmaz',
      text: 'Beslenme programındaki ara öğün badem miktarını artırabilir miyim?',
      time: 'Dün',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'm-4',
      name: 'Kerem Şahin',
      text: 'Hocam 4. haftam bitti, yeni vücut ölçümlerimi sisteme girdim.',
      time: 'Dün',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Quick Reply Modal */}
      {activeReplyUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>{activeReplyUser} - Yanıt Gönder</span>
            </h3>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setActiveReplyUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
              >
                İptal
              </button>
              <button
                onClick={() => handleSendReply(activeReplyUser)}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gönder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Title & Subtitle matching A9FC36A2-821E-4A07-B9DC-798CD53056AD.png (Bottom-Left) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Antrenör Paneli
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
              Canlı Takip
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Danışanlarını takip et, programlarını yönet.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <NextLink
            href="/admin/workouts"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Yeni Program Yaz</span>
          </NextLink>
        </div>
      </div>

      {/* 4 KPI Cards matching screenshot: 24 Toplam Danışan, 6 Bugünkü Ders, 18 Aktif Program, %92 Danışan Memnuniyeti */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Toplam Danışan */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {members.length > 0 ? members.length + 18 : 24}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Toplam Danışan</div>
          </div>
        </div>

        {/* Bugünkü Ders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">6</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Bugünkü Ders</div>
          </div>
        </div>

        {/* Aktif Program */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition flex-shrink-0">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">18</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Aktif Program</div>
          </div>
        </div>

        {/* Danışan Memnuniyeti */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition flex-shrink-0">
            <Star className="w-6 h-6 fill-emerald-500/20" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">%92</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Danışan Memnuniyeti</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Bugünkü Program & Son Mesajlar matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Bugünkü Program */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Bugünkü Program</h3>
                  <p className="text-[11px] text-slate-500">Randevulu danışan seansları</p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Tümünü Gör →
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={session.avatar}
                      alt={session.client}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {session.client}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {session.time} • {session.type}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold ${
                      session.status === 'COMPLETED'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : session.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {session.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Son Mesajlar / Danışan Talepleri */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Son Mesajlar</h3>
                  <p className="text-[11px] text-slate-500">Danışanların antrenör geri bildirimleri</p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Tüm Mesajlar →
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setActiveReplyUser(msg.name)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={msg.avatar}
                      alt={msg.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {msg.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {msg.text}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg whitespace-nowrap">
                    Yanıtla
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Danışan İlerlemesi & Hızlı İşlemler matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danışan İlerlemesi */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Danışan İlerlemesi & Performans
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">Tüm Raporlar →</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Ort. Kas Kazanımı</span>
              <p className="text-xl font-black text-emerald-500 mt-1">+%10.4</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Son 30 günde</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Ort. Yağ Kaybı</span>
              <p className="text-xl font-black text-blue-500 mt-1">-%8.2</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Hedef odaklı</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Tamamlanan Seans</span>
              <p className="text-xl font-black text-purple-500 mt-1">142</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Bu ay</p>
            </div>
          </div>
        </div>

        {/* Hızlı İşlemler matching screenshot */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Hızlı İşlemler
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            <NextLink
              href="/admin/workouts"
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 text-center transition group"
            >
              <Dumbbell className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Yeni Program</span>
            </NextLink>

            <NextLink
              href="/admin/diets"
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 text-center transition group"
            >
              <Utensils className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Diyet Yaz</span>
            </NextLink>

            <NextLink
              href="/admin/members"
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 text-center transition group"
            >
              <UserPlus className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Danışan Ekle</span>
            </NextLink>

            <button
              onClick={() => showToast('Grup duyurusu mesaj gönderme paneli açıldı.')}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 text-center transition group"
            >
              <Send className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Mesaj Gönder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
