import React, { useState, useEffect } from 'react';
import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ShoppingCart, Trash2, Edit, Plus, Package, PackageCheck, PackageX, Star } from 'lucide-react';

const ManageMerchandise = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockStatus: 'Tersedia',
    stockCount: '',
    isFeatured: false,
    imageUrl: '',
  });
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'merchandise'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', stockStatus: 'Tersedia', stockCount: '', isFeatured: false, imageUrl: '' });
    setPhoto(null);
    setEditingId(null);
    document.getElementById('merch-form').reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (photo) {
        const cloudFormData = new FormData();
        cloudFormData.append('file', photo);
        cloudFormData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: cloudFormData });
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const productData = { ...formData, imageUrl, price: Number(formData.price), stockCount: Number(formData.stockCount), updatedAt: serverTimestamp() };

      if (editingId) {
        await updateDoc(doc(db, 'merchandise', editingId), productData);
      } else {
        await addDoc(collection(db, 'merchandise'), { ...productData, createdAt: serverTimestamp() });
      }
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData(product);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus produk ini?")) {
      await deleteDoc(doc(db, 'merchandise', id));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-3"><ShoppingCart /> Kelola Merchandise</h1>
        
        <form id="merch-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-100">
          <h2 className="md:col-span-2 text-lg font-semibold text-emerald-800 border-b pb-2">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          
          <input type="text" name="name" placeholder="Nama Produk" value={formData.name} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" required />
          <input type="number" name="price" placeholder="Harga (misal: 100000)" value={formData.price} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" required />
          <input type="text" name="category" placeholder="Kategori (misal: Kaos, Hoodie)" value={formData.category} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
          <input type="number" name="stockCount" placeholder="Jumlah Stok" value={formData.stockCount} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
          
          <select name="stockStatus" value={formData.stockStatus} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl">
            <option value="Tersedia">Tersedia</option>
            <option value="Habis">Habis</option>
          </select>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500" />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Produk Unggulan</label>
          </div>

          <textarea name="description" placeholder="Deskripsi singkat produk..." value={formData.description} onChange={handleChange} className="md:col-span-2 w-full p-3 bg-gray-50 border rounded-xl h-24" required />
          
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">Foto Produk</label>
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
            {editingId && formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="w-20 h-20 mt-2 rounded-lg object-cover"/>}
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button type="submit" disabled={loading} className="bg-emerald-700 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? 'Memproses...' : (editingId ? <><Edit size={16}/> Update Produk</> : <><Plus size={16}/> Tambah Produk</>)}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold">Batal</button>}
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
              <div className="relative">
                <img src={p.imageUrl || 'https://via.placeholder.com/400x300'} className="w-full h-48 object-cover" alt={p.name} />
                {p.isFeatured && <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full"><Star size={14}/></div>}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{p.category}</p>
                <h3 className="font-bold text-emerald-900 text-lg mb-2">{p.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{p.description}</p>
                <div className="text-lg font-bold text-emerald-700 mb-4">Rp{Number(p.price).toLocaleString('id-ID')}</div>
                
                <div className="flex justify-between text-xs font-semibold border-t pt-3 mt-auto">
                   <span className={`flex items-center gap-1 ${p.stockStatus === 'Tersedia' ? 'text-green-600' : 'text-red-600'}`}>
                    {p.stockStatus === 'Tersedia' ? <PackageCheck size={14}/> : <PackageX size={14}/>}
                    {p.stockStatus} ({p.stockCount})
                  </span>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 flex items-center gap-1"><Edit size={14}/> Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 flex items-center gap-1"><Trash2 size={14}/> Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMerchandise;