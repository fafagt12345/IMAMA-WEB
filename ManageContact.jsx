import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Phone, Save, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react'; // Import icons for social media

const ManageContact = () => {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'contact'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAddress(data.address || ''); setEmail(data.email || ''); setWhatsapp(data.whatsapp || '');
        setInstagram(data.instagram || ''); setTiktok(data.tiktok || ''); setMapsUrl(data.mapsUrl || '');
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'contact'), { address, email, whatsapp, instagram, tiktok, mapsUrl, updatedAt: new Date() }, { merge: true });
      alert("Kontak diperbarui!");
    } catch (err) { alert(err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-2"><Phone /> Kelola Kontak</h1>
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><MapPin size={16} /> Alamat Lengkap</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl h-24 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Masukkan alamat sekretariat..." />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <MapPin size={16} /> Google Maps Embed URL
            </label>
            <input 
              type="text" 
              value={mapsUrl} 
              onChange={(e) => setMapsUrl(e.target.value)} 
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
              placeholder="Tempelkan link 'src' dari iframe Google Maps..." 
            />
            <p className="text-[10px] text-gray-500 mt-1 italic">*Buka Google Maps > Bagikan > Sematkan Peta > Ambil link di dalam tanda kutip src="..."</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Mail size={16} /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="contoh@imama.org" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><MessageCircle size={16} /> WhatsApp (tanpa +)</label>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="6281234567890" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Instagram size={16} /> Instagram (username)</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="imama_unesa" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><i className="fab fa-tiktok text-base"></i> TikTok (username)</label> {/* Placeholder for TikTok icon */}
              <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="imama_unesa" />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
            <Save size={20} /> {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageContact;