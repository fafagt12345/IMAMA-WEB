import React, { useState, useEffect, useCallback } from 'react';
import { db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Plus, Trash2, BookOpen, Flag, Target, Lightbulb, Upload, Info } from 'lucide-react';

const ManageAbout = () => {
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState(['']);
  const [history, setHistory] = useState('');
  const [philosophy, setPhilosophy] = useState([{ title: '', desc: '' }]);
  const [logoUrl, setLogoUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = useCallback(async () => {
    const docRef = doc(db, 'settings', 'about');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setVision(data.vision || '');
      setMission(data.mission?.length ? data.mission : ['']);
      setHistory(data.history || '');
      setPhilosophy(data.philosophy?.length ? data.philosophy : [{ title: '', desc: '' }]);
      setLogoUrl(data.logoUrl || '');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers for Mission
  const handleAddMission = () => setMission([...mission, '']);
  const handleRemoveMission = (index) => setMission(mission.filter((_, i) => i !== index));
  const handleMissionChange = (index, value) => {
    const newMissions = [...mission];
    newMissions[index] = value;
    setMission(newMissions);
  };

  // Handlers for Philosophy
  const handleAddPhilosophy = () => setPhilosophy([...philosophy, { title: '', desc: '' }]);
  const handleRemovePhilosophy = (index) => setPhilosophy(philosophy.filter((_, i) => i !== index));
  const handlePhilChange = (index, field, value) => {
    const newPhilosophies = [...philosophy];
    newPhilosophies[index][field] = value;
    setPhilosophy(newPhilosophies);
  };

  // Handler for Logo Upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage({ type: '', text: '' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setLogoUrl(data.secure_url);
      setMessage({ type: 'success', text: 'Logo berhasil diunggah! Jangan lupa klik simpan.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal upload: ' + err.message });
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  // Main Save Handler
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await setDoc(doc(db, 'settings', 'about'), {
        vision,
        mission: mission.filter(m => m.trim() !== ''),
        history,
        philosophy: philosophy.filter(p => p.title.trim() !== '' || p.desc.trim() !== ''),
        logoUrl,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setMessage({ type: 'success', text: 'Semua informasi "Tentang" berhasil diperbarui!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan: ' + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl"><Info size={24} /></div>
          <h1 className="text-2xl font-bold text-emerald-900">Kelola Halaman Tentang</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {message.text && <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}

          {/* Visi & Misi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Target size={16} /> Visi Organisasi</label>
              <textarea value={vision} onChange={(e) => setVision(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl h-24" required />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Flag size={16} /> Misi Organisasi</label>
              <div className="space-y-2">
                {mission.map((m, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="text" value={m} onChange={(e) => handleMissionChange(index, e.target.value)} className="flex-1 p-3 bg-gray-50 border rounded-xl" placeholder={`Poin misi ke-${index + 1}`} />
                    <button type="button" onClick={() => handleRemoveMission(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleAddMission} className="mt-2 text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1"><Plus size={16} /> Tambah Misi</button>
            </div>
          </div>

          {/* Sejarah & Logo */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><BookOpen size={16} /> Sejarah Organisasi</label>
              <textarea value={history} onChange={(e) => setHistory(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl h-40" required />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Upload size={16} /> Logo Organisasi</label>
              <div className="flex items-center gap-4">
                {logoUrl && <img src={logoUrl} alt="Logo" className="w-20 h-20 object-contain rounded-full border p-1 bg-gray-50" />}
                <input type="file" onChange={handleLogoUpload} className="text-sm" disabled={uploading} />
                {uploading && <p className="text-sm text-gray-500">Mengunggah...</p>}
              </div>
            </div>
          </div>

          {/* Filosofi Logo */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4"><Lightbulb size={16} /> Filosofi Logo</label>
            <div className="space-y-4">
              {philosophy.map((p, index) => (
                <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-2 relative">
                  <input type="text" value={p.title} onChange={(e) => handlePhilChange(index, 'title', e.target.value)} className="w-full p-3 border rounded-xl" placeholder="Judul Poin Filosofi" required />
                  <textarea value={p.desc} onChange={(e) => handlePhilChange(index, 'desc', e.target.value)} className="w-full p-3 border rounded-xl h-24" placeholder="Deskripsi poin filosofi" required />
                  <button type="button" onClick={() => handleRemovePhilosophy(index)} className="absolute -top-2 -right-2 p-2 text-red-500 bg-white border rounded-full shadow-sm hover:bg-red-50"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddPhilosophy} className="mt-4 text-emerald-600 font-semibold text-sm hover:underline flex items-center gap-1"><Plus size={16} /> Tambah Poin Filosofi</button>
          </div>

          <button type="submit" disabled={isLoading || uploading} className="w-full bg-emerald-700 text-white font-bold py-4 rounded-2xl hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={20} /> {isLoading ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAbout;