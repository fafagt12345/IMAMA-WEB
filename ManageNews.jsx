import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useFetch } from '../../hooks/useFetch';
import useFirebaseDeletion from '../../hooks/useFirebaseDeletion';

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

const ManageNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const { deleteItem, loading: isDeleting } = useFirebaseDeletion('news');

  const { data: newsList } = useFetch('news', 'createdAt');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = currentImageUrl;

      if (image && !image.type.startsWith('image/')) {
        return alert("Harap unggah file gambar yang valid!");
      }

      setIsSubmitting(true);

      if (image) {
        // Hapus foto lama jika sedang edit dan upload foto baru
        if (currentImageUrl) {
          const oldRef = ref(storage, getStoragePathFromUrl(currentImageUrl));
          try { await deleteObject(oldRef); } catch (err) { console.log(err); }
        }

        const storageRef = ref(storage, `news/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const newsData = {
        title,
        content,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), newsData);
        alert("Berita berhasil diperbarui!");
      } else {
        await addDoc(collection(db, 'news'), {
          ...newsData,
          createdAt: serverTimestamp(),
        });
        alert("Berita berhasil dipublikasikan!");
      }

      resetForm();
    } catch (error) {
      console.error("News Submission Error:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle(''); setContent(''); setImage(null); setEditingId(null); setCurrentImageUrl('');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-emerald-900">
          {editingId ? "Edit Berita" : "Tambah Berita Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Judul Berita</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Isi Berita</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-32 focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Thumbnail Gambar</label>
          <input 
            type="file" 
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {currentImageUrl && <p className="mt-2 text-xs text-emerald-600">Gambar sudah ada terpasang.</p>}
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-emerald-700 text-white font-bold py-2 rounded-lg hover:bg-emerald-800 transition disabled:bg-gray-400"
          >
            {isSubmitting ? "Proses..." : (editingId ? "Simpan Perubahan" : "Publish Berita")}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-300 px-4 rounded-lg">Batal</button>
          )}
        </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-emerald-900">Daftar Berita</h2>
        <div className="space-y-4">
          {newsList.map((n) => (
            <div key={n.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h4 className="font-bold text-emerald-900 line-clamp-1">{n.title}</h4>
                <p className="text-xs text-gray-500">{n.createdAt?.toDate().toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingId(n.id);
                    setTitle(n.title);
                    setContent(n.content);
                    setCurrentImageUrl(n.imageUrl);
                  }}
                  className="text-blue-600 text-sm font-semibold"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteItem(n.id, n.imageUrl, "Hapus berita ini?")}
                  disabled={isDeleting}
                  className="text-red-600 text-sm font-semibold disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageNews;