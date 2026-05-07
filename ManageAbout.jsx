import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ManageAbout = () => {
  const [logo, setLogo] = useState(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');
  const [history, setHistory] = useState('');
  const [philosophy, setPhilosophy] = useState([
    { title: 'Warna Hijau', desc: '' },
    { title: 'Gunung Lawu', desc: '' },
    { title: 'Lingkaran', desc: '' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHistory(data.history || '');
        setPhilosophy(data.philosophy || philosophy);
        setCurrentLogoUrl(data.logoUrl || '');
      }
    };
    fetchAbout();
  }, []);

  const handleUpdatePhilosophy = (index, value) => {
    const newPhilosophy = [...philosophy];
    newPhilosophy[index].desc = value;
    setPhilosophy(newPhilosophy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = currentLogoUrl;
      if (logo) {
        const storageRef = ref(storage, `settings/logo_${Date.now()}`);
        await uploadBytes(storageRef, logo);
        logoUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'settings', 'about'), {
        history,
        philosophy,
        logoUrl,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert("Halaman Tentang berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-emerald-900">Kelola Halaman Tentang</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-4xl">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Upload Logo Organisasi</label>
          <input type="file" onChange={(e) => setLogo(e.target.files[0])} className="mb-2 text-sm" />
          {currentLogoUrl && <img src={currentLogoUrl} alt="Logo" className="h-20 bg-gray-100 p-2 rounded" />}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Sejarah Singkat</label>
          <textarea 
            value={history} 
            onChange={(e) => setHistory(e.target.value)} 
            className="w-full p-2 border rounded h-32"
          />
        </div>

        <h3 className="text-lg font-bold text-emerald-800 mb-4">Filosofi Warna & Logo</h3>
        {philosophy.map((item, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-emerald-50">
            <label className="block font-bold text-emerald-900 mb-1">{item.title}</label>
            <input 
              type="text" 
              placeholder="Masukkan penjelasan..."
              value={item.desc}
              onChange={(e) => handleUpdatePhilosophy(index, e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <button disabled={loading} className="w-full bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition">
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default ManageAbout;