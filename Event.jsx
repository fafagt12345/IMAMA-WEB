import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from './config';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events_contests'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const upcoming = useMemo(() => events.filter((item) => String(item.status || '').toLowerCase() !== 'selesai'), [events]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fffb_0%,#ffffff_45%,#f8fafc_100%)] pt-28 pb-16 text-slate-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 lg:px-8">
        <div className="rounded-[32px] border border-emerald-100 bg-white/90 p-8 shadow-xl shadow-emerald-100/70 backdrop-blur md:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Event & Lomba</p>
          <h1 className="mt-3 text-3xl font-black text-emerald-950 md:text-5xl">Agenda utama IMAMA UNESA</h1>
          <p className="mt-4 max-w-3xl text-slate-600 md:text-lg">
            Lihat event, lomba, dan kegiatan yang sedang berlangsung atau sedang menunggu peserta. Informasi ini membantu pengunjung mengenal aktivitas IMAMA UNESA secara lebih mudah.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-emerald-800">
            <span className="rounded-full bg-emerald-50 px-3 py-2 font-semibold">{events.length} total agenda</span>
            <span className="rounded-full bg-emerald-50 px-3 py-2 font-semibold">{upcoming.length} aktif / upcoming</span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">Memuat agenda event …</div>
        ) : events.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm">
            Belum ada agenda event atau lomba yang dipublikasikan.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-100 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-emerald-100/80">
                <div className="h-52 w-full bg-slate-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-white text-sm text-emerald-700">Tidak ada gambar</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-emerald-600">{String(item.type || 'event').toUpperCase()}</p>
                      <h2 className="mt-2 text-xl font-bold text-slate-900">{item.title}</h2>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${String(item.status || '').toLowerCase() === 'selesai' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.status || 'Aktif'}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">{item.description || 'Deskripsi agenda sedang disiapkan.'}</p>

                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-emerald-600" />
                      <span>{item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal belum ditentukan'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-emerald-600" />
                      <span>{item.location || 'Lokasi akan diumumkan'}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Sparkles size={16} />
                      <span className="text-xs font-semibold uppercase tracking-[0.35em]">IMAMA UNESA</span>
                    </div>
                    <Link to={`/events/${item.id}`} className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800">Lihat detail</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Event;
