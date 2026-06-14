import React, { useEffect, useMemo, useState } from 'react';
import { db, auth, storage } from './config';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Edit2, Eye, EyeOff, Filter, Plus, Search, Trash2 } from 'lucide-react';

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

const ManageEvents = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    type: 'event',
    description: '',
    date: '',
    status: 'aktif',
    location: '',
    imageUrl: '',
    registrationUrl: '',
  });

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'events_contests'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('Error loading events:', err);
        setError('Tidak dapat memuat data event/lomba saat ini.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return items.filter((item) => {
      const matchesSearch = !term || [item.title, item.description, item.type].join(' ').toLowerCase().includes(term);
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / 6));
  const pageItems = filteredItems.slice((page - 1) * 6, page * 6);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, statusFilter]);

  const resetForm = () => {
    setFormData({ id: '', title: '', type: 'event', description: '', date: '', status: 'aktif', location: '', imageUrl: '', registrationUrl: '' });
    setIsEditing(false);
    setImageFile(null);
    setCurrentImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (imageFile && !imageFile.type.startsWith('image/')) {
        setError('Harap unggah file gambar yang valid.');
        return;
      }

      let imageUrl = currentImageUrl || formData.imageUrl || '';

      if (imageFile) {
        if (currentImageUrl || formData.imageUrl) {
          try {
            const oldRef = ref(storage, getStoragePathFromUrl(currentImageUrl || formData.imageUrl));
            await deleteObject(oldRef);
          } catch (cleanupErr) {
            console.warn('Tidak ada file lama yang dihapus:', cleanupErr);
          }
        }

        const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        title: formData.title.trim(),
        type: formData.type,
        description: formData.description.trim(),
        date: formData.date,
        location: formData.location.trim(),
        imageUrl: imageUrl.trim(),
        registrationUrl: formData.registrationUrl.trim(),
        status: formData.status || 'aktif',
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.email || 'admin',
      };

      if (isEditing) {
        await updateDoc(doc(db, 'events_contests', formData.id), payload);
      } else {
        await addDoc(collection(db, 'events_contests'), {
          ...payload,
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser?.email || 'admin',
        });
      }

      resetForm();
      setError('');
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Gagal menyimpan data. Periksa koneksi database Anda.');
    }
  };

  const toggleStatus = async (item) => {
    const nextStatus = item.status === 'aktif' ? 'nonaktif' : 'aktif';
    await updateDoc(doc(db, 'events_contests', item.id), {
      status: nextStatus,
      updatedAt: serverTimestamp(),
      updatedBy: auth.currentUser?.email || 'admin',
    });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus ${item.title}?`)) return;

    try {
      if (item.imageUrl) {
        const storageRef = ref(storage, getStoragePathFromUrl(item.imageUrl));
        try {
          await deleteObject(storageRef);
        } catch (cleanupErr) {
          console.warn('Gambar lama tidak dihapus dari storage:', cleanupErr);
        }
      }

      await deleteDoc(doc(db, 'events_contests', item.id));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Gagal menghapus data event/lomba.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Menu Admin</p>
          <h2 className="text-2xl font-bold text-emerald-950">Kelola Event & Lomba</h2>
          <p className="text-sm text-slate-500">Tambahkan, edit, aktifkan, dan hapus data event/lomba dengan pencarian, filter, serta status real-time.</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Total data: {filteredItems.length}</div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Judul event atau lomba"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="event">Event</option>
            <option value="lomba">Lomba</option>
          </select>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
        <div className="space-y-4">
          <input
            type="date"
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Lokasi event / tempat lomba"
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
            <label className="block font-semibold text-slate-700">Unggah gambar event/lomba</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <p className="text-xs text-slate-500">Jika tidak memilih file baru, gambar yang sudah tersimpan akan tetap dipakai.</p>
            {currentImageUrl && (
              <p className="text-xs text-emerald-700">Gambar saat ini: {currentImageUrl}</p>
            )}
          </div>
          <input
            type="url"
            placeholder="Link pendaftaran / detail (opsional)"
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            value={formData.registrationUrl}
            onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
          />
          <textarea
            placeholder="Deskripsi singkat event atau lomba"
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">
            {isEditing ? <><Edit2 size={16} /> Simpan Perubahan</> : <><Plus size={16} /> Tambah Data</>}
          </button>
        </div>
      </form>

      <div className="mb-4 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
        <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
          <Search size={16} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul, deskripsi, atau tipe"
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs uppercase tracking-[0.35em] text-slate-500"><Filter size={13} /> Filter</span>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
            <option value="all">Semua tipe</option>
            <option value="event">Event</option>
            <option value="lomba">Lomba</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
            <option value="all">Semua status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Memuat data event & lomba…</div>
      ) : pageItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">Belum ada data yang cocok dengan pencarian atau filter saat ini.</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-emerald-50 text-emerald-900">
              <tr>
                <th className="px-4 py-3 font-semibold">Judul</th>
                <th className="px-4 py-3 font-semibold">Tipe</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {pageItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.description || 'Tidak ada deskripsi'}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{item.type}</td>
                  <td className="px-4 py-3 text-slate-600">{item.date}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.status || 'aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => toggleStatus(item)} className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700" title="Ubah status">
                        {item.status === 'aktif' ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button type="button" onClick={() => {
                        setIsEditing(true);
                        setFormData(item);
                        setCurrentImageUrl(item.imageUrl || '');
                        setImageFile(null);
                      }} className="rounded-xl border border-slate-200 p-2 text-blue-600 transition hover:bg-blue-50" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(item)} className="rounded-xl border border-slate-200 p-2 text-red-500 transition hover:bg-red-50" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <p>Menampilkan {pageItems.length} dari {filteredItems.length} data</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className="rounded-xl border border-slate-200 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">Sebelumnya</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPage(num)}
              className={`rounded-xl border px-3 py-2 ${page === num ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
            >
              {num}
            </button>
          ))}
          <button type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages} className="rounded-xl border border-slate-200 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">Berikutnya</button>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;