import React, { useState } from 'react';
import { db, storage } from './firebase/config';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useFetch } from './hooks/useFetch';
import useFirebaseDeletion from './hooks/useFirebaseDeletion';

const ManageGallery = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: photos } = useFetch('gallery', 'createdAt');
  const { deleteItem, loading: isDeleting } = useFirebaseDeletion('gallery');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Pilih foto terlebih dahulu!");
    if (!image.type.startsWith('image/')) {
      return alert("Harap unggah file gambar yang valid!");
    }

    setIsSubmitting(true);

    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'gallery'), {
        title,
        imageUrl: url,
        createdAt: serverTimestamp(),
      });

      setTitle(''); setImage(null);
      alert("Foto berhasil ditambahkan ke galeri!");
    } catch (error) {
      console.error("Gallery Upload Error:", error);
      alert(`Gagal upload: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-emerald-900">Kelola Galeri Dokumentasi</h2>
      
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-xl shadow-md max-w-xl mb-10">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Keterangan Foto</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" placeholder="Contoh: Makrab 2023" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Pilih Foto</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm" required />
        </div>
        <button disabled={isSubmitting} className="w-full bg-emerald-700 text-white font-bold py-2 rounded-lg hover:bg-emerald-800 transition disabled:bg-gray-400">
          {isSubmitting ? "Mengunggah..." : "Tambah Foto"}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {photos.map((p) => (
          <div key={p.id} className="relative group bg-white p-2 rounded-lg shadow">
            <img src={p.imageUrl} className="w-full h-32 object-cover rounded" alt={p.title} />
            <p className="text-[10px] mt-1 truncate">{p.title}</p>
            <button 
              onClick={() => deleteItem(p.id, p.imageUrl, "Hapus foto ini?")}
              disabled={isDeleting}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageGallery;