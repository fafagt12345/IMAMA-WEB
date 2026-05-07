import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const ManageContact = () => {
  const [contact, setContact] = useState({
    whatsapp: '',
    instagram: '',
    tiktok: '',
    email: '',
    address: '',
    mapsUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      const docRef = doc(db, 'settings', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContact(docSnap.data());
      }
    };
    fetchContact();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'contact'), {
        ...contact,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert("Informasi kontak berhasil diperbarui!");
    } catch (error) {
      alert("Gagal memperbarui kontak.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-emerald-900">Kelola Kontak & Sosial Media</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">WhatsApp (628xxx)</label>
            <input type="text" value={contact.whatsapp} onChange={(e) => setContact({...contact, whatsapp: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Username Instagram</label>
            <input type="text" value={contact.instagram} onChange={(e) => setContact({...contact, instagram: e.target.value})} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Username TikTok</label>
            <input type="text" value={contact.tiktok} onChange={(e) => setContact({...contact, tiktok: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email Organisasi</label>
            <input type="email" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Alamat Lengkap</label>
          <textarea value={contact.address} onChange={(e) => setContact({...contact, address: e.target.value})} className="w-full p-2 border rounded h-20"></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">Google Maps Embed URL</label>
          <input type="text" value={contact.mapsUrl} onChange={(e) => setContact({...contact, mapsUrl: e.target.value})} className="w-full p-2 border rounded" placeholder="https://www.google.com/maps/embed?..." />
          <p className="text-xs text-gray-400 mt-1 italic">*Ambil dari menu Share {'>'} Embed a map di Google Maps</p>
        </div>
        <button disabled={loading} className="w-full bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition">
          {loading ? "Menyimpan..." : "Simpan Perubahan Kontak"}
        </button>
      </form>
    </div>
  );
};

export default ManageContact;