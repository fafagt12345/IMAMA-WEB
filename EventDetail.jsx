import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { db } from './config';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'events_contests', id), (snapshot) => {
      setEvent(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 pt-28 px-6 text-slate-500">Memuat detail event…</div>;
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 pt-28 px-6 pb-16">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Event</p>
          <h1 className="mt-3 text-3xl font-black text-emerald-950">Event tidak ditemukan</h1>
          <p className="mt-3 text-slate-600">Agenda yang Anda cari belum tersedia atau sudah dihapus.</p>
          <Link to="/events" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">Kembali ke daftar event</Link>
        </div>
      </main>
    );
  }

  const registrationUrl = event?.registrationUrl ? (/^https?:\/\//i.test(event.registrationUrl) || /^mailto:/i.test(event.registrationUrl) ? event.registrationUrl : `https://${event.registrationUrl}`) : '';

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fffb_0%,#ffffff_45%,#f7fafc_100%)] pt-28 pb-16 text-slate-900">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100 md:p-8">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            <ArrowLeft size={16} /> Kembali ke daftar
          </Link>
          <p className="mt-5 text-xs uppercase tracking-[0.35em] text-emerald-600">{String(event.type || 'event').toUpperCase()}</p>
          <h1 className="mt-3 text-3xl font-black text-emerald-950 md:text-5xl">{event.title}</h1>
          <p className="mt-4 text-slate-600 md:text-lg">{event.description || 'Deskripsi lengkap event sedang disiapkan.'}</p>

          <div className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <div className="flex items-center gap-3"><CalendarDays size={16} className="text-emerald-600" /> <span>{event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal belum ditentukan'}</span></div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-emerald-600" /> <span>{event.location || 'Lokasi akan diumumkan'}</span></div>
            <div className="flex items-center gap-3"><Sparkles size={16} className="text-emerald-600" /> <span>Status: {event.status || 'aktif'}</span></div>
          </div>

          {registrationUrl && (
            <a href={registrationUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
              Daftar / Lihat informasi lebih lanjut
            </a>
          )}
        </article>

        <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100 md:p-8">
          <div className="h-72 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-white text-sm text-emerald-700">Tidak ada gambar untuk event ini</div>
            )}
          </div>
          <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Catatan</p>
            <p className="mt-2 leading-6">Halaman ini dibuat agar setiap event atau lomba bisa dibuka secara terpisah, menampilkan detail lengkap, dan memudahkan akses pendaftaran.</p>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default EventDetail;
