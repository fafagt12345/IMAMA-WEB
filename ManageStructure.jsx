import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useFetch } from './hooks/useFetch'; // Menggunakan useFetch yang sudah ada
import useFirebaseDeletion from './hooks/useFirebaseDeletion';

const getStoragePathFromUrl = (downloadUrl) => {
  if (!downloadUrl) return '';
  try {
    const parsedUrl = new URL(downloadUrl);
    const match = parsedUrl.pathname.match(/\/o\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : downloadUrl;
  } catch {
    return downloadUrl;
  }
};

const ManageStructure = () => {
  const [activeTab, setActiveTab] = useState('departments'); // 'departments' or 'members'

  // State untuk Departemen
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [departmentColor, setDepartmentColor] = useState('#064e3b'); // Default emerald
  const [departmentIconUrl, setDepartmentIconUrl] = useState('');
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const { data: departments, loading: loadingDepartments } = useFetch('departments');

  // State untuk Pengurus
  const [memberName, setMemberName] = useState('');
  const [memberPosition, setMemberPosition] = useState('');
  const [memberDepartmentId, setMemberDepartmentId] = useState('');
  const [memberStudyProgram, setMemberStudyProgram] = useState('');
  const [memberBatch, setMemberBatch] = useState('');
  const [memberPhoto, setMemberPhoto] = useState(null);
  const [memberSocialMedia, setMemberSocialMedia] = useState(''); // JSON string or simple text
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [filterDeptId, setFilterDeptId] = useState('all');
  const [currentMemberPhotoUrl, setCurrentMemberPhotoUrl] = useState(''); // Untuk menyimpan URL foto lama saat edit
  const { data: members, loading: loadingMembers } = useFetch('members');

  const [loading, setLoading] = useState(false);

  const { deleteItem: deleteDept, loading: isDeletingDept } = useFirebaseDeletion('departments');
  const { deleteItem: deleteMember, loading: isDeletingMember } = useFirebaseDeletion('members');

  // --- Departemen CRUD ---
  const handleAddOrUpdateDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const departmentData = {
        name: departmentName,
        description: departmentDescription,
        color: departmentColor,
        iconUrl: departmentIconUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingDepartmentId) {
        await updateDoc(doc(db, 'departments', editingDepartmentId), departmentData);
        alert('Departemen berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'departments'), { ...departmentData, createdAt: serverTimestamp() });
        alert('Departemen berhasil ditambahkan!');
      }
      resetDepartmentForm();
    } catch (error) {
      console.error('Error adding/updating department:', error);
      alert('Gagal menyimpan departemen.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartmentId(department.id);
    setDepartmentName(department.name);
    setDepartmentDescription(department.description);
    setDepartmentColor(department.color);
    setDepartmentIconUrl(department.iconUrl);
    setActiveTab('departments'); // Pastikan tab departemen aktif
  };

  const handleDeleteDepartment = async (id) => {
    const success = await deleteDept(id, null, 'Apakah Anda yakin ingin menghapus departemen ini?');
    if (success) {
      alert('Departemen berhasil dihapus!');
    } else {
      // Error ditangani oleh hook
    }
  };

  const resetDepartmentForm = () => {
    setEditingDepartmentId(null);
    setDepartmentName('');
    setDepartmentDescription('');
    setDepartmentColor('#064e3b');
    setDepartmentIconUrl('');
  };

  // --- Pengurus CRUD ---
  const handleAddOrUpdateMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = currentMemberPhotoUrl; // Pertahankan foto lama jika tidak ada yang baru diupload

      if (memberPhoto) {
        // Hapus foto lama jika ada dan foto baru diupload
        if (currentMemberPhotoUrl) {
          const oldPhotoRef = ref(storage, getStoragePathFromUrl(currentMemberPhotoUrl));
          try {
            await deleteObject(oldPhotoRef);
          } catch (error) {
            console.warn("Could not delete old photo, might not exist or permissions issue:", error);
          }
        }
        const storageRef = ref(storage, `members/${Date.now()}_${memberPhoto.name}`);
        await uploadBytes(storageRef, memberPhoto);
        photoUrl = await getDownloadURL(storageRef);
      }

      const memberData = {
        name: memberName,
        position: memberPosition,
        departmentId: memberDepartmentId,
        studyProgram: memberStudyProgram,
        batch: memberBatch,
        profilePhotoUrl: photoUrl,
        socialMedia: memberSocialMedia,
        updatedAt: serverTimestamp(),
      };

      if (editingMemberId) {
        await updateDoc(doc(db, 'members', editingMemberId), memberData);
        alert('Pengurus berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'members'), { ...memberData, createdAt: serverTimestamp() });
        alert('Pengurus berhasil ditambahkan!');
      }
      resetMemberForm();
    } catch (error) {
      console.error('Error adding/updating member:', error);
      alert('Gagal menyimpan pengurus.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = (member) => {
    setEditingMemberId(member.id);
    setMemberName(member.name);
    setMemberPosition(member.position);
    setMemberDepartmentId(member.departmentId);
    setMemberStudyProgram(member.studyProgram);
    setMemberBatch(member.batch);
    setCurrentMemberPhotoUrl(member.profilePhotoUrl); // Simpan URL foto lama
    setMemberSocialMedia(member.socialMedia || '');
    setMemberPhoto(null); // Reset input file
    setActiveTab('members'); // Pastikan tab pengurus aktif
  };

  const handleDeleteMember = async (id, photoUrl) => {
    const success = await deleteMember(id, photoUrl, 'Apakah Anda yakin ingin menghapus pengurus ini?');
    if (success) {
      alert('Pengurus berhasil dihapus!');
    } else {
      // Error ditangani oleh hook
    }
  };

  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMemberName('');
    setMemberPosition('');
    setMemberDepartmentId('');
    setMemberStudyProgram('');
    setMemberBatch('');
    setMemberPhoto(null);
    setCurrentMemberPhotoUrl('');
    setMemberSocialMedia('');
  };

  const filteredMembers = filterDeptId === 'all' 
    ? members 
    : members.filter(m => m.departmentId === filterDeptId);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-emerald-900">Kelola Struktur Organisasi</h2>

      <div className="mb-8 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'departments' ? 'text-emerald-600 border-emerald-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              onClick={() => setActiveTab('departments')}
            >
              Departemen
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'members' ? 'text-emerald-600 border-emerald-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              onClick={() => setActiveTab('members')}
            >
              Pengurus
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Departemen */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Departemen */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-emerald-800">{editingDepartmentId ? 'Edit Departemen' : 'Tambah Departemen Baru'}</h3>
            <form onSubmit={handleAddOrUpdateDepartment}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Nama Departemen</label>
                <input type="text" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
                <textarea value={departmentDescription} onChange={(e) => setDepartmentDescription(e.target.value)} className="w-full p-2 border rounded h-24 focus:ring-emerald-500"></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Warna Khas (Hex)</label>
                <input type="color" value={departmentColor} onChange={(e) => setDepartmentColor(e.target.value)} className="w-full h-10 border rounded focus:ring-emerald-500" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">URL Icon (Opsional)</label>
                <input type="text" value={departmentIconUrl} onChange={(e) => setDepartmentIconUrl(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500" placeholder="https://example.com/icon.png" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-800 transition disabled:bg-gray-400">
                  {loading ? 'Menyimpan...' : (editingDepartmentId ? 'Update Departemen' : 'Tambah Departemen')}
                </button>
                {editingDepartmentId && (
                  <button type="button" onClick={resetDepartmentForm} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Daftar Departemen */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-emerald-800">Daftar Departemen</h3>
            {loadingDepartments ? (
              <p>Memuat departemen...</p>
            ) : (
              <ul className="space-y-3">
                {departments.map((dept) => (
                  <li key={dept.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                    <span className="font-medium text-gray-800">{dept.name}</span>
                    <div>
                      <button onClick={() => handleEditDepartment(dept)} disabled={isDeletingDept} className="text-blue-600 hover:text-blue-800 mr-3 disabled:opacity-50">Edit</button>
                      <button onClick={() => handleDeleteDepartment(dept.id)} disabled={isDeletingDept} className="text-red-600 hover:text-red-800 disabled:opacity-50">Hapus</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Tab Pengurus */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Pengurus */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-emerald-800">{editingMemberId ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}</h3>
            <form onSubmit={handleAddOrUpdateMember}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Nama Lengkap</label>
                <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Jabatan</label>
                <input type="text" value={memberPosition} onChange={(e) => setMemberPosition(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500" placeholder="Ketua Departemen, Staff Infokom, dll." required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Departemen</label>
                <select value={memberDepartmentId} onChange={(e) => setMemberDepartmentId(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500" required>
                  <option value="">Pilih Departemen</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Program Studi</label>
                <input type="text" value={memberStudyProgram} onChange={(e) => setMemberStudyProgram(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Angkatan</label>
                <input type="text" value={memberBatch} onChange={(e) => setMemberBatch(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500" placeholder="2020" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Foto Profil</label>
                <input type="file" onChange={(e) => setMemberPhoto(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                {currentMemberPhotoUrl && !memberPhoto && (
                  <p className="text-sm text-gray-500 mt-1">Foto saat ini: <a href={currentMemberPhotoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lihat Foto</a></p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Sosial Media (Opsional)</label>
                <input type="text" value={memberSocialMedia} onChange={(e) => setMemberSocialMedia(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500" placeholder="Link Instagram, LinkedIn, dll." />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-800 transition disabled:bg-gray-400">
                  {loading ? 'Menyimpan...' : (editingMemberId ? 'Update Pengurus' : 'Tambah Pengurus')}
                </button>
                {editingMemberId && (
                  <button type="button" onClick={resetMemberForm} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Daftar Pengurus */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-xl font-bold text-emerald-800">Daftar Pengurus</h3>
              <select 
                value={filterDeptId} 
                onChange={(e) => setFilterDeptId(e.target.value)}
                className="p-2 border rounded-lg text-sm focus:ring-emerald-500 outline-none bg-emerald-50 text-emerald-900 font-semibold"
              >
                <option value="all">Semua Departemen</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            {loadingMembers || loadingDepartments ? (
              <p>Memuat pengurus...</p>
            ) : (
              <ul className="space-y-3">
                {filteredMembers.map((member) => {
                  const dept = departments.find(d => d.id === member.departmentId);
                  return (
                    <li key={member.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                      <div>
                        <span className="font-medium text-gray-800">{member.name}</span>
                        <p className="text-sm text-gray-600">{member.position} - {dept ? dept.name : 'Tidak Diketahui'}</p>
                      </div>
                      <div>
                        <button onClick={() => handleEditMember(member)} disabled={isDeletingMember} className="text-blue-600 hover:text-blue-800 mr-3 disabled:opacity-50">Edit</button>
                        <button onClick={() => handleDeleteMember(member.id, member.profilePhotoUrl)} disabled={isDeletingMember} className="text-red-600 hover:text-red-800 disabled:opacity-50">Hapus</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStructure;