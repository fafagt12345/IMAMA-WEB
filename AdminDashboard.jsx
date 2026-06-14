import React, { useState, useEffect } from 'react';
import { db } from './config';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { Clock, Activity, Tag, Zap } from 'lucide-react';

const AdminDashboard = () => {
  const [activities, setActivities] = useState({
    events: [],
    lastHero: null,
    stats: { totalEvents: 0, totalNews: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      // Ambil Event terakhir
      const eventQ = query(collection(db, 'events_contests'), orderBy('createdAt', 'desc'), limit(3));
      const eventSnap = await getDocs(eventQ);
      
      // Ambil metadata Hero
      const heroSnap = await getDoc(doc(db, 'settings', 'hero'));
      
      setActivities({
        events: eventSnap.docs.map(d => d.data()),
        lastHero: heroSnap.exists() ? heroSnap.data().lastModified : null,
        stats: { totalEvents: eventSnap.size }
      });
      setLoading(false);
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-emerald-900">Ringkasan Aktivitas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
          <div className="flex items-center gap-4 text-emerald-600 mb-2">
            <Zap size={24} /> <span className="font-semibold uppercase text-sm">Hero Banner</span>
          </div>
          <p className="text-gray-500 text-sm">Terakhir diupdate:</p>
          <p className="font-bold">{activities.lastHero ? new Date(activities.lastHero).toLocaleString() : 'Belum ada data'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center gap-4 text-blue-600 mb-2">
            <Tag size={24} /> <span className="font-semibold uppercase text-sm">Event Terbaru</span>
          </div>
          <ul className="text-sm space-y-1">
            {activities.events.map((ev, i) => (
              <li key={i} className="truncate">• {ev.title}</li>
            ))}
            {activities.events.length === 0 && <li className="text-gray-400 italic">Belum ada event</li>}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center gap-4 text-purple-600 mb-2">
            <Activity size={24} /> <span className="font-semibold uppercase text-sm">Sistem</span>
          </div>
          <div className="text-sm">
            <p>Database: <span className="text-green-600 font-bold">Online</span></p>
            <p>Auth: <span className="text-green-600 font-bold">Google & Email</span></p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-xl text-emerald-800 border border-emerald-100">
        <h3 className="font-bold mb-2 flex items-center gap-2"><Clock size={18} /> Petunjuk Admin</h3>
        <p className="text-sm">Gunakan menu di sebelah kiri untuk mengelola konten website. Perubahan pada Hero Banner akan langsung berdampak pada halaman utama pengunjung.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;