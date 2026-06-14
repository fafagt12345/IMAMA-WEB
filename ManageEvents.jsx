import React, { useState, useEffect } from 'react';
import { db } from './config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

const ManageEvents = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '', title: '', type: 'event', description: '', date: '', status: 'aktif'
  });

  const fetchData = async () => {
    setLoading(true);
    const q = query(collection(db, 'events_contests'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'events_contests', formData.id), {
          title: formData.title,
          type: formData.type,
          description: formData.description,
          date: formData.date,
          status: formData.status
        });
      } else {
        await addDoc(collection(db, 'events_contests'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
      }
      setFormData({ id: '', title: '', type: 'event', description: '', date: '', status: 'aktif' });
      setIsEditing(false);
      fetchData();
    } catch (error) { console.error("Error saving:", error); }
  };

  const toggleStatus = async (item) => {
    const newStatus = item.status === 'aktif' ? 'nonaktif' : 'aktif';
    await updateDoc(doc(db, 'events_contests', item.id), { status: newStatus });
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6">Kelola Event & Lomba</h2>
      
      {/* Form Input */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          <input 
            className="w-full p-2 border rounded" 
            placeholder="Judul" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
          />
          <select 
            className="w-full p-2 border rounded"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
          >
            <option value="event">Event</option>
            <option value="lomba">Lomba</option>
          </select>
        </div>
        <div className="space-y-4">
          <input 
            type="date" 
            className="w-full p-2 border rounded" 
            value={formData.date} 
            onChange={e => setFormData({...formData, date: e.target.value})} 
            required 
          />
          <button type="submit" className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all">
            {isEditing ? <><Edit2 size={16} /> Update</> : <><Plus size={16} /> Tambah</>}
          </button>
        </div>
        <div className="md:col-span-2">
          <textarea 
            placeholder="Deskripsi Singkat" 
            className="w-full p-2 border rounded" 
            rows="3"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>
      </form>

      {/* Daftar Item */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-emerald-100 text-emerald-900">
              <th className="p-3">Judul</th>
              <th className="p-3">Tipe</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{item.title}</td>
                <td className="p-3 capitalize">{item.type}</td>
                <td className="p-3 text-gray-600">{item.date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => toggleStatus(item)} className="text-gray-500 hover:text-emerald-600">
                    {item.status === 'aktif' ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button onClick={() => { setIsEditing(true); setFormData(item); }} className="text-blue-500 hover:text-blue-700">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={async () => { if(confirm('Hapus?')) await deleteDoc(doc(db, 'events_contests', item.id)); fetchData(); }} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEvents;