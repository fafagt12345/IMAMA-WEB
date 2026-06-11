import React, { useState } from 'react';
import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Image as ImageIcon, Plus } from 'lucide-react';

const ManageHero = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [blurLevel, setBlurLevel] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddSlide = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (photo) {
        const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append('file', photo);
        formData.append('upload_preset', UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      await addDoc(collection(db, 'hero_slides'), {
        title, subtitle, blurLevel, imageUrl, createdAt: serverTimestamp()
      });

      setTitle(''); setSubtitle(''); setBlurLevel(0); setPhoto(null);
      alert("Slide berhasil ditambahkan!");
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
            <input type="text" placeholder="Sub-judul" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 italic font-serif" required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="number" placeholder="Tingkat Blur (0-10)" value={blurLevel} onChange={(e) => setBlurLevel(Math.max(0, Math.min(10, Number(e.target.value))))} className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" min="0" max="10" />
            {/* Preview Blur (opsional, bisa ditambahkan jika ingin ada preview langsung) */}
            <div className="flex items-center text-gray-600 text-sm">
              *Atur 0 untuk tanpa blur.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" required />
            <button type="submit" disabled={loading} className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800 disabled:opacity-50">
              <Plus size={18} /> {loading ? 'Mengunggah...' : 'Tambah Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageHero;
