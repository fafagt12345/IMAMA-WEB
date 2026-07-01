import React, { useState, useMemo } from 'react';
import { db, storage } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useFetch } from './hooks/useFetch';
import { Users, Edit, Trash2, UserPlus, X } from 'lucide-react';

const ManageStructure = () => {
  const { data: members = [], loading: fetchLoading } = useFetch('members', 'name');
  const { data: departments = [] } = useFetch('departments', 'name');

  const [formData, setFormData] = useState({
    name: '',
    prodi: '',
    position: '', // Jabatan: Ketua, Wakil, Staff
    departmentId: '',
    photoUrl: '',
  });
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const resetForm = () => {
    setFormData({ name: '', prodi: '', position: '', departmentId: '', photoUrl: '' });
    setPhoto(null);
    setEditingId(null);
    setError('');
    document.getElementById('member-form').reset();
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      prodi: member.prodi || '',
      position: member.position,
      departmentId: member.departmentId || '',
      photoUrl: member.photoUrl || '',
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id, photoUrl) => {
    if (window.confirm("Yakin ingin menghapus anggota ini?")) {
      await deleteDoc(doc(db, 'members', id));
      if (photoUrl) {
        try {
          const photoRef = ref(storage, photoUrl);
          await deleteObject(photoRef);
        } catch (err) {
          console.error("Gagal menghapus foto lama:", err);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      let photoUrl = formData.photoUrl;
      if (photo) {
        const storageRef = ref(storage, `members/${Date.now()}_${photo.name}`);
        await uploadBytes(storageRef, photo);
        photoUrl = await getDownloadURL(storageRef);
      }

      const memberData = {
        ...formData,
        photoUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'members', editingId), memberData);
      } else {
        await addDoc(collection(db, 'members'), {
          ...memberData,
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (err) {
      setError('Gagal menyimpan: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
          <Users /> Kelola Struktur Pengurus
        </h1>

        <form id="member-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-emerald-800 border-b pb-2">
            {editingId ? 'Edit Anggota' : 'Tambah Anggota Baru'}
          </h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Nama Lengkap" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="p-3 bg-gray-50 border rounded-xl" required />
            <input type="text" name="prodi" placeholder="Program Studi" value={formData.prodi} onChange={(e) => setFormData({ ...formData, prodi: e.target.value })} className="p-3 bg-gray-50 border rounded-xl" required />
            <input type="text" name="position" placeholder="Jabatan (Contoh: Ketua Departemen)" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="p-3 bg-gray-50 border rounded-xl" required />

            <select name="departmentId" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} className="p-3 bg-gray-50 border rounded-xl" required>
              <option value="">Pilih Departemen</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-2">Foto Anggota</label>
              <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              {editingId && formData.photoUrl && <img src={formData.photoUrl} alt="preview" className="w-20 h-20 mt-2 rounded-full object-cover"/>}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={isLoading} className="bg-emerald-700 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2">
              <UserPlus size={18} /> {isLoading ? 'Menyimpan...' : (editingId ? 'Update Anggota' : 'Tambah Anggota')}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold flex items-center gap-2"><X size={18}/> Batal</button>}
          </div>
        </form>

        <div className="space-y-8">
          {departments.map(dept => {
            const deptMembers = members.filter(m => m.departmentId === dept.id);
            if (deptMembers.length === 0) return null;

            return (
              <div key={dept.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <h3 className="p-4 bg-emerald-50 text-emerald-900 font-bold text-lg">{dept.name}</h3>
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="p-4 font-semibold uppercase text-xs">Nama</th>
                      <th className="p-4 font-semibold uppercase text-xs">Prodi</th>
                      <th className="p-4 font-semibold uppercase text-xs">Jabatan</th>
                      <th className="p-4 text-right font-semibold uppercase text-xs">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptMembers.sort((a, b) => {
                      const order = { 'Ketua': 1, 'Wakil': 2, 'Staff': 3 };
                      return (order[a.position] || 4) - (order[b.position] || 4);
                    }).map((member) => (
                      <tr key={member.id} className="border-t hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-700 flex items-center gap-3">
                          <img src={member.photoUrl || 'https://via.placeholder.com/40'} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                          {member.name}
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{member.prodi}</td>
                        <td className="p-4 text-gray-600 text-sm font-semibold">{member.position}</td>
                        <td className="p-4 text-right space-x-4">
                          <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(member.id, member.photoUrl)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManageStructure;