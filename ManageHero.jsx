import React, { useState } from 'react';
import { db } from './config';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFetch } from './hooks/useFetch';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';

const ManageHero = () => {
  const { data: slides = [] } = useFetch('hero_slides');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Pilih foto terlebih dahulu");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', photo);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await res.json();

      await addDoc(collection(db, 'hero_slides'), {
        title,
        subtitle,
        url: uploadData.secure_url,
        createdAt: serverTimestamp()
      });

      setTitle(''); setSubtitle(''); setPhoto(null);
      e.target.reset();
    } catch (err) {
      alert("Gagal: " + err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-2">
          <ImageIcon /> Kelola Hero Banner
        </h1>

        <form onSubmit={handleAddSlide} className="bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Judul Slide" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" required />
            <input type="text" placeholder="Sub-judul" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div className="flex items-center gap-4">
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" required />
            <button type="submit" disabled={loading} className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800 disabled:opacity-50">
              <Plus size={18} /> {loading ? 'Mengunggah...' : 'Tambah Slide'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((s) => (
            <div key={s.id} className="relative group overflow-hidden rounded-2xl shadow-md bg-white border border-gray-100">
              <img src={s.url} alt="" className="w-full h-48 object-cover opacity-80" />
              <div className="p-4">
                <h3 className="font-bold text-emerald-900">{s.title}</h3>
                <p className="text-gray-500 text-sm truncate">{s.subtitle}</p>
                <button onClick={() => confirm("Hapus slide?") && deleteDoc(doc(db, 'hero_slides', s.id))} className="mt-3 text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-bold">
                  <Trash2 size={16} /> Hapus Slide
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageHero;