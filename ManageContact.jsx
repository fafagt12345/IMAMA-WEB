import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Phone, Save, Mail, MapPin } from 'lucide-react';

const ManageContact = () => {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'contact'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAddress(data.address || ''); setEmail(data.email || ''); setPhone(data.phone || '');
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'contact'), { address, email, phone, updatedAt: serverTimestamp() });
      alert("Kontak diperbarui!");
    } catch (err) { alert(err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-2"><Phone /> Kelola Kontak</h1>
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><MapPin size={16} /> Alamat</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl h-24" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Mail size={16} /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Phone size={16} /> WhatsApp</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" />
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