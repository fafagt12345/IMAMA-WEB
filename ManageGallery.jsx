import React, { useState } from 'react';
import { db } from './config';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFetch } from './hooks/useFetch';
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react';

const ManageGallery = () => {
  const { data: images = [], loading: fetchLoading } = useFetch('gallery');
  const [caption, setCaption] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Pilih foto terlebih dahulu");
    setLoading(true);

    try {
      const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      const formData = new FormData();
      formData.append('file', photo);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await res.json();

      await addDoc(collection(db, 'gallery'), {
        caption,
        url: uploadData.secure_url,
        createdAt: serverTimestamp()
      });

      setCaption('');
      setPhoto(null);
      e.target.reset();
    } catch (err) {
      alert("Gagal mengunggah: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus foto ini dari galeri?")) {
      await deleteDoc(doc(db, 'gallery', id));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-2">
          <ImageIcon /> Kelola Galeri
        </h1>

        <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 border border-gray-100">
          <input type="text" placeholder="Keterangan Foto / Caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" required />
          <div className="flex items-center gap-4">
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" required />
            <button type="submit" disabled={loading} className="bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800 disabled:opacity-50">
              <Upload size={18} /> {loading ? 'Mengunggah...' : 'Upload Foto'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="relative group overflow-hidden rounded-2xl shadow-md bg-white border border-gray-100 aspect-square">
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white text-xs mb-3 line-clamp-2">{img.caption}</p>
                <button onClick={() => handleDelete(img.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageGallery;