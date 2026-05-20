import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { BookOpen, Save, Plus, Trash2, Upload } from 'lucide-react';

const ManageHistory = () => {
  const [history, setHistory] = useState('');
  const [philosophy, setPhilosophy] = useState([{ title: '', desc: '' }]);
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHistory(data.history || '');
        setPhilosophy(data.philosophy || [{ title: '', desc: '' }]);
        setLogoUrl(data.logoUrl || '');
      }
    };
    fetchData();
  }, []);

  const handleAddPhilosophy = () => setPhilosophy([...philosophy, { title: '', desc: '' }]);
  const handleRemovePhilosophy = (index) => {
    const newPhil = philosophy.filter((_, i) => i !== index);
    setPhilosophy(newPhil.length ? newPhil : [{ title: '', desc: '' }]);
  };
  const handlePhilChange = (index, field, value) => {
    const newPhil = [...philosophy];
    newPhil[index][field] = value;
    setPhilosophy(newPhil);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setLogoUrl(data.secure_url);
      setMessage({ type: 'success', text: 'Logo berhasil diunggah!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal upload: ' + err.message });
    } finally { setUploading(false); e.target.value = null; }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateDoc(doc(db, 'settings', 'about'), {
        history,
        philosophy: philosophy.filter(p => p.title.trim() !== '' || p.desc.trim() !== ''),
        logoUrl,
        updatedAt: new Date()
      });
      setMessage({ type: 'success', text: 'Sejarah & Profil berhasil diperbarui!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan: ' + err.message });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl font-bold text-emerald-900">Kelola Sejarah & Profil</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Sejarah Organisasi</label>
            <textarea
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl h-48 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Masukkan sejarah singkat..."
              required
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Logo Organisasi</label>
            <div className="flex items-center gap-4 mb-4">
              {logoUrl && <img src={logoUrl} alt="Logo" className="w-24 h-24 object-contain rounded-xl border p-2" />}
              <input type="file" onChange={handleLogoUpload} className="text-sm" disabled={uploading} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Filosofi Logo</label>
            <div className="space-y-4">
              {philosophy.map((p, index) => (
                <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-2">
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => handlePhilChange(index, 'title', e.target.value)}
                    className="w-full p-3 border rounded-xl"
                    placeholder="Judul Filosofi"
                    required
                  />
                  <textarea
                    value={p.desc}
                    onChange={(e) => handlePhilChange(index, 'desc', e.target.value)}
                    className="w-full p-3 border rounded-xl h-24"
                    placeholder="Deskripsi Filosofi"
                    required
                  />
                  <button type="button" onClick={() => handleRemovePhilosophy(index)} className="text-red-500 flex items-center gap-1 text-sm">
                    <Trash2 size={16} /> Hapus Poin
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddPhilosophy} className="mt-4 text-emerald-600 font-semibold text-sm flex items-center gap-1">
              <Plus size={16} /> Tambah Poin Filosofi
            </button>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-emerald-700 text-white font-bold py-4 rounded-2xl hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2">
            <Save size={20} /> {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageHistory;