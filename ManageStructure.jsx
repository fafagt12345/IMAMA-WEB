import React, { useState } from 'react';
import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFetch } from './hooks/useFetch';

const ManageStructure = () => {
  const { data: members = [] } = useFetch('members');
  const { data: departments = [] } = useFetch('departments');

  const [memberName, setMemberName] = useState('');
  const [memberPosition, setMemberPosition] = useState('');
  const [memberBatch, setMemberBatch] = useState('');
  const [memberStudyProgram, setMemberStudyProgram] = useState('');
  const [memberDepartmentId, setMemberDepartmentId] = useState('');
  const [memberPhoto, setMemberPhoto] = useState(null);
  const [currentMemberPhotoUrl, setCurrentMemberPhotoUrl] = useState('');
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddOrUpdateMember = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      let photoUrl = currentMemberPhotoUrl;

      if (memberPhoto) {
        const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!CLOUD_NAME || !UPLOAD_PRESET) {
          throw new Error("Konfigurasi Cloudinary (Cloud Name/Preset) belum diatur di Environment Variables.");
        }

        const formData = new FormData();
        formData.append('file', memberPhoto);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error("Gagal mengunggah ke Cloudinary");
        const data = await response.json();
        photoUrl = data.secure_url;
      }

      const memberData = {
        name: memberName,
        position: memberPosition,
        batch: memberBatch,
        studyProgram: memberStudyProgram,
        departmentId: memberDepartmentId,
        profilePhotoUrl: photoUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingMemberId) {
        await updateDoc(doc(db, 'members', editingMemberId), memberData);
        setEditingMemberId(null);
        setSuccessMessage('Berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'members'), { ...memberData, createdAt: serverTimestamp() });
        setSuccessMessage('Berhasil ditambahkan!');
      }

      setMemberName(''); setMemberPosition(''); setMemberBatch(''); setMemberStudyProgram(''); setMemberDepartmentId(''); setMemberPhoto(null); setCurrentMemberPhotoUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6">Kelola Struktur</h1>

        <form onSubmit={handleAddOrUpdateMember} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {error && <div className="md:col-span-2 text-red-500 text-sm">{error}</div>}
          {successMessage && <div className="md:col-span-2 text-emerald-600 text-sm">{successMessage}</div>}
          <input type="text" placeholder="Nama" value={memberName} onChange={(e) => setMemberName(e.target.value)} className="p-2 border rounded" required />
          <input type="text" placeholder="Jabatan" value={memberPosition} onChange={(e) => setMemberPosition(e.target.value)} className="p-2 border rounded" required />
          <input type="text" placeholder="Angkatan" value={memberBatch} onChange={(e) => setMemberBatch(e.target.value)} className="p-2 border rounded" required />
          <input type="text" placeholder="Prodi" value={memberStudyProgram} onChange={(e) => setMemberStudyProgram(e.target.value)} className="p-2 border rounded" required />
          <select value={memberDepartmentId} onChange={(e) => setMemberDepartmentId(e.target.value)} className="p-2 border rounded" required>
            <option value="">Pilih Departemen</option>
            {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input type="file" onChange={(e) => setMemberPhoto(e.target.files[0])} className="text-sm" />
          <button type="submit" disabled={isLoading} className="md:col-span-2 bg-emerald-700 text-white py-2 rounded font-bold">
            {isLoading ? 'Loading...' : editingMemberId ? 'Simpan Perubahan' : 'Tambah Pengurus'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members?.map((m) => (
            <div key={m.id} className="bg-white p-4 rounded shadow flex items-center space-x-4">
              <img src={m.profilePhotoUrl || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-full object-cover" alt="" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{m.name}</h4>
                <div className="flex space-x-2 mt-1">
                  <button onClick={() => {
                    setEditingMemberId(m.id);
                    setMemberName(m.name);
                    setMemberPosition(m.position);
                    setMemberBatch(m.batch);
                    setMemberStudyProgram(m.studyProgram);
                    setMemberDepartmentId(m.departmentId);
                    setCurrentMemberPhotoUrl(m.profilePhotoUrl);
                  }} className="text-blue-600 text-xs font-bold">Edit</button>
                  <button onClick={async () => {
                    if(confirm("Hapus?")) {
                      await deleteDoc(doc(db, 'members', m.id));
                    }
                  }} className="text-red-600 text-xs font-bold">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageStructure;
