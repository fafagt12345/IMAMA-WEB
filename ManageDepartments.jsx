import React, { useState } from 'react';
import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFetch } from './hooks/useFetch';
import { LayoutGrid, Edit, Trash2 } from 'lucide-react';

const ManageDepartments = () => {
  const { data: departments = [] } = useFetch('departments');
  const [deptName, setDeptName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deptDescription, setDeptDescription] = useState(''); // State baru untuk deskripsi
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'departments', editingId), {
          name: deptName,
          description: deptDescription, // Tambahkan deskripsi saat update
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'departments'), {
          name: deptName,
          description: deptDescription, // Tambahkan deskripsi saat tambah baru
          createdAt: serverTimestamp()
        });
      }
      setDeptName('');
      setDeptDescription(''); // Reset deskripsi setelah submit
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan departemen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus departemen ini? Anggota di dalamnya mungkin akan kehilangan referensi.")) {
      await deleteDoc(doc(db, 'departments', id));
      setDeptName(''); // Reset form jika item yang diedit dihapus
      setDeptDescription('');
      setEditingId(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
          <LayoutGrid /> Kelola Departemen
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Nama Departemen (Contoh: PSDA)" 
            value={deptName} 
            onChange={(e) => setDeptName(e.target.value)} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            required 
          />
          <textarea
            placeholder="Deskripsi Departemen (Contoh: Bertanggung jawab atas pengembangan sumber daya anggota)"
            value={deptDescription}
            onChange={(e) => setDeptDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            rows="3" // Memberikan tinggi awal untuk textarea
          ></textarea>
          <div className="flex items-center gap-3">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-emerald-700 text-white px-6 py-2 rounded font-bold hover:bg-emerald-800 transition disabled:opacity-50"
            >
              {isLoading ? '...' : (editingId ? 'Update' : 'Tambah')}
            </button>
            {editingId && ( // Tombol batal untuk mode edit
              <button type="button" onClick={() => {setEditingId(null); setDeptName(''); setDeptDescription('');}} className="text-gray-500 text-sm hover:underline">Batal</button>
            )}
          </div>
        </form>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-emerald-50 text-emerald-900">
              <tr>
                <th className="p-4 font-bold uppercase text-xs">Nama Departemen</th>
                <th className="p-4 font-bold uppercase text-xs">Deskripsi</th>
                <th className="p-4 text-right font-bold uppercase text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-700">{d.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{d.description || '-'}</td> {/* Tampilkan deskripsi */}
                  <td className="p-4 text-right space-x-4">
                    <button 
                      onClick={() => { setEditingId(d.id); setDeptName(d.name); setDeptDescription(d.description || ''); }} // Isi deskripsi saat edit
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(d.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;