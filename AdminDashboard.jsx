import React, { useEffect, useMemo, useState } from 'react';
import { db } from './config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import {
  Activity,
  Building2,
  CalendarDays,
  Clock3,
  Crown,
  Layers3,
  Sparkles,
  Trophy,
  Users2,
  Zap,
} from 'lucide-react';

const formatDate = (value) => {
  if (!value) return 'Belum ada data';
  const date = typeof value === 'number' ? new Date(value) : value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [heroMeta, setHeroMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubEvents = onSnapshot(query(collection(db, 'events_contests'), orderBy('createdAt', 'desc')), (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubDepartments = onSnapshot(collection(db, 'departments'), (snapshot) => {
      setDepartments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      setSubDepartments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubHero = onSnapshot(collection(db, 'settings'), (snapshot) => {
      const heroDoc = snapshot.docs.find((doc) => doc.id === 'hero');
      setHeroMeta(heroDoc ? { id: heroDoc.id, ...heroDoc.data() } : null);
    });

    setLoading(false);

    return () => {
      unsubEvents();
      unsubDepartments();
      unsubMembers();
      unsubHero();
    };
  }, []);

  const stats = useMemo(() => {
    const totalEvents = events.length;
    const totalLomba = events.filter((item) => String(item.type || '').toLowerCase() === 'lomba').length;
    return {
      totalDepartments: departments.length,
      totalSubDepartments: subDepartments.length,
      totalEvents,
      totalLomba,
    };
  }, [departments.length, events, subDepartments.length]);

  const latestEvent = events[0] || null;
  const latestLomba = events.find((item) => String(item.type || '').toLowerCase() === 'lomba') || null;

  const activityItems = [
    {
      title: 'Event terakhir',
      detail: latestEvent ? `${latestEvent.title} • ${latestEvent.status || 'aktif'}` : 'Belum ada event ditambahkan',
      accent: 'from-emerald-500 to-green-500',
      icon: <CalendarDays size={18} />,
      meta: latestEvent ? formatDate(latestEvent.createdAt || latestEvent.updatedAt) : '—',
    },
    {
      title: 'Lomba terakhir',
      detail: latestLomba ? `${latestLomba.title} • ${latestLomba.status || 'aktif'}` : 'Belum ada lomba ditambahkan',
      accent: 'from-amber-500 to-orange-500',
      icon: <Trophy size={18} />,
      meta: latestLomba ? formatDate(latestLomba.createdAt || latestLomba.updatedAt) : '—',
    },
    {
      title: 'Hero Banner terakhir',
      detail: heroMeta?.lastModifiedBy ? `Diedit oleh ${heroMeta.lastModifiedBy}` : 'Belum ada perubahan hero banner',
      accent: 'from-sky-500 to-cyan-500',
      icon: <Sparkles size={18} />,
      meta: heroMeta?.lastModified ? formatDate(heroMeta.lastModified) : '—',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Admin Dashboard</p>
          <h1 className="text-3xl font-bold text-emerald-950">Ringkasan dan monitoring real-time</h1>
          <p className="text-sm text-slate-500">Statistik, aktivitas, dan panel kontrol terhubung langsung ke database.</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 text-sm text-slate-500 shadow-sm">Status database: <span className="font-semibold text-emerald-700">Online</span></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Departemen', value: stats.totalDepartments, icon: <Building2 size={22} />, tone: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700' },
          { label: 'Total Sub Departemen', value: stats.totalSubDepartments, icon: <Users2 size={22} />, tone: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50 text-sky-700', text: 'text-sky-700' },
          { label: 'Total Event', value: stats.totalEvents, icon: <CalendarDays size={22} />, tone: 'from-violet-500 to-fuchsia-500', bg: 'bg-violet-50 text-violet-700', text: 'text-violet-700' },
          { label: 'Total Lomba', value: stats.totalLomba, icon: <Trophy size={22} />, tone: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 text-amber-700', text: 'text-amber-700' },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{loading ? '—' : item.value}</p>
              </div>
              <div className={`rounded-2xl p-3 ${item.bg}`}>
                {item.icon}
              </div>
            </div>
            <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${item.tone}`} />
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Monitoring Aktivitas</p>
              <h2 className="text-xl font-bold text-slate-900">Aktivitas terbaru</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><Clock3 size={14} /> Terbaru</div>
          </div>
          <div className="space-y-4">
            {activityItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/60">
                <div className="flex items-start gap-3">
                  <div className={`rounded-xl bg-gradient-to-br ${item.accent} p-2 text-white shadow-sm`}>{item.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                    <p className="mt-2 text-xs text-slate-500">{item.meta}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Status Sistem</p>
              <h2 className="text-xl font-bold text-slate-900">Ringkasan cepat</h2>
            </div>
            <Activity className="text-emerald-600" size={18} />
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Database</p>
              <p className="text-lg font-semibold text-emerald-950">Realtime Sync Aktif</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <p className="text-sm text-sky-700">Admin</p>
              <p className="text-lg font-semibold text-sky-950">Akses aman & mudah dikelola</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm text-violet-700">Hero Banner</p>
              <p className="text-lg font-semibold text-violet-950">Preview real-time & pengaturan lengkap</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm text-amber-700">Event & Lomba</p>
              <p className="text-lg font-semibold text-amber-950">Search, filter, dan status aktif/nonaktif</p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-100">Tips admin</p>
            <h3 className="text-xl font-semibold">Dashboard yang lebih modern dan siap untuk monitoring konten</h3>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-emerald-50">Gunakan menu di sisi kiri untuk mengelola event, hero, departemen, dan struktur organisasi.</div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;