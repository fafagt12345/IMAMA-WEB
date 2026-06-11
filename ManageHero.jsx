import React, { useState, useEffect } from 'react';
import { db } from './config';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Image as ImageIcon, Plus, Trash2, Edit2, X } from 'lucide-react';

const ManageHero = () => {
  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [blurLevel, setBlurLevel] = useState(0);
  const [titleFont, setTitleFont] = useState('font-sans');
  const [titleItalic, setTitleItalic] = useState(false);
  const [subtitleFont, setSubtitleFont] = useState('font-serif');
  const [subtitleItalic, setSubtitleItalic] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSlides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAddOrUpdateSlide = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = currentPhotoUrl;
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

      const slideData = {
        title, subtitle, blurLevel, imageUrl, 
        titleFont,
        titleItalic,
        subtitleFont,
        subtitleItalic,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'hero_slides', editingId), slideData);
        alert("Slide diperbarui!");
      } else {
        await addDoc(collection(db, 'hero_slides'), { ...slideData, createdAt: serverTimestamp() });
        alert("Slide ditambahkan!");
      }
      resetForm();
    } catch (err) {
      alert("Gagal: " + err.message);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus slide ini?")) {
      try {
        await deleteDoc(doc(db, 'hero_slides', id));
      } catch (err) {
        alert("Gagal menghapus: " + err.message);
      }
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setBlurLevel(slide.blurLevel);
    setTitleFont(slide.titleFont || 'font-sans');
    setTitleItalic(slide.titleItalic || false);
    setSubtitleFont(slide.subtitleFont || 'font-serif');
    setSubtitleItalic(slide.subtitleItalic || false);
    setCurrentPhotoUrl(slide.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTitle(''); setSubtitle(''); setBlurLevel(0); setPhoto(null);
    setTitleFont('font-sans'); setTitleItalic(false);
    setSubtitleFont('font-serif'); setSubtitleItalic(false);
    setEditingId(null); setCurrentPhotoUrl('');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2"><ImageIcon /> Kelola Hero Banner</div>
          {editingId && (
            <button onClick={resetForm} className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2">
              <X size={16} /> Batal Edit
            </button>
          )}
        </h1>

        <form onSubmit={handleAddOrUpdateSlide} className="bg-white p-6 rounded-2xl shadow-sm mb-12 space-y-6 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Judul Section */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">Konfigurasi Judul</label>
              <input 
                type="text" 
                placeholder="Judul Slide" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${titleFont} ${titleItalic ? 'italic' : ''}`} 
                required 
              />
              <div className="flex gap-2">
                <select 
                  value={titleFont} 
                  onChange={(e) => setTitleFont(e.target.value)}
                  className="text-xs p-2 bg-white border rounded-lg outline-none cursor-pointer"
                >
                  <option value="font-sans">Sans (Bersih)</option>
                  <option value="font-serif">Serif (Klasik)</option>
                  <option value="font-mono">Mono (Kode)</option>
                </select>
                <button 
                  type="button"
                  onClick={() => setTitleItalic(!titleItalic)}
                  className={`text-xs px-3 py-2 rounded-lg border transition-colors ${titleItalic ? 'bg-emerald-100 border-emerald-500 text-emerald-700 font-bold' : 'bg-white text-gray-500'}`}
                >
                  <i>I</i> Miring
                </button>
              </div>
            </div>

            {/* Sub-judul Section */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">Konfigurasi Sub-judul</label>
              <input 
                type="text" 
                placeholder="Sub-judul" 
                value={subtitle} 
                onChange={(e) => setSubtitle(e.target.value)} 
                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${subtitleFont} ${subtitleItalic ? 'italic' : ''}`} 
                required 
              />
              <div className="flex gap-2">
                <select 
                  value={subtitleFont} 
                  onChange={(e) => setSubtitleFont(e.target.value)}
                  className="text-xs p-2 bg-white border rounded-lg outline-none cursor-pointer"
                >
                  <option value="font-sans">Sans (Bersih)</option>
                  <option value="font-serif">Serif (Klasik)</option>
                  <option value="font-mono">Mono (Kode)</option>
                </select>
                <button 
                  type="button"
                  onClick={() => setSubtitleItalic(!subtitleItalic)}
                  className={`text-xs px-3 py-2 rounded-lg border transition-colors ${subtitleItalic ? 'bg-emerald-100 border-emerald-500 text-emerald-700 font-bold' : 'bg-white text-gray-500'}`}
                >
                  <i>I</i> Miring
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Tingkat Blur Latar (0-10)</label>
              <input type="number" value={blurLevel} onChange={(e) => setBlurLevel(Math.max(0, Math.min(10, Number(e.target.value))))} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" min="0" max="10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Foto Latar</label>
              <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" required={!editingId} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 shadow-lg shadow-emerald-700/20 disabled:opacity-50 transition-all">
              {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
              {loading ? 'Memproses...' : editingId ? 'Simpan Perubahan' : 'Tambah Slide'}
          </button>
        </form>

        {/* Daftar Slide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => handleEdit(slide)} className="p-2 bg-white/90 text-blue-600 rounded-lg shadow hover:bg-white">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(slide.id)} className="p-2 bg-white/90 text-red-600 rounded-lg shadow hover:bg-white">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className={`font-bold text-emerald-900 ${slide.titleFont} ${slide.titleItalic ? 'italic' : ''}`}>{slide.title}</h3>
                <p className={`text-sm text-gray-600 ${slide.subtitleFont} ${slide.subtitleItalic ? 'italic' : ''}`}>{slide.subtitle}</p>
                <div className="mt-2 text-[10px] text-gray-400 uppercase tracking-widest">Blur: {slide.blurLevel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageHero;
