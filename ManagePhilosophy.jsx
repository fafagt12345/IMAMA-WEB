import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Lightbulb, Save, Plus, Trash2 } from 'lucide-react';

const ManagePhilosophy = () => {
  const [philosophy, setPhilosophy] = useState([{ title: '', desc: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPhilosophy(data.philosophy || [{ title: '', desc: '' }]);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await setDoc(doc(db, 'settings', 'about'), {
        philosophy: philosophy.filter(p => p.title.trim() !== '' || p.desc.trim() !== ''),
        updatedAt: new Date()
      }, { merge: true });
      setMessage({ type: 'success', text: 'Filosofi Logo berhasil diperbarui!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan: ' + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <Lightbulb size={24} />
          </div>
          <h1 className="text-2xl font-bold text-emerald-900">Kelola Filosofi Logo</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Poin-Poin Filosofi Logo</label>
            <div className="space-y-4">
              {philosophy.map((p, index) => (
                <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-2">
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => handlePhilChange(index, 'title', e.target.value)}
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Judul Filosofi (Contoh: Bentuk Lingkaran)"
                    required
                  />
                  <textarea
                    value={p.desc}
                    onChange={(e) => handlePhilChange(index, 'desc', e.target.value)}
                    className="w-full p-3 border rounded-xl h-24 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Deskripsi Filosofi (Contoh: Melambangkan persatuan dan kesatuan...)"
                    required
                  />
                  <button type="button" onClick={() => handleRemovePhilosophy(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 text-sm">
                    <Trash2 size={16} /> Hapus Poin
                  </button>
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

export default ManagePhilosophy;