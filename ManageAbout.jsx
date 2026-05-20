import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { LayoutGrid, Save, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';

const ManageAbout = () => {
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState(['']);
  const [history, setHistory] = useState('');
  const [philosophy, setPhilosophy] = useState([{ title: '', desc: '' }]);
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVision(data.vision || ''); // Default to empty string if not found
        setMission(data.mission || ['']); // Default to array with empty string if not found
        setHistory(data.history || '');
        setPhilosophy(data.philosophy || [{ title: '', desc: '' }]); // Default to array with empty object
        setLogoUrl(data.logoUrl || '');
      }
    };
    fetchData();
  }, []);

  const handleAddMission = () => setMission([...mission, '']);

  const handleRemoveMission = (index) => {
    const newMission = mission.filter((_, i) => i !== index);
    setMission(newMission.length ? newMission : ['']);
  };

  const handleMissionChange = (index, value) => {
    const newMission = [...mission];
    newMission[index] = value;
    setMission(newMission);
  };

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
    } finally { setUploading(false); e.target.value = null; } // Clear file input
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await setDoc(doc(db, 'settings', 'about'), {
        vision,
        mission: mission.filter(m => m.trim() !== ''),
        history,
        philosophy: philosophy.filter(p => p.title.trim() !== ''),
        logoUrl,
        updatedAt: new Date()
      });
      setMessage({ type: 'success', text: 'Visi & Misi berhasil diperbarui!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan: ' + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <LayoutGrid size={24} />
          </div>
          <h1 className="text-2xl font-bold text-emerald-900">Kelola Visi & Misi</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Visi Organisasi</label>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-32"
              placeholder="Masukkan visi IMAMA UNESA..."
              required
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Misi Organisasi</label>
            <div className="space-y-3">
              {mission.map((m, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => handleMissionChange(index, e.target.value)}
                    className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder={`Misi ke-${index + 1}`}
                    required
                  />
                  <button type="button" onClick={() => handleRemoveMission(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    Hapus
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddMission} className="mt-4 text-emerald-600 font-semibold text-sm hover:underline">
              + Tambah Poin Misi
            </button>
          </div>

          {/* Sejarah Organisasi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Sejarah Organisasi</label>
            <textarea
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-48"
              placeholder="Masukkan sejarah singkat IMAMA UNESA..."
              required
            />
          </div>

          {/* Logo Organisasi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Logo Organisasi</label>
            <div className="flex items-center gap-4 mb-4">
              {logoUrl && (
                <img src={logoUrl} alt="Logo Preview" className="w-24 h-24 object-contain rounded-xl border border-gray-100 p-2" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                disabled={uploading}
              />
              {uploading && <span className="text-emerald-600 text-sm">Mengunggah...</span>}
            </div>
            {logoUrl && (
              <p className="text-gray-500 text-xs">URL Logo: <a href={logoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{logoUrl}</a></p>
            )}
          </div>

          {/* Filosofi Logo */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Filosofi Logo</label>
            <div className="space-y-4">
              {philosophy.map((p, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => handlePhilChange(index, 'title', e.target.value)}
                    className="w-full p-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder={`Judul Filosofi ke-${index + 1}`}
                    required
                  />
                  <textarea
                    value={p.desc}
                    onChange={(e) => handlePhilChange(index, 'desc', e.target.value)}
                    className="w-full p-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24"
                    placeholder={`Deskripsi Filosofi ke-${index + 1}`}
                    required
                  />
                  <div className="flex justify-end">
                    <button type="button" onClick={() => handleRemovePhilosophy(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 text-sm">
                      <Trash2 size={16} /> Hapus Poin
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddPhilosophy} className="mt-4 text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1">
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

export default ManageAbout;