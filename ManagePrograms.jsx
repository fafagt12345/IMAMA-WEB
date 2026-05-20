import React, { useState } from 'react';
import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFetch } from './hooks/useFetch';
import { Briefcase, Trash2, Edit, Plus } from 'lucide-react';

const ManagePrograms = () => {
  const { data: programs = [] } = useFetch('programs');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = currentPhotoUrl;
      if (photo) {
        const formData = new FormData();
        formData.append('file', photo);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const pData = { name, description, imageUrl, updatedAt: serverTimestamp() };
      if (editingId) {
        await updateDoc(doc(db, 'programs', editingId), pData);
      } else {
        await addDoc(collection(db, 'programs'), { ...pData, createdAt: serverTimestamp() });
      }
      setName(''); setDescription(''); setPhoto(null); setCurrentPhotoUrl(''); setEditingId(null);
      e.target.reset();
    } catch (err) { alert("Error: " + err.message); } finally { setLoading(false); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-2">
          <Briefcase /> Kelola Program Kerja
        </h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nama Program" value={name} onChange={(e) => setName(e.target.value)} className="p-3 bg-gray-50 border rounded-xl outline-none" required />
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="text-sm p-2" />
          </div>
          <textarea placeholder="Deskripsi Program Kerja..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl outline-none h-32" required />
          <button type="submit" disabled={loading} className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            {loading ? 'Memproses...' : (editingId ? 'Update Program' : 'Tambah Program')}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <img src={p.imageUrl || 'https://via.placeholder.com/400x200'} className="w-full h-48 object-cover" alt="" />
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-emerald-900 text-lg mb-2">{p.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{p.description}</p>
                <div className="flex justify-end gap-3 mt-auto pt-4 border-t">
                  <button onClick={() => { setEditingId(p.id); setName(p.name); setDescription(p.description); setCurrentPhotoUrl(p.imageUrl); window.scrollTo(0,0); }} className="text-blue-600 flex items-center gap-1 font-bold text-sm"><Edit size={16}/> Edit</button>
                  <button onClick={() => confirm("Hapus program ini?") && deleteDoc(doc(db, 'programs', p.id))} className="text-red-600 flex items-center gap-1 font-bold text-sm"><Trash2 size={16}/> Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePrograms;