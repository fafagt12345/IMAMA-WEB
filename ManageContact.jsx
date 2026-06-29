import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Phone, Mail, User, Instagram, Youtube, Save, ShoppingBag } from 'lucide-react';

// Komponen SVG untuk logo TikTok
const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const ManageContact = () => {
  const [contact, setContact] = useState({
    address: '',
    email: '',
    phone: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    ketua: '',
    wakil: '',
    instagram_ekraf: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      const docRef = doc(db, 'settings', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContact({
          address: data.address || '',
          email: data.email || '',
          phone: data.phone || '',
          instagram: data.instagram || '',
          tiktok: data.tiktok || '',
          youtube: data.youtube || '',
          ketua: data.ketua || '',
          wakil: data.wakil || '',
          instagram_ekraf: data.instagram_ekraf || '',
        });
      }
    };
    fetchContact();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'contact'), {
        ...contact,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert('Informasi kontak berhasil diperbarui!');
    } catch (error) {
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8">Kelola Informasi Kontak & Sosial Media</h1>
        
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <div className="relative"><div className="absolute left-3 top-3.5 text-gray-400"><Mail size={18} /></div><input type="email" name="email" value={contact.email} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>

            {/* Telepon/WA */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Telepon / WhatsApp</label>
              <div className="relative"><div className="absolute left-3 top-3.5 text-gray-400"><Phone size={18} /></div><input type="text" name="phone" value={contact.phone} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>

            {/* Ketua IMAMA */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ketua IMAMA</label>
              <div className="relative"><div className="absolute left-3 top-3.5 text-gray-400"><User size={18} /></div><input type="text" name="ketua" value={contact.ketua} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>

            {/* Wakil Ketua IMAMA */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Wakil Ketua IMAMA</label>
              <div className="relative"><div className="absolute left-3 top-3.5 text-gray-400"><User size={18} /></div><input type="text" name="wakil" value={contact.wakil} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>


            {/* Instagram */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Instagram</label>
              <div className="relative"><div className="absolute left-3 top-3.5 text-gray-400"><Instagram size={18} /></div><input type="text" name="instagram" placeholder="imama_unesa" value={contact.instagram} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>

            {/* Instagram Ekraf */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Instagram Ekraf</label>
              <div className="relative"><div className="absolute left-3 top-3.5 text-gray-400"><ShoppingBag size={18} /></div><input type="text" name="instagram_ekraf" placeholder="imamaekraf" value={contact.instagram_ekraf} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>


            {/* TikTok */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">TikTok</label>
              <div className="relative"><div className="absolute left-3 top-3.5 text-gray-400"><TiktokIcon /></div><input type="text" name="tiktok" placeholder="@imama.unesa" value={contact.tiktok} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">YouTube</label>
              <div className="relative"><div className="absolute left-3 top-3.5 text-gray-400"><Youtube size={18} /></div><input type="text" name="youtube" placeholder="IMAMA UNESA" value={contact.youtube} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors disabled:opacity-50">
            <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageContact;