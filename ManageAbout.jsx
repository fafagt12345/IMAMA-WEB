import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVision(data.vision || '');
        setMission(data.mission || ['']);
        setHistory(data.history || '');
        setPhilosophy(data.philosophy || [{ title: '', desc: '' }]);
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
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal upload: ' + err.message });
    } finally { setUploading(false); }
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

          <button type="submit" disabled={isLoading} className="w-full bg-emerald-700 text-white font-bold py-4 rounded-2xl hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2">
            <Save size={20} /> {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAbout;