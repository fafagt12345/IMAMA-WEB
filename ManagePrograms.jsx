import React, { useState } from 'react';
import { db, storage } from './firebase/config';
import { collection, addDoc, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useFetch } from './hooks/useFetch';
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

const ManagePrograms = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const { deleteItem, loading: isDeleting } = useFirebaseDeletion('programs');

  const { data: programsList } = useFetch('programs', 'createdAt');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = currentImageUrl;

      if (image) {
        // Hapus foto lama jika sedang edit dan upload foto baru
        if (currentImageUrl) {
          const oldRef = ref(storage, getStoragePathFromUrl(currentImageUrl));
          try { await deleteObject(oldRef); } catch (err) { console.log("Error deleting old image:", err); }
        }

        const storageRef = ref(storage, `programs/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const programData = {
        name,
        description,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'programs', editingId), programData);
        alert("Program berhasil diperbarui!");
      } else {
        await addDoc(collection(db, 'programs'), {
          ...programData,
          createdAt: serverTimestamp(),
        });
        alert("Program berhasil ditambahkan!");
      }

      resetForm();
    } catch (error) {
      console.error("Error adding/updating program: ", error);
      alert("Terjadi kesalahan!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    const success = await deleteItem(id, imageUrl, "Hapus program kerja ini?");
    if (success) {
      // Feedback tambahan jika diperlukan
    }
  };

  const resetForm = () => {
    setName(''); setDescription(''); setImage(null); setEditingId(null); setCurrentImageUrl('');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-emerald-900">
          {editingId ? "Edit Program Kerja" : "Tambah Program Kerja Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Nama Program</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded focus:ring-emerald-500 outline-none" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded h-32 focus:ring-emerald-500 outline-none" required></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Gambar Program (Opsional)</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
            {currentImageUrl && <p className="mt-2 text-xs text-emerald-600">Gambar saat ini terpasang.</p>}
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-700 text-white font-bold py-2 rounded-lg hover:bg-emerald-800 transition disabled:bg-gray-400">
              {isSubmitting ? "Proses..." : (editingId ? "Simpan Perubahan" : "Tambah Program")}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-gray-300 px-4 rounded-lg">Batal</button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-emerald-900">Daftar Program Kerja</h2>
        <div className="space-y-4">
          {programsList.map((program) => (
            <div key={program.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h4 className="font-bold text-emerald-900 line-clamp-1">{program.name}</h4>
                <p className="text-xs text-gray-500">{program.createdAt?.toDate().toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(program.id); setName(program.name); setDescription(program.description); setCurrentImageUrl(program.imageUrl); }} className="text-blue-600 text-sm font-semibold">Edit</button>
                <button onClick={() => handleDelete(program.id, program.imageUrl)} disabled={isDeleting} className="text-red-600 text-sm font-semibold disabled:opacity-50">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePrograms;